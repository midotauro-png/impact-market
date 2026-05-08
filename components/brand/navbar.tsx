"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, MapPin, Menu, X, Loader2, Heart } from "lucide-react";
import { useState } from "react";
import Logo from "./logo";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/use-favorites";
import { useZoneDetect } from "@/lib/use-zone-detect";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/stores", label: "Stores" },
  { href: "/orders", label: "My Orders" },
  { href: "/favorites", label: "Favorites" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const { zone, loading: zoneLoading, detect } = useZoneDetect();
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-soft">
      <div className="market-bar" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <Link href="/" aria-label="Home">
          <Logo size="lg" className="-my-2" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-semibold transition",
                pathname === l.href
                  ? "text-orange-400"
                  : "text-slate-600 hover:text-orange-400"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Zone indicator */}
          <button
            onClick={detect}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-400 transition"
            title={zone ? `Zone: ${zone.name}` : "Detect your zone"}
          >
            {zoneLoading
              ? <Loader2 size={14} className="text-orange-400 animate-spin" />
              : <MapPin size={14} className="text-orange-400" />}
            <span>{zone ? zone.name : "Detect zone"}</span>
          </button>

          {/* Favorites */}
          <Link href="/favorites" className="relative flex items-center justify-center h-10 w-10 rounded-xl hover:bg-red-50 transition" title="Saved stores">
            <Heart size={20} className={favorites.size > 0 ? "fill-red-500 text-red-500" : "text-slate-700"} />
            {favorites.size > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
                {favorites.size}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center justify-center h-10 w-10 rounded-xl hover:bg-orange-50 transition">
            <ShoppingCart size={20} className="text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-orange-400 text-white text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login */}
          <Link href="/login" className="hidden sm:inline-flex btn-navy btn-sm">
            Login
          </Link>

          {/* Mobile menu toggle */}
          <button className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl hover:bg-slate-100" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 flex flex-col gap-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 text-sm font-semibold text-slate-700"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="btn-navy text-center mt-2" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </header>
  );
}
