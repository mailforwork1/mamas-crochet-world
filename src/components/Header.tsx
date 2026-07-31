import { useState } from "react";
import Logo from "./Logo";
import { BagIcon, HeartIcon, SearchIcon } from "./Icons";
import { useRouter } from "../router";
import { useStore } from "../store";
import { useCatalog } from "../catalog";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { route, navigate } = useRouter();
  const { cartCount, wishCount, setCartOpen, setWishOpen, setSearchOpen } = useStore();
  const { categories, settings } = useCatalog();

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate({ name: "home" });
  };

  const scrollTo = (href: string) => {
    if (route.name !== "home") {
      navigate({ name: "home" });
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 120);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#fdfaf4]/90 border-b border-[#f3d9d4]/40">
      {/* Announcement */}
      <div className="bg-gradient-to-r from-[#f3d9d4] via-[#fdfaf4] to-[#d9d3e4]/70 text-[#4a3f3a]">
        <div className="mx-auto max-w-7xl px-6 py-2 text-center text-[0.7rem] tracking-[0.2em] uppercase">
          {settings.announcement}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
        <a href="#/" onClick={goHome} className="shrink-0">
          <Logo size={54} />
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          <button
            onClick={() => navigate({ name: "home" })}
            className="text-sm text-[#4a3f3a]/80 hover:text-[#b87168] transition"
          >
            Home
          </button>

          {/* Shop mega-menu */}
          <div
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              onClick={() => navigate({ name: "shop" })}
              className="text-sm text-[#4a3f3a]/80 hover:text-[#b87168] transition flex items-center gap-1"
            >
              Shop
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[720px] max-w-[90vw] z-50">
                <div className="rounded-3xl bg-[#fdfaf4] shadow-2xl ring-1 ring-[#e8b4ad]/30 p-6 grid grid-cols-3 gap-x-6 gap-y-3">
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        navigate({ name: "category", slug: c.slug });
                        setMenuOpen(false);
                      }}
                      className="group flex items-center gap-3 rounded-xl p-2 hover:bg-[#f3d9d4]/30 text-left"
                    >
                      <img src={c.image} alt="" className="h-11 w-11 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-serif text-[#4a3f3a] group-hover:text-[#b87168] leading-tight truncate">
                          {c.short}
                        </p>
                        <p className="text-[0.65rem] text-[#4a3f3a]/60 truncate">{c.tagline}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate({ name: "category", slug: "keychains" })}
            className="text-sm text-[#4a3f3a]/80 hover:text-[#b87168] transition"
          >
            Keychains
          </button>
          <button
            onClick={() => navigate({ name: "category", slug: "apparel" })}
            className="text-sm text-[#4a3f3a]/80 hover:text-[#b87168] transition"
          >
            Clothing
          </button>
          <button
            onClick={() => scrollTo("#story")}
            className="text-sm text-[#4a3f3a]/80 hover:text-[#b87168] transition"
          >
            Our Story
          </button>
        </nav>

        <div className="flex items-center gap-1 text-[#4a3f3a]">
          <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f3d9d4]/40 transition">
            <SearchIcon />
          </button>
          <button onClick={() => setWishOpen(true)} aria-label="Wishlist" className="relative hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f3d9d4]/40 transition">
            <HeartIcon />
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b87168] text-[0.6rem] text-white grid place-items-center">
                {wishCount}
              </span>
            )}
          </button>
          <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f3d9d4]/40 transition">
            <BagIcon />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b87168] text-[0.6rem] text-white grid place-items-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f3d9d4]/40 transition"
            onClick={() => setOpen(!open)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-[#f3d9d4]/40 bg-[#fdfaf4] max-h-[70vh] overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-4 grid gap-2">
            <button
              onClick={() => { navigate({ name: "home" }); setOpen(false); }}
              className="text-left text-sm text-[#4a3f3a]/80 py-2"
            >
              Home
            </button>
            <button
              onClick={() => { navigate({ name: "shop" }); setOpen(false); }}
              className="text-left text-sm font-serif text-[#b87168] py-2 border-t border-[#f3d9d4]/40"
            >
              Shop the full collection →
            </button>
            <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#4a3f3a]/50 mt-2 pt-2 border-t border-[#f3d9d4]/40">Categories</p>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => { navigate({ name: "category", slug: c.slug }); setOpen(false); }}
                className="text-left text-sm text-[#4a3f3a]/80 hover:text-[#b87168] py-1.5"
              >
                {c.short}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#story")}
              className="text-left text-sm text-[#4a3f3a]/80 py-2 border-t border-[#f3d9d4]/40 mt-2"
            >
              Our Story
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
