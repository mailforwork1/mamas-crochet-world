import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../store";
import { useRouter } from "../router";
import { useCatalog } from "../catalog";
import { SearchIcon, InstagramIcon } from "./Icons";
import { formatPrice } from "../utils/cn";

/* ---------- shared shell ---------- */
function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#3c352e]/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label={title}
        className={`absolute right-0 top-0 h-full w-full max-w-[420px] bg-[#fdfaf4] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f3d9d4]/60">
          <h2 className="font-serif text-xl text-[#4a3f3a]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-[#4a3f3a]/70 hover:bg-[#f3d9d4]/50 hover:text-[#b87168] transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-[#f3d9d4]/60 px-6 py-5">{footer}</div>}
      </aside>
    </div>
  );
}

function EmptyState({ text, cta }: { text: string; cta: React.ReactNode }) {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f3d9d4]/40 text-2xl">
        ✿
      </div>
      <p className="mt-5 font-serif text-lg text-[#4a3f3a]">{text}</p>
      <div className="mt-6">{cta}</div>
    </div>
  );
}

/* ---------- CART ---------- */
export const IG_HANDLE = "mamas_crochet_world";


function buildOrderText(
  lines: { line: { id: string; qty: number }; product: { name: string; price: number } | undefined }[],
  subtotal: number
) {
  const items = lines
    .map((x, i) => `${i + 1}. ${x.product!.name} x${x.line.qty} — ${formatPrice(x.product!.price * x.line.qty)}`)
    .join("\n");
  return (
    `Assalam-o-Alaikum! I'd like to place an order from Mama's Crochet World 🧶\n\n` +
    `${items}\n\n` +
    `Total: ${formatPrice(subtotal)}\n\n` +
    `Please confirm availability and share the delivery details. JazakAllah!`
  );
}

function CartPanel() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, clearCart } = useStore();
  const { getProduct, settings } = useCatalog();
  const { navigate } = useRouter();
  const [copied, setCopied] = useState(false);

  const lines = cart
    .map((l) => ({ line: l, product: getProduct(l.id) }))
    .filter((x) => x.product);

  const subtotal = lines.reduce((s, x) => s + x.product!.price * x.line.qty, 0);

  const handleCheckout = async () => {
    const text = buildOrderText(lines, subtotal);

    // copy the order so the customer only has to paste it in the DM
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 4000);

    // ig.me opens the app directly on mobile, falls back to the profile on desktop
    const win = window.open(`https://ig.me/m/${settings.igHandle}`, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = `https://www.instagram.com/${settings.igHandle}/`;
  };

  return (
    <Drawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title="Your Basket"
      footer={
        lines.length > 0 ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="tracking-[0.18em] uppercase text-[#4a3f3a]/70 text-xs">Subtotal</span>
              <span className="font-serif text-xl text-[#4a3f3a]">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-[0.7rem] text-[#4a3f3a]/60">
              {subtotal >= settings.freeWrapOver ? "✿ Complimentary wrapping unlocked!" : `Add ${formatPrice(settings.freeWrapOver - subtotal)} more for free wrapping.`}
            </p>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#4a3f3a] py-3.5 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
            >
              <InstagramIcon size={15} />
              {copied ? "✓ Order copied — opening Instagram" : "Order on Instagram"}
            </button>
            <p className="mt-2 text-center text-[0.65rem] leading-relaxed text-[#4a3f3a]/55">
              Your order list is copied automatically — just paste it in the chat and send.
            </p>
            <button
              onClick={clearCart}
              className="mt-2 w-full rounded-full py-2 text-[0.7rem] tracking-[0.18em] uppercase text-[#4a3f3a]/60 hover:text-[#b87168] transition"
            >
              Clear basket
            </button>
          </>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          text="Your basket is still empty."
          cta={
            <button
              onClick={() => {
                setCartOpen(false);
                navigate({ name: "shop" });
              }}
              className="rounded-full bg-[#4a3f3a] px-7 py-3 text-xs tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
            >
              Start shopping
            </button>
          }
        />
      ) : (
        <ul className="grid gap-5">
          {lines.map(({ line, product }) => (
            <li key={line.id} className="flex gap-4">
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate({ name: "product", id: line.id });
                }}
                className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f6ede0]/50"
              >
                <img src={product!.image} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-sm text-[#4a3f3a] leading-snug">{product!.name}</p>
                <p className="mt-1 text-sm text-[#b87168]">{formatPrice(product!.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full bg-white ring-1 ring-[#e8b4ad]/40">
                    <button
                      onClick={() => setQty(line.id, line.qty - 1)}
                      aria-label="Decrease"
                      className="h-8 w-8 grid place-items-center text-[#4a3f3a]/70 hover:text-[#b87168]"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm">{line.qty}</span>
                    <button
                      onClick={() => setQty(line.id, line.qty + 1)}
                      aria-label="Increase"
                      className="h-8 w-8 grid place-items-center text-[#4a3f3a]/70 hover:text-[#b87168]"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(line.id)}
                    className="text-[0.65rem] tracking-[0.18em] uppercase text-[#4a3f3a]/50 hover:text-[#b87168]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}

/* ---------- WISHLIST ---------- */
function WishPanel() {
  const { wishlist, wishOpen, setWishOpen, toggleWish, addToCart } = useStore();
  const { getProduct } = useCatalog();
  const { navigate } = useRouter();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const items = wishlist.map((id) => getProduct(id)).filter(Boolean);

  return (
    <Drawer open={wishOpen} onClose={() => setWishOpen(false)} title="Your Wishlist">
      {items.length === 0 ? (
        <EmptyState
          text="No little treasures saved yet."
          cta={
            <button
              onClick={() => {
                setWishOpen(false);
                navigate({ name: "shop" });
              }}
              className="rounded-full bg-[#4a3f3a] px-7 py-3 text-xs tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
            >
              Browse the collection
            </button>
          }
        />
      ) : (
        <ul className="grid gap-5">
          {items.map((p) => (
            <li key={p!.id} className="flex gap-4">
              <button
                onClick={() => {
                  setWishOpen(false);
                  navigate({ name: "product", id: p!.id });
                }}
                className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f6ede0]/50"
              >
                <img src={p!.image} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-sm text-[#4a3f3a] leading-snug">{p!.name}</p>
                <p className="mt-1 text-sm text-[#b87168]">{formatPrice(p!.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(p!.id, 1);
                      setJustAdded(p!.id);
                      setTimeout(() => setJustAdded(null), 1800);
                    }}
                    className={`rounded-full px-4 py-1.5 text-[0.6rem] tracking-[0.18em] uppercase text-[#fdfaf4] transition ${
                      justAdded === p!.id ? "bg-[#b87168]" : "bg-[#4a3f3a] hover:bg-[#b87168]"
                    }`}
                  >
                    {justAdded === p!.id ? "✿ Added" : "Add to basket"}
                  </button>
                  <button
                    onClick={() => toggleWish(p!.id)}
                    className="text-[0.65rem] tracking-[0.18em] uppercase text-[#4a3f3a]/50 hover:text-[#b87168]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}

/* ---------- SEARCH ---------- */
function SearchPanel() {
  const { searchOpen, setSearchOpen } = useStore();
  const { products: allProducts, categories } = useCatalog();
  const { navigate } = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.subcategory ?? "").toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [q]);

  const catHits = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return categories.filter((c) => c.name.toLowerCase().includes(term)).slice(0, 3);
  }, [q]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        onClick={() => setSearchOpen(false)}
        className="absolute inset-0 bg-[#3c352e]/40 backdrop-blur-sm"
      />
      <div className="relative mx-auto mt-20 w-[92%] max-w-2xl rounded-3xl bg-[#fdfaf4] shadow-2xl ring-1 ring-[#e8b4ad]/30 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f3d9d4]/60">
          <span className="text-[#b87168]">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for keychains, cardigans, baskets…"
            className="flex-1 bg-transparent text-[#4a3f3a] placeholder:text-[#4a3f3a]/40 outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="grid h-8 w-8 place-items-center rounded-full text-[#4a3f3a]/60 hover:bg-[#f3d9d4]/50 hover:text-[#b87168]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!q.trim() ? (
            <div className="px-2 py-3">
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#4a3f3a]/50">
                Popular searches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Keychain", "Cardigan", "Basket", "Bouquet", "Booties", "Clock"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setQ(t)}
                    className="rounded-full bg-white px-4 py-2 text-xs text-[#4a3f3a]/80 ring-1 ring-[#e8b4ad]/40 hover:ring-[#d99a93] hover:text-[#b87168] transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && catHits.length === 0 ? (
            <p className="px-2 py-10 text-center text-sm text-[#4a3f3a]/60">
              Nothing matched “{q}” — try another word.
            </p>
          ) : (
            <>
              {catHits.length > 0 && (
                <div className="mb-3">
                  <p className="px-2 text-[0.65rem] tracking-[0.22em] uppercase text-[#4a3f3a]/50">
                    Categories
                  </p>
                  {catHits.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate({ name: "category", slug: c.slug });
                      }}
                      className="mt-1 flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-[#f3d9d4]/30"
                    >
                      <img src={c.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-serif text-sm text-[#4a3f3a]">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.length > 0 && (
                <>
                  <p className="px-2 text-[0.65rem] tracking-[0.22em] uppercase text-[#4a3f3a]/50">
                    Products
                  </p>
                  {results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate({ name: "product", id: p.id });
                      }}
                      className="mt-1 flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-[#f3d9d4]/30"
                    >
                      <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-sm text-[#4a3f3a]">{p.name}</span>
                        <span className="block text-[0.65rem] text-[#4a3f3a]/55">{p.category}</span>
                      </span>
                      <span className="text-sm text-[#b87168]">{formatPrice(p.price)}</span>
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Panels() {
  return (
    <>
      <SearchPanel />
      <WishPanel />
      <CartPanel />
    </>
  );
}
