import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/4fd5d6d6-6e1b-482a-8e4b-c633c84dcef9";

const CATEGORIES = ["Керамика", "Свечи", "Текстиль", "Деревянные", "Украшения", "Открытки"];
const BADGES = ["", "Хит", "Новинка"];
const EMOJIS = ["🎁", "🍵", "🕯️", "🎀", "🐻", "❄️", "💌", "🌿", "🌲", "🏺", "🧸", "🪆", "🖼️", "📿", "🍀"];

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  badge: string | null;
  rating: number;
  reviews_count: number;
  is_active: boolean;
};

const emptyProduct = (): Omit<Product, "id"> => ({
  name: "",
  description: "",
  price: 0,
  category: "Керамика",
  emoji: "🎁",
  badge: null,
  rating: 5.0,
  reviews_count: 0,
  is_active: true,
});

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id"> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const isLoggedIn = !!token;

  const authHeaders = { "Content-Type": "application/json", "X-Auth-Token": token };

  async function login() {
    setLoginLoading(true);
    setLoginError("");
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: loginPassword }),
    });
    const data = await res.json();
    setLoginLoading(false);
    if (res.ok && data.token) {
      setToken(data.token);
      localStorage.setItem("admin_token", data.token);
    } else {
      setLoginError(data.error || "Ошибка входа");
    }
  }

  async function logout() {
    await fetch(`${API}/logout`, { method: "POST", headers: authHeaders });
    setToken("");
    localStorage.removeItem("admin_token");
  }

  async function loadProducts() {
    setLoading(true);
    const res = await fetch(API, { headers: authHeaders });
    const data = await res.json();
    setLoading(false);
    if (Array.isArray(data)) setProducts(data);
  }

  useEffect(() => {
    if (isLoggedIn) loadProducts();
  }, [isLoggedIn]);

  async function saveProduct(p: Omit<Product, "id">) {
    setSaving(true);
    const res = await fetch(API, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(p),
    });
    setSaving(false);
    if (res.ok) {
      setNewProduct(null);
      loadProducts();
    }
  }

  async function updateProduct(p: Product) {
    setSaving(true);
    const res = await fetch(`${API}/${p.id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify(p),
    });
    setSaving(false);
    if (res.ok) {
      setEditProduct(null);
      loadProducts();
    }
  }

  async function deleteProduct(id: number) {
    await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders });
    setDeleteConfirm(null);
    loadProducts();
  }

  async function toggleActive(p: Product) {
    await fetch(`${API}/${p.id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ ...p, is_active: !p.is_active }),
    });
    loadProducts();
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: "#FDF8F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ background: "white", borderRadius: 24, padding: 40, width: "100%", maxWidth: 400, boxShadow: "0 24px 60px rgba(92,51,23,0.12)", border: "1px solid #EDE0C8" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🔐</span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "2rem", color: "#5C3317", margin: 0 }}>Панель администратора</h1>
            <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem", color: "#a0856d", margin: "8px 0 0" }}>Тепло &amp; Уют — магазин сувениров</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password"
              placeholder="Пароль администратора"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              style={{ padding: "14px 16px", borderRadius: 14, border: `2px solid ${loginError ? "#ef4444" : "#EDE0C8"}`, fontFamily: "Golos Text, sans-serif", fontSize: "1rem", outline: "none", color: "#5C3317", background: "#FDF8F0" }}
            />
            {loginError && <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.8rem", color: "#ef4444", margin: 0 }}>{loginError}</p>}
            <button
              onClick={login}
              disabled={loginLoading || !loginPassword}
              style={{ padding: "14px", borderRadius: 14, background: loginLoading || !loginPassword ? "#EDE0C8" : "#B5674D", color: loginLoading || !loginPassword ? "#a0856d" : "#FDF8F0", border: "none", fontFamily: "Golos Text, sans-serif", fontSize: "1rem", fontWeight: 500, cursor: loginLoading || !loginPassword ? "not-allowed" : "pointer", transition: "all 0.2s" }}
            >
              {loginLoading ? "Входим..." : "Войти"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const FormFields = ({ data, setData }: { data: Omit<Product, "id"> & { id?: number }; setData: (d: Omit<Product, "id"> & { id?: number }) => void }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="grid grid-cols-2 gap-3">
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Название товара</label>
          <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Название товара" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Цена (₽)</label>
          <input type="number" value={data.price} onChange={e => setData({ ...data, price: Number(e.target.value) })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Категория</label>
          <select value={data.category} onChange={e => setData({ ...data, category: e.target.value })} style={inputStyle}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Описание</label>
          <input value={data.description || ""} onChange={e => setData({ ...data, description: e.target.value })} placeholder="Краткое описание" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Бейдж</label>
          <select value={data.badge || ""} onChange={e => setData({ ...data, badge: e.target.value || null })} style={inputStyle}>
            {BADGES.map(b => <option key={b} value={b}>{b || "Без бейджа"}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Эмодзи</label>
          <select value={data.emoji} onChange={e => setData({ ...data, emoji: e.target.value })} style={inputStyle}>
            {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Рейтинг</label>
          <input type="number" step="0.1" min="0" max="5" value={data.rating} onChange={e => setData({ ...data, rating: parseFloat(e.target.value) })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Отзывов</label>
          <input type="number" value={data.reviews_count} onChange={e => setData({ ...data, reviews_count: Number(e.target.value) })} style={inputStyle} />
        </div>
        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData({ ...data, is_active: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#B5674D" }} />
          <label htmlFor="is_active" style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.9rem", color: "#5C3317", cursor: "pointer" }}>Показывать в каталоге</label>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FDF8F0" }}>
      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #EDE0C8", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.5rem" }}>🧡</span>
          <div>
            <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.3rem", color: "#5C3317", fontWeight: 600 }}>Панель управления</span>
            <span style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", display: "block", lineHeight: 1 }}>Тепло &amp; Уют</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/" target="_blank" style={{ padding: "8px 16px", borderRadius: 10, background: "#F5EDD8", color: "#8B4513", fontFamily: "Golos Text, sans-serif", fontSize: "0.8rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="ExternalLink" size={14} /> Сайт
          </a>
          <button onClick={logout} style={{ padding: "8px 16px", borderRadius: 10, background: "transparent", color: "#a0856d", border: "1px solid #EDE0C8", fontFamily: "Golos Text, sans-serif", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4" style={{ marginBottom: 28 }}>
          {[
            { label: "Всего товаров", value: products.length, emoji: "📦" },
            { label: "Активных", value: products.filter(p => p.is_active).length, emoji: "✅" },
            { label: "Скрытых", value: products.filter(p => !p.is_active).length, emoji: "🙈" },
          ].map(s => (
            <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "16px 20px", border: "1px solid #EDE0C8", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "1.75rem" }}>{s.emoji}</span>
              <div>
                <p style={{ fontFamily: "Cormorant, serif", fontSize: "1.75rem", fontWeight: 600, color: "#B5674D", margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", margin: 0 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Title + Add button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "1.75rem", color: "#5C3317", margin: 0 }}>Товары</h2>
          <button
            onClick={() => setNewProduct(emptyProduct())}
            style={{ padding: "10px 20px", borderRadius: 12, background: "#B5674D", color: "#FDF8F0", border: "none", fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#8B4513"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#B5674D"; }}
          >
            <Icon name="Plus" size={16} /> Добавить товар
          </button>
        </div>

        {/* New product form */}
        {newProduct && (
          <div style={{ background: "white", borderRadius: 18, padding: 24, border: "2px solid #D4956A", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.4rem", color: "#5C3317", margin: "0 0 18px" }}>Новый товар</h3>
            <FormFields data={newProduct} setData={setNewProduct} />
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                onClick={() => saveProduct(newProduct)}
                disabled={saving || !newProduct.name || !newProduct.price}
                style={{ padding: "12px 24px", borderRadius: 12, background: saving ? "#EDE0C8" : "#B5674D", color: saving ? "#a0856d" : "#FDF8F0", border: "none", fontFamily: "Golos Text, sans-serif", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "Сохраняем..." : "Сохранить"}
              </button>
              <button onClick={() => setNewProduct(null)} style={{ padding: "12px 24px", borderRadius: 12, background: "transparent", color: "#8B4513", border: "1px solid #EDE0C8", fontFamily: "Golos Text, sans-serif", cursor: "pointer" }}>
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Products list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#a0856d" }}>
            <span style={{ fontSize: "2rem", display: "block", marginBottom: 8 }}>⏳</span>
            <p style={{ fontFamily: "Golos Text, sans-serif" }}>Загружаем товары...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {products.map(p => (
              <div key={p.id}>
                {editProduct?.id === p.id ? (
                  <div style={{ background: "white", borderRadius: 18, padding: 24, border: "2px solid #D4956A" }}>
                    <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.4rem", color: "#5C3317", margin: "0 0 18px" }}>Редактировать товар</h3>
                    <FormFields data={editProduct} setData={setEditProduct} />
                    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                      <button
                        onClick={() => updateProduct(editProduct)}
                        disabled={saving}
                        style={{ padding: "12px 24px", borderRadius: 12, background: saving ? "#EDE0C8" : "#B5674D", color: saving ? "#a0856d" : "#FDF8F0", border: "none", fontFamily: "Golos Text, sans-serif", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}
                      >
                        {saving ? "Сохраняем..." : "Сохранить"}
                      </button>
                      <button onClick={() => setEditProduct(null)} style={{ padding: "12px 24px", borderRadius: 12, background: "transparent", color: "#8B4513", border: "1px solid #EDE0C8", fontFamily: "Golos Text, sans-serif", cursor: "pointer" }}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "white", borderRadius: 16, padding: "16px 20px", border: "1px solid #EDE0C8", display: "flex", alignItems: "center", gap: 14, opacity: p.is_active ? 1 : 0.6 }}>
                    <span style={{ fontSize: "2rem", flexShrink: 0 }}>{p.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <p style={{ fontFamily: "Golos Text, sans-serif", fontWeight: 500, color: "#5C3317", margin: 0, fontSize: "0.95rem" }}>{p.name}</p>
                        {p.badge && (
                          <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: "0.7rem", fontFamily: "Golos Text, sans-serif", background: p.badge === "Хит" ? "#B5674D" : "#D4956A", color: "#FDF8F0" }}>{p.badge}</span>
                        )}
                        {!p.is_active && (
                          <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: "0.7rem", fontFamily: "Golos Text, sans-serif", background: "#F5EDD8", color: "#a0856d", border: "1px solid #EDE0C8" }}>скрыт</span>
                        )}
                      </div>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.78rem", color: "#a0856d", margin: "2px 0 0" }}>{p.category} · ★ {p.rating} · {p.reviews_count} отзывов</p>
                    </div>
                    <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.3rem", color: "#B5674D", fontWeight: 600, flexShrink: 0 }}>{p.price.toLocaleString()} ₽</span>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => toggleActive(p)}
                        title={p.is_active ? "Скрыть" : "Показать"}
                        style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid #EDE0C8", background: "#F5EDD8", color: "#8B4513", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Icon name={p.is_active ? "EyeOff" : "Eye"} size={15} />
                      </button>
                      <button
                        onClick={() => setEditProduct(p)}
                        style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid #EDE0C8", background: "#F5EDD8", color: "#8B4513", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Icon name="Pencil" size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid #fca5a5", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete confirm */}
                {deleteConfirm === p.id && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                    <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem", color: "#dc2626", margin: 0 }}>Удалить «{p.name}»? Это нельзя отменить.</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => deleteProduct(p.id)} style={{ padding: "8px 16px", borderRadius: 10, background: "#ef4444", color: "white", border: "none", fontFamily: "Golos Text, sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>Удалить</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: "8px 16px", borderRadius: 10, background: "white", color: "#5C3317", border: "1px solid #EDE0C8", fontFamily: "Golos Text, sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>Отмена</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "Golos Text, sans-serif",
  fontSize: "0.78rem",
  color: "#a0856d",
  display: "block",
  marginBottom: 5,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #EDE0C8",
  fontFamily: "Golos Text, sans-serif",
  fontSize: "0.9rem",
  color: "#5C3317",
  background: "#FDF8F0",
  outline: "none",
  boxSizing: "border-box",
};