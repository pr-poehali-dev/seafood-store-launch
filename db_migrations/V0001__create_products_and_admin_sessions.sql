CREATE TABLE IF NOT EXISTS t_p69761049_seafood_store_launch.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    category VARCHAR(100),
    emoji VARCHAR(10) DEFAULT '🎁',
    badge VARCHAR(50),
    rating NUMERIC(3,1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p69761049_seafood_store_launch.products (name, description, price, category, emoji, badge, rating, reviews_count) VALUES
('Керамическая кружка «Уют»', 'Ручная лепка, глазурь бежевых тонов', 1290, 'Керамика', '🍵', 'Хит', 4.8, 34),
('Соевая свеча «Лаванда»', '80 часов горения, хлопковый фитиль', 890, 'Свечи', '🕯️', 'Новинка', 4.9, 58),
('Льняной мешочек для подарка', 'С персонализацией, размер S/M/L', 350, 'Текстиль', '🎁', NULL, 4.7, 21),
('Деревянный медведь-сувенир', 'Ручная роспись, кедровое дерево', 1750, 'Деревянные', '🐻', NULL, 4.6, 15),
('Серьги «Первый снег»', 'Серебро 925, белая эмаль', 2100, 'Украшения', '❄️', 'Новинка', 5.0, 9),
('Набор открыток «Тепло»', '10 открыток с конвертами', 490, 'Открытки', '💌', 'Хит', 4.9, 42),
('Глиняный горшок для трав', 'С дренажными отверстиями, декор', 980, 'Керамика', '🌿', NULL, 4.7, 27),
('Свеча «Хвойный лес»', 'Аромат пихты и кедра, 100ч', 1100, 'Свечи', '🌲', NULL, 4.8, 33);

CREATE TABLE IF NOT EXISTS t_p69761049_seafood_store_launch.admin_sessions (
    id SERIAL PRIMARY KEY,
    token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);
