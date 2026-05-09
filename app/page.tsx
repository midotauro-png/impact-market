"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight, Star, Search } from "lucide-react";
import AnimatedLogo from "@/components/brand/animated-logo";
import { categories, vendors, activeAds } from "@/lib/mock-data";
import { ZONES } from "@/lib/zones";
import BannerAd from "@/components/ads/banner-ad";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --forest:      #1C3A2A;
    --forest-mid:  #224B34;
    --forest-soft: #2F6647;
    --orange:      #F47820;
    --orange-dim:  #C45E10;
    --gold:        #D4A843;
    --cream:       #FBF7F1;
    --beige:       #F0E8D6;
    --ink:         #1A2B1F;
    --muted:       #5E7066;
    --border:      rgba(26,43,31,0.1);
  }

  .im-page { font-family: 'Manrope', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }

  /* ── Navbar ── */
  .im-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(28,58,42,0.97);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(244,120,32,0.18);
    padding: 0 2rem;
    height: 72px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .im-nav-links { display: flex; gap: 2rem; }
  .im-nav-links a {
    color: rgba(255,255,255,0.65);
    font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.05em;
    text-transform: uppercase; text-decoration: none;
    transition: color 0.2s;
  }
  .im-nav-links a:hover { color: var(--gold); }
  .im-nav-right { display: flex; align-items: center; gap: 1rem; }
  .im-cart-btn {
    background: var(--orange); color: white;
    border: none; border-radius: 50px;
    padding: 0.5rem 1.25rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem; font-weight: 600;
    cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    display: inline-flex; align-items: center; gap: 0.4rem;
  }
  .im-cart-btn:hover { background: var(--orange-dim); transform: translateY(-1px); }

  /* ── Hero ── */
  .im-hero {
    min-height: 100vh;
    background: linear-gradient(160deg, var(--forest) 0%, var(--forest-mid) 55%, #1E4A30 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 5rem 2rem 5rem;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .im-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 50% 0%,   rgba(244,120,32,0.14) 0%, transparent 65%),
      radial-gradient(ellipse 60% 45% at 15% 80%,  rgba(212,168,67,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 40% 35% at 85% 70%,  rgba(47,102,71,0.25)  0%, transparent 55%);
    pointer-events: none;
  }
  .im-hero::after {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }
  .im-hero-logo-wrap {
    position: relative; z-index: 2;
    margin-bottom: 0.5rem;
  }
  .im-hero-eyebrow {
    position: relative; z-index: 2;
    margin-top: 1.75rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold);
    animation: fadeUp 0.8s 0.25s cubic-bezier(0.16,1,0.3,1) both;
  }
  .im-hero-h1 {
    position: relative; z-index: 2;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.4rem, 6vw, 5.5rem);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.025em;
    color: #FDFAF4;
    margin: 0.875rem 0 0;
    animation: fadeUp 0.8s 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  .im-hero-h1 em { font-style: italic; color: var(--orange); }
  .im-hero-sub {
    position: relative; z-index: 2;
    max-width: 500px;
    font-size: 1rem; font-weight: 400; line-height: 1.75;
    color: rgba(255,255,255,0.62);
    margin: 1.25rem auto 0;
    animation: fadeUp 0.8s 0.52s cubic-bezier(0.16,1,0.3,1) both;
  }
  .im-search-wrap {
    position: relative; z-index: 2;
    margin-top: 2.25rem;
    display: flex; gap: 0.625rem;
    max-width: 500px; width: 100%;
    animation: fadeUp 0.8s 0.62s cubic-bezier(0.16,1,0.3,1) both;
  }
  .im-search-input {
    flex: 1;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 50px;
    padding: 0 1.25rem 0 3rem;
    height: 50px;
    color: white; font-family: 'Manrope', sans-serif; font-size: 0.9375rem;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .im-search-input::placeholder { color: rgba(255,255,255,0.35); }
  .im-search-input:focus { border-color: var(--gold); background: rgba(255,255,255,0.12); }
  .im-search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.38); pointer-events: none; }
  .im-search-btn {
    height: 50px; padding: 0 1.625rem;
    background: var(--orange); color: white; border: none; border-radius: 50px;
    font-family: 'Manrope', sans-serif; font-size: 0.9375rem; font-weight: 600;
    cursor: pointer; white-space: nowrap;
    transition: background 0.2s, transform 0.15s;
  }
  .im-search-btn:hover { background: var(--orange-dim); transform: translateY(-1px); }
  .im-zone-pills {
    position: relative; z-index: 2;
    display: flex; flex-wrap: wrap; gap: 0.4rem;
    justify-content: center; margin-top: 1.5rem;
    animation: fadeUp 0.8s 0.72s cubic-bezier(0.16,1,0.3,1) both;
  }
  .im-zone-pill {
    display: inline-flex; align-items: center; gap: 0.3rem;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 50px;
    padding: 0.3rem 0.75rem;
    color: rgba(255,255,255,0.62);
    font-size: 0.7rem; font-weight: 500;
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .im-zone-pill:hover { background: rgba(212,168,67,0.15); border-color: rgba(212,168,67,0.4); color: var(--gold); }

  /* ── Marquee ── */
  .im-marquee-wrap {
    background: linear-gradient(90deg, var(--orange) 0%, #E8681A 100%);
    padding: 0.85rem 0; overflow: hidden;
  }
  .im-marquee-track {
    display: flex; gap: 0;
    animation: marquee 28s linear infinite;
    width: max-content;
  }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .im-marquee-item {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0 2rem;
    font-family: 'Playfair Display', serif;
    font-size: 0.9375rem; font-weight: 700; font-style: italic;
    color: rgba(255,255,255,0.95); white-space: nowrap;
  }
  .im-marquee-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.45); flex-shrink: 0; }

  /* ── Section shared ── */
  .im-section { padding: 5.5rem 2rem; }
  .im-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6875rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--orange); margin-bottom: 0.875rem;
  }
  .im-section-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.875rem, 4vw, 3.25rem);
    font-weight: 900; line-height: 1.08; letter-spacing: -0.02em;
    color: var(--ink);
  }
  .im-section-h2 em { font-style: italic; color: var(--orange); }

  /* ── Categories grid ── */
  .im-cats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.875rem; margin-top: 2.5rem;
  }
  .im-cat-card {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: 16px; padding: 1.375rem 0.875rem;
    text-align: center; text-decoration: none;
    display: flex; flex-direction: column; align-items: center; gap: 0.625rem;
    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s, border-color 0.2s;
    cursor: pointer;
  }
  .im-cat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(26,43,31,0.11); border-color: var(--orange); }
  .im-cat-icon { font-size: 2.125rem; line-height: 1; }
  .im-cat-name { font-size: 0.78125rem; font-weight: 600; color: var(--ink); line-height: 1.3; }

  /* ── Vendors ── */
  .im-vendors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 1.375rem; margin-top: 2.5rem;
  }
  .im-vendor-card {
    background: white; border-radius: 18px; overflow: hidden;
    border: 1.5px solid var(--border);
    text-decoration: none; display: block;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s;
  }
  .im-vendor-card:hover { transform: translateY(-7px) scale(1.01); box-shadow: 0 20px 50px rgba(26,43,31,0.13); }
  .im-vendor-cover {
    height: 172px; overflow: hidden; position: relative;
    background: var(--beige);
  }
  .im-vendor-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .im-vendor-card:hover .im-vendor-cover img { transform: scale(1.05); }
  .im-vendor-featured {
    position: absolute; top: 10px; left: 10px;
    background: var(--orange); color: white;
    font-size: 0.6rem; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.09em; text-transform: uppercase;
    padding: 0.2rem 0.55rem; border-radius: 50px;
  }
  .im-vendor-body { padding: 1.125rem; display: flex; gap: 0.75rem; align-items: flex-start; }
  .im-vendor-logo { width: 48px; height: 48px; border-radius: 11px; object-fit: cover; flex-shrink: 0; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.09); }
  .im-vendor-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--ink); line-height: 1.2; }
  .im-vendor-meta { font-size: 0.75rem; color: var(--muted); margin-top: 0.2rem; }
  .im-vendor-rating { display: flex; align-items: center; gap: 0.3rem; margin-top: 0.45rem; font-size: 0.75rem; font-weight: 600; color: var(--ink); }

  /* ── Stats bar ── */
  .im-stats {
    background: linear-gradient(135deg, var(--forest) 0%, var(--forest-soft) 100%);
    color: white;
    padding: 4.5rem 2rem;
    display: flex; justify-content: center; flex-wrap: wrap; gap: 1px;
  }
  .im-stat {
    flex: 1; min-width: 160px; max-width: 240px;
    text-align: center; padding: 2rem 1.75rem;
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .im-stat:last-child { border-right: none; }
  .im-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.25rem, 4.5vw, 3.5rem);
    font-weight: 900; letter-spacing: -0.03em; color: var(--gold);
    line-height: 1;
  }
  .im-stat-label { font-size: 0.8125rem; color: rgba(255,255,255,0.5); margin-top: 0.5rem; font-weight: 500; letter-spacing: 0.04em; }

  /* ── Split CTA ── */
  .im-split {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 460px;
  }
  @media (max-width: 768px) { .im-split { grid-template-columns: 1fr; } }
  .im-split-pane {
    padding: 4.5rem 3rem;
    display: flex; flex-direction: column; justify-content: center;
  }
  .im-split-pane.dark { background: var(--forest); }
  .im-split-pane.light { background: var(--beige); }
  .im-split-pane .im-section-h2 { color: #FDFAF4; }
  .im-split-pane.light .im-section-h2 { color: var(--ink); }
  .im-split-pane p { font-size: 0.9375rem; line-height: 1.75; font-weight: 400; margin: 0.875rem 0 1.75rem; }
  .im-split-pane.dark p { color: rgba(255,255,255,0.55); }
  .im-split-pane.light p { color: var(--muted); }
  .im-cta-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.8125rem 1.625rem; border-radius: 50px;
    font-family: 'Manrope', sans-serif; font-size: 0.9375rem; font-weight: 600;
    text-decoration: none; width: fit-content;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .im-cta-btn:hover { transform: translateX(5px); }
  .im-cta-btn.orange { background: var(--orange); color: white; box-shadow: 0 4px 20px rgba(244,120,32,0.35); }
  .im-cta-btn.orange:hover { box-shadow: 0 6px 28px rgba(244,120,32,0.5); }
  .im-cta-btn.outline { background: transparent; color: var(--ink); border: 2px solid var(--ink); }

  /* ── Footer ── */
  .im-footer {
    background: #0F2419; padding: 2.75rem 2rem;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
  }
  .im-footer-links { display: flex; gap: 1.75rem; }
  .im-footer-links a { color: rgba(255,255,255,0.35); font-size: 0.8125rem; text-decoration: none; transition: color 0.2s; }
  .im-footer-links a:hover { color: var(--gold); }
  .im-footer-copy { font-size: 0.6875rem; color: rgba(255,255,255,0.2); font-family: 'JetBrains Mono', monospace; }

  /* ── Reveal animation ── */
  .reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .im-nav-links { display: none; }
    .im-search-wrap { flex-direction: column; }
    .im-stats { flex-direction: column; align-items: center; }
    .im-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .im-split-pane { padding: 3rem 1.75rem; }
    .im-section { padding: 4rem 1.25rem; }
  }
