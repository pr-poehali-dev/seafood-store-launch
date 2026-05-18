import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/33d78019-499d-47e1-b113-ac6d418ebc45/files/f25e98d8-9b2b-46d0-8016-7902e068a2fe.jpg";

const CATEGORIES = ["Все", "Керамика", "Свечи", "Текстиль", "Деревянные", "Украшения", "Открытки"];

const PRODUCTS = [
  { id: 1, name: "Керамическая кружка «Уют»", price: 1290, category: "Керамика", rating: 4.8, reviews: 34, badge: "Хит", emoji: "🍵", desc: "Ручная лепка, глазурь бежевых тонов" },
  { id: 2, name: "Соевая свеча «Лаванда»", price: 890, category: "Свечи", rating: 4.9, reviews: 58, badge: "Новинка", emoji: "🕯️", desc: "80 часов горения, хлопковый фитиль" },
  { id: 3, name: "Льняной мешочек для подарка", price: 350, category: "Текстиль", rating: 4.7, reviews: 21, badge: null, emoji: "🎁", desc: "С персонализацией, размер S/M/L" },
  { id: 4, name: "Деревянный медведь-сувенир", price: 1750, category: "Деревянные", rating: 4.6, reviews: 15, badge: null, emoji: "🐻", desc: "Ручная роспись, кедровое дерево" },
  { id: 5, name: "Серьги «Первый снег»", price: 2100, category: "Украшения", rating: 5.0, reviews: 9, badge: "Новинка", emoji: "❄️", desc: "Серебро 925, белая эмаль" },
  { id: 6, name: "Набор открыток «Тепло»", price: 490, category: "Открытки", rating: 4.9, reviews: 42, badge: "Хит", emoji: "💌", desc: "10 открыток с конвертами" },
  { id: 7, name: "Глиняный горшок для трав", price: 980, category: "Керамика", rating: 4.7, reviews: 27, badge: null, emoji: "🌿", desc: "С дренажными отверстиями, декор" },
  { id: 8, name: "Свеча «Хвойный лес»", price: 1100, category: "Свечи", rating: 4.8, reviews: 33, badge: null, emoji: "🌲", desc: "Аромат пихты и кедра, 100ч" },
];

