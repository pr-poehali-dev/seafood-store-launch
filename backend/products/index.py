"""API для управления товарами магазина: получение, создание, редактирование, удаление."""
import json
import os
import secrets
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


def jdumps(data):
    return json.dumps(data, cls=DecimalEncoder)


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def check_auth(headers):
    token = headers.get("x-auth-token") or headers.get("X-Auth-Token")
    if not token:
        return False
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id FROM {SCHEMA}.admin_sessions WHERE token = %s AND expires_at > NOW()",
                (token,)
            )
            return cur.fetchone() is not None


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    headers = event.get("headers") or {}

    # POST /login
    if method == "POST" and "login" in path:
        body = json.loads(event.get("body") or "{}")
        password = body.get("password", "")
        admin_password = os.environ.get("ADMIN_PASSWORD", "")
        if not admin_password or password != admin_password:
            return {"statusCode": 401, "headers": CORS, "body": jdumps({"error": "Неверный пароль"})}
        token = secrets.token_hex(32)
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.admin_sessions (token) VALUES (%s)",
                    (token,)
                )
            conn.commit()
        return {"statusCode": 200, "headers": CORS, "body": jdumps({"token": token})}

    # POST /logout
    if method == "POST" and "logout" in path:
        token = headers.get("x-auth-token") or headers.get("X-Auth-Token")
        if token:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(f"DELETE FROM {SCHEMA}.admin_sessions WHERE token = %s", (token,))
                conn.commit()
        return {"statusCode": 200, "headers": CORS, "body": jdumps({"ok": True})}

    # GET — публичный список товаров
    if method == "GET":
        only_active = not check_auth(headers)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if only_active:
                    cur.execute(
                        f"SELECT id, name, description, price, category, emoji, badge, rating, reviews_count FROM {SCHEMA}.products WHERE is_active = TRUE ORDER BY id"
                    )
                else:
                    cur.execute(
                        f"SELECT id, name, description, price, category, emoji, badge, rating, reviews_count, is_active, created_at FROM {SCHEMA}.products ORDER BY id"
                    )
                rows = cur.fetchall()
        return {"statusCode": 200, "headers": CORS, "body": jdumps([dict(r) for r in rows])}

    # Дальше только для авторизованных
    if not check_auth(headers):
        return {"statusCode": 403, "headers": CORS, "body": jdumps({"error": "Нет доступа"})}

    # POST — создать товар
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.products (name, description, price, category, emoji, badge, rating, reviews_count, is_active)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id, name, description, price, category, emoji, badge, rating, reviews_count, is_active""",
                    (body.get("name"), body.get("description"), body.get("price"), body.get("category"),
                     body.get("emoji", "🎁"), body.get("badge") or None, body.get("rating", 5.0),
                     body.get("reviews_count", 0), body.get("is_active", True))
                )
                row = dict(cur.fetchone())
            conn.commit()
        return {"statusCode": 201, "headers": CORS, "body": jdumps(row)}

    # PUT — обновить товар
    if method == "PUT":
        product_id = path.rstrip("/").split("/")[-1]
        body = json.loads(event.get("body") or "{}")
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    f"""UPDATE {SCHEMA}.products SET
                        name=%s, description=%s, price=%s, category=%s,
                        emoji=%s, badge=%s, rating=%s, reviews_count=%s, is_active=%s,
                        updated_at=NOW()
                        WHERE id=%s
                        RETURNING id, name, description, price, category, emoji, badge, rating, reviews_count, is_active""",
                    (body.get("name"), body.get("description"), body.get("price"), body.get("category"),
                     body.get("emoji", "🎁"), body.get("badge") or None, body.get("rating", 5.0),
                     body.get("reviews_count", 0), body.get("is_active", True), product_id)
                )
                row = cur.fetchone()
            conn.commit()
        if not row:
            return {"statusCode": 404, "headers": CORS, "body": jdumps({"error": "Товар не найден"})}
        return {"statusCode": 200, "headers": CORS, "body": jdumps(dict(row))}

    # DELETE — удалить товар
    if method == "DELETE":
        product_id = path.rstrip("/").split("/")[-1]
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(f"DELETE FROM {SCHEMA}.products WHERE id = %s", (product_id,))
            conn.commit()
        return {"statusCode": 200, "headers": CORS, "body": jdumps({"ok": True})}

    return {"statusCode": 405, "headers": CORS, "body": jdumps({"error": "Метод не поддерживается"})}
