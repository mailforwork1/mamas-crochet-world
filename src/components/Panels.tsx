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


/* ---------- CHECKOUT FORM ---------- */
type CheckoutLine = { id: string; name: string; price: number; qty: number };

function CheckoutForm({
  open,
  onClose,
  lines,
  subtotal,
  onPlaced,
}: {
  open: boolean;
  onClose: () => void;
  lines: CheckoutLine[];
  subtotal: number;
  onPlaced: (ref: string) => void;
}) {
  const { settings } = useCatalog();
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "", city: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const delivery = subtotal >= (settings.freeWrapOver ?? 5000) ? 0 : 250;
  const total = subtotal + delivery;

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF({ ...f, [k]: e.target.value });
    setErr("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.phone.trim() || !f.address.trim() || !f.city.trim()) {
      setErr("Please fill in your name, phone, address and city.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customer: f, items: lines, delivery }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(out.error ?? "Could not place the order. Please try again.");
        return;
      }
      onPlaced(out.ref);
    } catch {
      setErr("Could not reach the server. Please check your connection.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  const inp =
    "w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-[#4a3f3a] ring-1 ring-[#e8b4ad]/40 outline-none focus:ring-[#b87168]";
  const lbl = "text-[0.62rem] tracking-[0.2em] uppercase text-[#4a3f3a]/55";

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#3c352e]/45 backdrop-blur-sm p-4 md:p-8">
      <div className="mx-auto max-w-lg rounded-[28px] bg-[#fdfaf4] p-6 md:p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">Almost there</p>
            <h2 className="font-serif mt-2 text-2xl text-[#4a3f3a]">Delivery details</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[#4a3f3a]/50 hover:text-[#b87168]">✕</button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-1.5">
            <span className={lbl}>Full name *</span>
            <input value={f.name} onChange={set("name")} required placeholder="Ayesha Khan" className={inp} />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className={lbl}>Phone / WhatsApp *</span>
              <input value={f.phone} onChange={set("phone")} required placeholder="03XX-XXXXXXX" className={inp} />
            </label>
            <label className="grid gap-1.5">
              <span className={lbl}>City *</span>
              <input value={f.city} onChange={set("city")} required placeholder="Peshawar" className={inp} />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className={lbl}>Full address *</span>
            <textarea value={f.address} onChange={set("address")} required rows={2}
              placeholder="House / street / area" className={inp} />
          </label>

          <label className="grid gap-1.5">
            <span className={lbl}>Email (optional)</span>
            <input type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" className={inp} />
          </label>

          <label className="grid gap-1.5">
            <span className={lbl}>Note for us (optional)</span>
            <textarea value={f.notes} onChange={set("notes")} rows={2}
              placeholder="Gift wrap, colour preference, delivery timing…" className={inp} />
          </label>

          {/* summary */}
          <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-[#e8b4ad]/25 text-sm">
            {lines.map((l) => (
              <div key={l.id} className="flex justify-between gap-3 text-[#4a3f3a]/75">
                <span className="min-w-0 truncate">{l.name} × {l.qty}</span>
                <span className="shrink-0">{formatPrice(l.price * l.qty)}</span>
              </div>
            ))}
            <div className="mt-3 border-t border-[#e8b4ad]/30 pt-3 grid gap-1">
              <div className="flex justify-between text-[#4a3f3a]/70">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4a3f3a]/70">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-[#4a3f3a] mt-1">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <p className="mt-2 text-[0.65rem] text-[#4a3f3a]/55">
              Cash on delivery. We'll message you on WhatsApp to confirm.
            </p>
          </div>

          {err && <p className="text-sm text-[#b87168]">{err}</p>}

          <button type="submit" disabled={busy}
            className="rounded-full bg-[#4a3f3a] py-3.5 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition disabled:opacity-50">
            {busy ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- ORDER PLACED ---------- */
function OrderPlaced({ refCode, onClose }: { refCode: string; onClose: () => void }) {
  const { settings } = useCatalog();
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#3c352e]/45 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[28px] bg-[#fdfaf4] p-8 text-center shadow-2xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f3d9d4]/50 text-3xl">✿</div>
        <h2 className="font-serif mt-5 text-2xl text-[#4a3f3a]">Thank you!</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#4a3f3a]/70">
          Your order has been received. We'll message you shortly to confirm.
        </p>
        <p className="mt-4 rounded-xl bg-white/70 py-3 text-sm text-[#4a3f3a] ring-1 ring-[#e8b4ad]/25">
          Order reference<br />
          <strong className="font-serif text-lg tracking-wide">{refCode}</strong>
        </p>
        <div className="mt-6 grid gap-2">
          <a
            href={`https://ig.me/m/${settings.igHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#4a3f3a] py-3 text-xs tracking-[0.2em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
          >
            Message us on Instagram
          </a>
          <button onClick={onClose}
            className="rounded-full py-3 text-xs tracking-[0.2em] uppercase text-[#4a3f3a]/60 hover:text-[#b87168]">
            Continue shopping
          </button>
        </div>
      </div>
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
  const [checkout, setCheckout] = useState(false);
  const [placedRef, setPlacedRef] = useState<string | null>(null);

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
    <>
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
              onClick={() => { setCartOpen(false); setCheckout(true); }}
              className="mt-4 w-full rounded-full bg-[#4a3f3a] py-3.5 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={handleCheckout}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-[0.65rem] font-medium tracking-[0.2em] uppercase text-[#4a3f3a]/70 ring-1 ring-[#e8b4ad]/40 hover:text-[#b87168] transition"
            >
              <InstagramIcon size={14} />
              {copied ? "✓ Copied — opening Instagram" : "Or order on Instagram"}
            </button>
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

      <CheckoutForm
        open={checkout}
        onClose={() => setCheckout(false)}
        lines={lines.map((x) => ({
          id: x.line.id,
          name: x.product!.name,
          price: x.product!.price,
          qty: x.line.qty,
        }))}
        subtotal={subtotal}
        onPlaced={(ref) => {
          setCheckout(false);
          setPlacedRef(ref);
          clearCart();
        }}
      />

      {placedRef && (
        <OrderPlaced refCode={placedRef} onClose={() => setPlacedRef(null)} />
      )}
    </>
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