const REVIEWS = [
  { id: 1, name: "Ирина К.", stars: 5, text: "Заказывала кружки в подарок коллегам — все в восторге! Упаковка невероятно красивая, такое ощущение что открываешь настоящий сюрприз.", product: "Керамическая кружка", date: "12 мая 2026" },
  { id: 2, name: "Михаил Д.", stars: 5, text: "Свечи горят ровно, запах нежный и не навязчивый. Брал уже второй раз — не пожалел. Буду заказывать снова к Новому году!", product: "Свеча «Лаванда»", date: "8 мая 2026" },
  { id: 3, name: "Светлана В.", stars: 5, text: "Искала особенный подарок маме — нашла! Деревянный медведь ручной работы, всё сделано с любовью. Доставка быстрая.", product: "Деревянный медведь", date: "3 мая 2026" },
];

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О нас" },
  { id: "reviews", label: "Отзывы" },
  { id: "contacts", label: "Контакты" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "Все" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const recommended = PRODUCTS.filter(p => p.rating >= 4.8).slice(0, 4);

  const addToCart = (id: number) => setCart(prev => [...prev, id]);

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const idx = prev.indexOf(id);
      if (idx > -1) {
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      return prev;
    });
  };

  const cartItems = cart.map(id => PRODUCTS.find(p => p.id === id)!).filter(Boolean);
  const cartTotal = cartItems.reduce((sum, p) => sum + p.price, 0);
  const uniqueCartItems = Array.from(new Set(cart)).map(id => ({
    product: PRODUCTS.find(p => p.id === id)!,
    qty: cart.filter(c => c === id).length,
  }));

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    NAV_ITEMS.forEach(n => { const el = document.getElementById(n.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FDF8F0" }}>
      {/* NAVBAR */}
      <header style={{ background: "rgba(253,248,240,0.92)", borderBottom: "1px solid #EDE0C8" }} className="sticky top-0 z-50 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <span className="text-2xl">🧡</span>
            <span style={{ fontFamily: "Cormorant, Georgia, serif", color: "#5C3317", fontSize: "1.35rem", fontWeight: 600, letterSpacing: "0.02em" }}>
              Тепло &amp; Уют
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                style={{
                  fontFamily: "Golos Text, sans-serif",
                  background: activeSection === n.id ? "#B5674D" : "transparent",
                  color: activeSection === n.id ? "#FDF8F0" : "#8B4513",
                  borderRadius: "999px",
                  padding: "6px 16px",
                  fontSize: "0.875rem",
                  fontWeight: activeSection === n.id ? 500 : 400,
                  transition: "all 0.2s",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo("catalog")}
              style={{ padding: "8px", borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", color: "#8B4513", transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5EDD8")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <Icon name="Search" size={20} />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              style={{ position: "relative", padding: "8px", borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", color: "#8B4513", transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5EDD8")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <Icon name="ShoppingBag" size={20} />
              {cart.length > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 20, height: 20, background: "#B5674D", color: "#FDF8F0", borderRadius: "50%", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>
                  {cart.length}
                </span>
              )}
            </button>
            <button
              className="md:hidden"
              style={{ padding: "8px", borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", color: "#8B4513" }}
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{ borderTop: "1px solid #EDE0C8", background: "rgba(253,248,240,0.98)", padding: "12px 16px" }} className="md:hidden flex flex-col gap-1">
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                style={{
                  fontFamily: "Golos Text, sans-serif",
                  background: activeSection === n.id ? "#B5674D" : "transparent",
                  color: activeSection === n.id ? "#FDF8F0" : "#8B4513",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* CART DRAWER */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} onClick={() => setCartOpen(false)} />
          <div style={{ width: "100%", maxWidth: 380, background: "#FDF8F0", height: "100%", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #EDE0C8" }}>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "1.5rem", color: "#5C3317", margin: 0 }}>Корзина</h2>
              <button onClick={() => setCartOpen(false)} style={{ padding: "8px", borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", color: "#8B4513" }}>
                <Icon name="X" size={20} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {uniqueCartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#a0856d" }}>
                  <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🛍️</span>
                  <p style={{ fontFamily: "Golos Text, sans-serif", margin: 0 }}>Корзина пуста</p>
                  <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.8rem", marginTop: 4 }}>Добавьте товары из каталога</p>
                </div>
              ) : (
                uniqueCartItems.map(({ product: p, qty }) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#F5EDD8", borderRadius: 14, padding: "12px 14px" }}>
                    <span style={{ fontSize: "2rem" }}>{p.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "#5C3317", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", margin: "2px 0 0" }}>{qty} шт × {p.price.toLocaleString()} ₽</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "Cormorant, serif", fontSize: "1.2rem", color: "#B5674D", fontWeight: 600, margin: 0 }}>{(p.price * qty).toLocaleString()} ₽</p>
                      <button onClick={() => removeFromCart(p.id)} style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", background: "none", border: "none", cursor: "pointer", padding: 0 }}>удалить</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {uniqueCartItems.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid #EDE0C8" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontFamily: "Golos Text, sans-serif", color: "#a0856d" }}>Итого:</span>
                  <span style={{ fontFamily: "Cormorant, serif", fontSize: "2rem", color: "#5C3317", fontWeight: 600 }}>{cartTotal.toLocaleString()} ₽</span>
                </div>
                <button style={{ width: "100%", background: "#B5674D", color: "#FDF8F0", border: "none", borderRadius: 14, padding: "16px", fontFamily: "Golos Text, sans-serif", fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#8B4513")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#B5674D")}
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="home">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div style={{ opacity: 0, animation: "fadeUp 0.7s ease-out 0.1s forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F5EDD8", border: "1px solid #EDE0C8", borderRadius: 999, padding: "8px 16px", fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem", color: "#8B4513", marginBottom: 24 }}>
              <span>🎁</span> Подарки с душой и теплом
            </div>
            <h1 style={{ fontFamily: "Cormorant, Georgia, serif", fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 300, color: "#5C3317", lineHeight: 1.1, marginBottom: 24 }}>
              Магазин<br />
              <em style={{ fontStyle: "italic", color: "#B5674D" }}>уютных</em><br />
              сувениров
            </h1>
            <p style={{ fontFamily: "Golos Text, sans-serif", color: "rgba(139,69,19,0.75)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>
              Каждая вещь создана с любовью — для тех, кому важно подарить не просто предмет, а настроение и тепло.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => scrollTo("catalog")}
                style={{ background: "#B5674D", color: "#FDF8F0", border: "none", borderRadius: 14, padding: "14px 32px", fontFamily: "Golos Text, sans-serif", fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 16px rgba(181,103,77,0.3)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#8B4513")}
                onMouseLeave={e => (e.currentTarget.style.background = "#B5674D")}
              >
                Перейти в каталог
              </button>
              <button
                onClick={() => scrollTo("about")}
                style={{ background: "transparent", color: "#B5674D", border: "2px solid #D4956A", borderRadius: 14, padding: "14px 32px", fontFamily: "Golos Text, sans-serif", fontSize: "1rem", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F5EDD8"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                О магазине
              </button>
            </div>
          </div>

          <div style={{ position: "relative", opacity: 0, animation: "fadeUp 0.7s ease-out 0.3s forwards" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(212,149,106,0.2)", borderRadius: 24, transform: "rotate(3deg) scale(0.95)" }} />
            <img src={HERO_IMAGE} alt="Тёплые сувениры" style={{ position: "relative", borderRadius: 24, objectFit: "cover", width: "100%", height: 420, boxShadow: "0 24px 60px rgba(92,51,23,0.18)" }} />
            <div style={{ position: "absolute", bottom: -16, left: -16, background: "white", borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #EDE0C8" }}>
              <span style={{ fontSize: "1.75rem" }}>⭐</span>
              <div>
                <p style={{ fontFamily: "Cormorant, serif", fontSize: "1.2rem", fontWeight: 600, color: "#5C3317", margin: 0 }}>4.9 / 5.0</p>
                <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", margin: 0 }}>237 отзывов</p>
              </div>
            </div>
            <div style={{ position: "absolute", top: -16, right: -16, background: "#B5674D", color: "#FDF8F0", borderRadius: 16, boxShadow: "0 8px 24px rgba(181,103,77,0.3)", padding: "12px 16px", textAlign: "center" }}>
              <p style={{ fontFamily: "Cormorant, serif", fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>8+</p>
              <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", margin: 0 }}>лет работы</p>
            </div>
          </div>
        </div>

        {/* Popular picks strip */}
        <div style={{ borderTop: "1px solid #EDE0C8", background: "rgba(245,237,216,0.6)", padding: "40px 0" }}>
          <div className="max-w-6xl mx-auto px-4">
            <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "rgba(139,69,19,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 24 }}>
              Популярные прямо сейчас
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommended.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => scrollTo("catalog")}
                  style={{ background: "white", borderRadius: 18, padding: 16, border: "1px solid #EDE0C8", cursor: "pointer", transition: "all 0.3s", opacity: 0, animation: `fadeUp 0.6s ease-out ${0.2 + i * 0.1}s forwards` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(92,51,23,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span style={{ fontSize: "2.5rem", display: "block", marginBottom: 8 }}>{p.emoji}</span>
                  <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "#5C3317", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.2rem", color: "#B5674D", fontWeight: 600 }}>{p.price.toLocaleString()} ₽</span>
                    <span style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d" }}>★ {p.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" style={{ padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" style={{ marginBottom: 36 }}>
            <div>
              <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "rgba(139,69,19,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Ассортимент</p>
              <h2 style={{ fontFamily: "Cormorant, Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#5C3317", margin: 0 }}>Каталог товаров</h2>
            </div>
            <div style={{ position: "relative" }}>
              <Icon name="Search" size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#a0856d" }} />
              <input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  paddingLeft: 38, paddingRight: searchQuery ? 36 : 14, paddingTop: 12, paddingBottom: 12,
                  borderRadius: 14, background: "white", border: `2px solid ${searchFocused ? "#D4956A" : "#EDE0C8"}`,
                  fontFamily: "Golos Text, sans-serif", width: 240, outline: "none", fontSize: "0.875rem", color: "#5C3317",
                  transition: "border-color 0.2s"
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a0856d" }}>
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 18px", borderRadius: 999, fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem",
                  background: activeCategory === cat ? "#B5674D" : "white",
                  color: activeCategory === cat ? "#FDF8F0" : "#8B4513",
                  border: `1px solid ${activeCategory === cat ? "#B5674D" : "#EDE0C8"}`,
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#a0856d" }}>
              <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🔍</span>
              <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "1.1rem" }}>Ничего не найдено</p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("Все"); }} style={{ marginTop: 8, fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem", color: "#D4956A", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, i) => {
                const inCart = cart.includes(p.id);
                return (
                  <div
                    key={p.id}
                    style={{ background: "white", borderRadius: 18, overflow: "hidden", border: "1px solid #EDE0C8", transition: "all 0.3s", opacity: 0, animation: `fadeUp 0.5s ease-out ${i * 0.05}s forwards` }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(92,51,23,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ position: "relative", background: "#F5EDD8", height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "3.5rem" }}>{p.emoji}</span>
                      {p.badge && (
                        <span style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", fontFamily: "Golos Text, sans-serif", fontWeight: 500, background: p.badge === "Хит" ? "#B5674D" : "#D4956A", color: "#FDF8F0" }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: 14 }}>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "#5C3317", margin: "0 0 4px", lineHeight: 1.35 }}>{p.name}</p>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", margin: "0 0 6px" }}>{p.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#a0856d", marginBottom: 8 }}>
                        <span style={{ color: "#D4956A" }}>★</span>
                        <span>{p.rating} ({p.reviews})</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.3rem", color: "#B5674D", fontWeight: 600 }}>{p.price.toLocaleString()} ₽</span>
                        <button
                          onClick={() => addToCart(p.id)}
                          style={{
                            width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            background: inCart ? "#B5674D" : "#F5EDD8",
                            color: inCart ? "#FDF8F0" : "#8B4513",
                            transition: "all 0.2s"
                          }}
                        >
                          <Icon name={inCart ? "Check" : "Plus"} size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Smart recommendations */}
          {searchQuery === "" && activeCategory === "Все" && (
            <div style={{ marginTop: 60 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: "1.5rem" }}>✨</span>
                <h3 style={{ fontFamily: "Cormorant, Georgia, serif", fontSize: "2rem", fontWeight: 400, color: "#5C3317", margin: 0 }}>Вам может понравиться</h3>
              </div>
              <div style={{ background: "#F5EDD8", borderRadius: 20, padding: 20 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRODUCTS.filter(p => p.badge === "Новинка" || p.rating === 5.0).map(p => (
                  <div
                    key={p.id}
                    style={{ background: "white", borderRadius: 14, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #EDE0C8", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(92,51,23,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{p.emoji}</span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", fontWeight: 500, color: "#5C3317", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <p style={{ fontFamily: "Cormorant, serif", fontSize: "1rem", color: "#B5674D", fontWeight: 600, margin: 0 }}>{p.price.toLocaleString()} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "80px 0", background: "rgba(245,237,216,0.5)", borderTop: "1px solid #EDE0C8", borderBottom: "1px solid #EDE0C8" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "rgba(139,69,19,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Наша история</p>
              <h2 style={{ fontFamily: "Cormorant, Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#5C3317", margin: "0 0 24px" }}>О магазине</h2>
              <p style={{ fontFamily: "Golos Text, sans-serif", color: "rgba(139,69,19,0.8)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
                Мы начали в 2018 году с маленькой мастерской и большой мечты — чтобы каждый подарок был особенным. Сегодня у нас более 200 наименований товаров ручной работы от мастеров по всей России.
              </p>
              <p style={{ fontFamily: "Golos Text, sans-serif", color: "rgba(139,69,19,0.7)", lineHeight: 1.8, marginBottom: 32 }}>
                Каждый товар проходит тщательный отбор. Мы работаем только с теми мастерами, которые вкладывают в своё дело душу.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[{ num: "200+", label: "товаров" }, { num: "3500+", label: "клиентов" }, { num: "4.9★", label: "средняя оценка" }].map(s => (
                  <div key={s.label} style={{ background: "white", borderRadius: 16, padding: 16, textAlign: "center", border: "1px solid #EDE0C8" }}>
                    <p style={{ fontFamily: "Cormorant, serif", fontSize: "1.75rem", fontWeight: 600, color: "#B5674D", margin: 0 }}>{s.num}</p>
                    <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", margin: "4px 0 0" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "🤝", title: "Честность", desc: "Никакой предоплаты без гарантий — оплата при получении" },
                { emoji: "🎨", title: "Ручная работа", desc: "Каждый предмет сделан мастером вручную" },
                { emoji: "🌿", title: "Экологично", desc: "Натуральные материалы и безопасная упаковка" },
                { emoji: "💝", title: "С любовью", desc: "Красивая подарочная упаковка в подарок" },
              ].map(v => (
                <div
                  key={v.title}
                  style={{ background: "white", borderRadius: 18, padding: 20, border: "1px solid #EDE0C8", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(92,51,23,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span style={{ fontSize: "2rem", display: "block", marginBottom: 10 }}>{v.emoji}</span>
                  <p style={{ fontFamily: "Cormorant, serif", fontSize: "1.3rem", color: "#5C3317", margin: "0 0 6px" }}>{v.title}</p>
                  <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.82rem", color: "#a0856d", margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "rgba(139,69,19,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Что говорят клиенты</p>
            <h2 style={{ fontFamily: "Cormorant, Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#5C3317", margin: 0 }}>Отзывы покупателей</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div
                key={r.id}
                style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #EDE0C8", transition: "all 0.3s", opacity: 0, animation: `fadeUp 0.6s ease-out ${i * 0.15}s forwards` }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(92,51,23,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <span key={j} style={{ color: "#D4956A", fontSize: "1rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontFamily: "Golos Text, sans-serif", color: "rgba(139,69,19,0.8)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 }}>«{r.text}»</p>
                <div style={{ borderTop: "1px solid #EDE0C8", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#5C3317", margin: 0 }}>{r.name}</p>
                    <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", margin: "2px 0 0" }}>{r.product}</p>
                  </div>
                  <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d" }}>{r.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button style={{ background: "transparent", color: "#B5674D", border: "2px solid #D4956A", borderRadius: 14, padding: "12px 32px", fontFamily: "Golos Text, sans-serif", fontSize: "0.95rem", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F5EDD8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              Оставить отзыв
            </button>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" style={{ padding: "80px 0", background: "rgba(245,237,216,0.5)", borderTop: "1px solid #EDE0C8" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "rgba(139,69,19,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Связь</p>
              <h2 style={{ fontFamily: "Cormorant, Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#5C3317", margin: "0 0 28px" }}>Контакты</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "Phone" as const, label: "Телефон", value: "+7 (999) 123-45-67" },
                  { icon: "Mail" as const, label: "Email", value: "hello@teplo-uyut.ru" },
                  { icon: "MapPin" as const, label: "Адрес", value: "Москва, ул. Уютная, 12" },
                  { icon: "Clock" as const, label: "Режим работы", value: "Пн–Пт 10:00–19:00, Сб 11:00–17:00" },
                ].map(c => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 14, background: "white", borderRadius: 14, padding: 16, border: "1px solid #EDE0C8" }}>
                    <div style={{ width: 40, height: 40, background: "#F5EDD8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={c.icon} size={18} style={{ color: "#B5674D" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", color: "#a0856d", margin: 0 }}>{c.label}</p>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.9rem", fontWeight: 500, color: "#5C3317", margin: 0 }}>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: "Cormorant, Georgia, serif", fontSize: "2rem", fontWeight: 400, color: "#5C3317", margin: "0 0 24px" }}>Способы доставки</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { emoji: "🚚", title: "Курьер по Москве", desc: "1–2 дня, бесплатно от 3000 ₽", price: "от 350 ₽" },
                  { emoji: "📦", title: "СДЭК / Boxberry", desc: "2–5 дней по всей России", price: "от 250 ₽" },
                  { emoji: "🏪", title: "Самовывоз", desc: "Бесплатно, удобный склад", price: "Бесплатно" },
                  { emoji: "✈️", title: "Почта России", desc: "До 14 дней, с отслеживанием", price: "от 200 ₽" },
                ].map(d => (
                  <div
                    key={d.title}
                    style={{ display: "flex", alignItems: "center", gap: 14, background: "white", borderRadius: 14, padding: 16, border: "1px solid #EDE0C8", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{d.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#5C3317", margin: 0 }}>{d.title}</p>
                      <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.78rem", color: "#a0856d", margin: 0 }}>{d.desc}</p>
                    </div>
                    <span style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.875rem", color: "#B5674D", fontWeight: 500, whiteSpace: "nowrap" }}>{d.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#5C3317", color: "#FDF8F0", padding: "40px 0" }}>
        <div className="max-w-6xl mx-auto px-4" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.75rem" }}>🧡</span>
            <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.5rem", fontWeight: 500 }}>Тепло &amp; Уют</span>
          </div>
          <p style={{ fontFamily: "Golos Text, sans-serif", fontSize: "0.8rem", color: "rgba(253,248,240,0.5)", margin: 0 }}>
            © 2026 · Магазин сувениров с душой · Москва
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {["ВК", "IG", "TG"].map(s => (
              <button key={s} style={{ width: 36, height: 36, background: "rgba(253,248,240,0.1)", borderRadius: "50%", border: "none", color: "#FDF8F0", fontFamily: "Golos Text, sans-serif", fontSize: "0.75rem", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(253,248,240,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(253,248,240,0.1)"; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