`;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const delay = Number(el.dataset.delay ?? 0);
          setTimeout(() => el.classList.add("visible"), delay);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const MARQUEE_ITEMS = [
  "🍛 Bahraini Food", "🥐 Homemade Sweets", "🛒 Groceries",
  "🪔 Oud & Perfume", "👗 Fashion", "🍽️ Restaurants",
  "💄 Beauty", "📱 Electronics", "💍 Accessories", "🔧 Services",
];

export default function HomePage() {
  const router = useRouter();
  const [searchQ, setSearchQ] = useState("");
  const featuredVendors = vendors.filter((v) => v.status === "approved" && v.is_open).slice(0, 6);
  const activeZones = ZONES.filter((z) => z.is_active).slice(0, 10);
  const bannerAds = activeAds("homepage_banner");
  useReveal();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQ.trim();
    router.push(q ? `/stores?q=${encodeURIComponent(q)}` : "/stores");
  }

  return (
    <div className="im-page">
      <style>{STYLES}</style>

      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav className="im-nav">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Impact Market" style={{ height: 48, objectFit: "contain" }} />
        </Link>
        <div className="im-nav-links">
          <Link href="/stores">Stores</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/vendor/signup">Sell</Link>
          <Link href="/login">Sign in</Link>
        </div>
        <div className="im-nav-right">
          <Link href="/cart" className="im-cart-btn">🛒 Cart</Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="im-hero">
        <div className="im-hero-logo-wrap">
          <AnimatedLogo width="clamp(220px, 38vw, 460px)" />
        </div>

        <p className="im-hero-eyebrow">Bahrain&apos;s Local Marketplace · Est. 2024</p>

        <h1 className="im-hero-h1">
          Shop <em>Local.</em><br />Delivered Fast.
        </h1>

        <p className="im-hero-sub">
          From Manama to Riffa — food, fashion, oud, groceries &amp; more.
          Zone-smart delivery from verified Bahraini vendors in under 45 minutes.
        </p>

        <form onSubmit={handleSearch} className="im-search-wrap" style={{ position: "relative" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} className="im-search-icon" />
            <input
              type="text"
              placeholder="Search stores, food, items…"
              className="im-search-input"
              style={{ width: "100%", paddingLeft: "3rem" }}
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </div>
          <button type="submit" className="im-search-btn">Search</button>
        </form>

        <div className="im-zone-pills">
          {activeZones.map((z) => (
            <Link key={z.id} href={`/stores?zone=${z.id}`} className="im-zone-pill">
              <MapPin size={10} style={{ color: "var(--orange)" }} />
              {z.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Marquee ticker ───────────────────────────────────── */}
      <div className="im-marquee-wrap">
        <div className="im-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="im-marquee-item">
              {item}
              <span className="im-marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="im-section" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal">
          <p className="im-section-label">Browse by Category</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h2 className="im-section-h2">What are you<br /><em>looking for?</em></h2>
            <Link href="/stores" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--orange)", textDecoration: "none" }}>
              All stores <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="im-cats-grid">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/stores?category=${cat.slug}`}
              className="im-cat-card reveal"
              data-delay={i * 50}
            >
              <span className="im-cat-icon">{cat.icon}</span>
              <span className="im-cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <div className="im-stats">
        {[
          { num: "500+", label: "Local Vendors" },
          { num: "15", label: "Zones Covered" },
          { num: "45 min", label: "Avg Delivery" },
          { num: "12K+", label: "Happy Customers" },
        ].map((s, i) => (
          <div key={s.label} className="im-stat reveal" data-delay={i * 80}>
            <div className="im-stat-num">{s.num}</div>
            <div className="im-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Sponsored Banners ─────────────────────────────────── */}
      {bannerAds.length > 0 && (
        <section className="im-section" style={{ maxWidth: 1200, margin: "0 auto", paddingTop: "3rem", paddingBottom: "2rem" }}>
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: bannerAds.length > 1 ? "1fr 1fr" : "1fr", gap: "1.125rem" }}>
            {bannerAds.slice(0, 2).map((ad) => (
              <BannerAd key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Vendors ─────────────────────────────────── */}
      <section className="im-section" style={{ background: "#F4EFE8", maxWidth: "100%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal">
            <p className="im-section-label">Handpicked for you</p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <h2 className="im-section-h2">Featured<br /><em>Stores</em></h2>
              <Link href="/stores" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--orange)", textDecoration: "none" }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="im-vendors-grid">
            {featuredVendors.map((v, i) => (
              <Link key={v.id} href={`/store/${v.id}`} className="im-vendor-card reveal" data-delay={i * 70}>
                <div className="im-vendor-cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.cover_url} alt={v.business_name} loading="lazy" />
                  {v.is_featured && <span className="im-vendor-featured">★ Featured</span>}
                </div>
                <div className="im-vendor-body">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.logo_url} alt="" className="im-vendor-logo" loading="lazy" />
                  <div>
                    <div className="im-vendor-name">{v.business_name}</div>
                    <div className="im-vendor-meta">
                      {categories.find((c) => c.id === v.category_id)?.name} · {v.address}
                    </div>
                    <div className="im-vendor-rating">
                      <Star size={11} fill="#F59E0B" color="#F59E0B" />
                      {v.rating}
                      <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: "0.25rem" }}>({v.total_orders} orders)</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Split CTA ────────────────────────────────────────── */}
      <div className="im-split">
        <div className="im-split-pane dark reveal">
          <p className="im-section-label" style={{ color: "rgba(244,120,32,0.8)" }}>For Business Owners</p>
          <h2 className="im-section-h2" style={{ color: "white" }}>Sell on<br /><em>Impact Market</em></h2>
          <p>Reach thousands of customers across all Bahrain governorates. Register your store and start selling today — no setup fees.</p>
          <Link href="/vendor/signup" className="im-cta-btn orange">
            Register Your Store <ArrowRight size={16} />
          </Link>
        </div>
        <div className="im-split-pane light reveal" data-delay={150}>
          <p className="im-section-label">For Drivers</p>
          <h2 className="im-section-h2">Earn on<br /><em>Your Schedule</em></h2>
          <p style={{ color: "var(--muted)" }}>Deliver for local vendors across Bahrain. Set your own hours, work in your zone, and get paid daily.</p>
          <Link href="/driver/signup" className="im-cta-btn outline">
            Become a Driver <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="im-footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Impact Market" style={{ height: 40, objectFit: "contain", opacity: 0.8 }} />
        <div className="im-footer-links">
          <Link href="/stores">Stores</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/vendor/signup">Vendors</Link>
          <Link href="/driver/signup">Drivers</Link>
          <Link href="/login">Sign in</Link>
        </div>
        <p className="im-footer-copy">© {new Date().getFullYear()} Impact Market · Bahrain</p>
      </footer>
    </div>
  );
}
