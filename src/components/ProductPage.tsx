import { useEffect, useMemo, useState } from "react";
import { useRouter } from "../router";
import { useStore } from "../store";
import { reviewsForProduct } from "../data";
import { useCatalog } from "../catalog";
import ProductCard from "./ProductCard";
import { HeartIcon, LeafIcon, SparkleIcon, StarIcon, HookIcon } from "./Icons";
import { formatPrice } from "../utils/cn";

export default function ProductPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const { getProduct, products: allProducts, settings } = useCatalog();
  const product = getProduct(id);

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">Little Oops</p>
        <h1 className="font-serif mt-4 text-4xl text-[#4a3f3a]">
          We couldn't find that piece.
        </h1>
        <p className="mt-4 text-[#4a3f3a]/70">
          It may have found a new home, or perhaps we're still stitching it.
        </p>
        <button
          onClick={() => navigate({ name: "home" })}
          className="mt-8 rounded-full bg-[#4a3f3a] px-8 py-3 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
        >
          Back to Shop
        </button>
      </section>
    );
  }

  // main photo first, then any extra gallery photos (no duplicates)
  const gallery = Array.from(
    new Set([product.image, ...(product.gallery ?? [])].filter(Boolean))
  );

  const [activeImg, setActiveImg] = useState(gallery[0]);

  // keep the big photo in sync when switching products
  useEffect(() => {
    setActiveImg(gallery[0]);
  }, [product.id]);
  const [color, setColor] = useState(product.colors?.[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"details" | "materials" | "care" | "shipping">("details");
  const { addToCart, isWished, toggleWish } = useStore();
  const wished = isWished(product.id);

  const related = useMemo(
    () =>
      allProducts
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4),
    [product]
  );

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  return (
    <div className="relative">
      {/* Soft decorative blobs */}
      <div className="pointer-events-none absolute top-0 -left-24 h-96 w-96 rounded-full bg-[#f3d9d4]/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-[#d9d3e4]/40 blur-3xl" />

      {/* Breadcrumb */}
      <div className="relative mx-auto max-w-7xl px-6 pt-8 text-xs tracking-[0.18em] uppercase text-[#4a3f3a]/60">
        <button onClick={() => navigate({ name: "home" })} className="hover:text-[#b87168]">Home</button>
        <span className="mx-2">·</span>
        <button onClick={() => navigate({ name: "shop" })} className="hover:text-[#b87168]">Shop</button>
        <span className="mx-2">·</span>
        <button
          onClick={() => navigate({ name: "category", slug: product.categorySlug })}
          className="hover:text-[#b87168]"
        >
          {product.category}
        </button>
        <span className="mx-2">·</span>
        <span className="text-[#4a3f3a]">{product.name}</span>
      </div>

      {/* Main gallery + details */}
      <section className="relative mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-12 gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 float-up">
          <div className="grid grid-cols-12 gap-4">
            {/* Thumbnails */}
            <div className="col-span-2 flex flex-col gap-3 order-2 md:order-1">
              {gallery.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveImg(g)}
                  className={`overflow-hidden rounded-2xl aspect-square ring-1 transition ${
                    activeImg === g
                      ? "ring-2 ring-[#b87168]"
                      : "ring-[#e8b4ad]/30 hover:ring-[#d99a93]"
                  }`}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="col-span-10 order-1 md:order-2">
              <div className="relative overflow-hidden rounded-[36px] ring-1 ring-white shadow-[0_30px_80px_-40px_rgba(184,113,104,0.35)]">
                <img
                  src={activeImg}
                  alt={product.name}
                  className="w-full h-[560px] md:h-[680px] object-cover"
                />
                {product.badge && (
                  <span className="absolute top-5 left-5 rounded-full bg-[#fdfaf4]/95 px-4 py-1.5 text-[0.65rem] font-medium tracking-[0.22em] uppercase text-[#b87168] backdrop-blur-sm">
                    {product.badge}
                  </span>
                )}
                <div className="absolute bottom-5 right-5 grid h-16 w-16 place-items-center rounded-full bg-[#fdfaf4]/95 text-center text-[0.5rem] tracking-[0.22em] uppercase text-[#b87168] shadow-lg">
                  <span>Made<br />with ♥</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 float-up" style={{ animationDelay: "120ms" }}>
          <p className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">
            <SparkleIcon size={12} />
            {product.category}
          </p>
          <h1 className="font-serif mt-4 text-4xl md:text-5xl leading-tight text-[#4a3f3a]">
            {product.name}
          </h1>
          {product.tagline && (
            <p className="font-script text-2xl text-[#b87168] mt-3">{product.tagline}</p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#d99a93]">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={14} className={i < (product.rating ?? 5) ? "" : "opacity-25"} />
              ))}
            </div>
            <span className="text-xs text-[#4a3f3a]/60">
              {(product.rating ?? 5).toFixed(1)} · {product.reviews ?? 0} loving reviews
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-[#4a3f3a]">{formatPrice(product.price)}</span>
            <span className="text-xs text-[#4a3f3a]/50 line-through">{formatPrice(product.price * 1.25)}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-[#c5d3bf]/50 text-[#5d7a58]">
              Save 20%
            </span>
          </div>

          {product.description && (
            <p className="mt-6 text-[#4a3f3a]/75 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-[0.7rem] tracking-[0.22em] uppercase text-[#4a3f3a]/70">Colour</p>
                <p className="text-xs text-[#b87168]">{color}</p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={`h-9 w-9 rounded-full ring-1 ring-[#e8b4ad]/40 transition ${
                      color === c.name ? "ring-2 ring-offset-2 ring-offset-[#fdfaf4] ring-[#b87168]" : ""
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[0.7rem] tracking-[0.22em] uppercase text-[#4a3f3a]/70">Size</p>
                <button className="text-xs text-[#b87168] hover:text-[#4a3f3a]">Size guide</button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] rounded-full px-4 py-2 text-xs tracking-[0.2em] uppercase transition ${
                      size === s
                        ? "bg-[#4a3f3a] text-[#fdfaf4]"
                        : "bg-white text-[#4a3f3a]/80 ring-1 ring-[#e8b4ad]/40 hover:ring-[#d99a93]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="inline-flex items-center rounded-full bg-white ring-1 ring-[#e8b4ad]/40">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
                className="h-12 w-12 grid place-items-center text-[#4a3f3a]/70 hover:text-[#b87168]"
              >
                −
              </button>
              <span className="w-10 text-center font-serif text-lg">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                aria-label="Increase quantity"
                className="h-12 w-12 grid place-items-center text-[#4a3f3a]/70 hover:text-[#b87168]"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 rounded-full bg-[#4a3f3a] px-8 py-4 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition shadow-[0_18px_40px_-20px_rgba(74,63,58,0.55)]"
            >
              {added ? "✿ Added to basket" : `Add to Basket · ${formatPrice(product.price * qty)}`}
            </button>
            <button
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wished}
              onClick={() => toggleWish(product.id)}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ring-1 ring-[#e8b4ad]/40 transition ${
                wished ? "bg-[#b87168] text-white" : "bg-white text-[#b87168] hover:bg-[#f3d9d4]"
              }`}
            >
              <HeartIcon />
            </button>
          </div>

          {/* Feature strip */}
          <ul className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { Icon: HookIcon, t: "Hand-loomed", s: "in 7–14 days" },
              { Icon: LeafIcon, t: "Natural fibres", s: "cotton & merino" },
              { Icon: SparkleIcon, t: "Free wrap", s: `over ${formatPrice(settings.freeWrapOver)}` },
            ].map(({ Icon, t, s }) => (
              <li key={t} className="rounded-2xl bg-white/70 p-4 ring-1 ring-[#e8b4ad]/25">
                <Icon className="mx-auto text-[#b87168]" size={20} />
                <p className="mt-2 text-[0.7rem] tracking-[0.18em] uppercase text-[#4a3f3a]">{t}</p>
                <p className="text-[0.65rem] text-[#4a3f3a]/60 mt-0.5">{s}</p>
              </li>
            ))}
          </ul>

          {/* Maker note */}
          <div className="mt-8 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-[#f3d9d4]/40 to-[#d9d3e4]/40 p-5">
            <img src="/images/story.jpg" alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow" />
            <div className="flex-1">
              <p className="font-script text-xl text-[#b87168] leading-none">
                Stitched by Mama
              </p>
              <p className="text-[0.7rem] text-[#4a3f3a]/70 mt-1">
                Each order arrives with a hand-signed note from your maker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="border-y border-[#e8b4ad]/30">
          <div className="flex flex-wrap gap-x-8 gap-y-2 py-4">
            {[
              { k: "details", l: "Details" },
              { k: "materials", l: "Materials & Dimensions" },
              { k: "care", l: "Care" },
              { k: "shipping", l: "Shipping & Returns" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k as typeof tab)}
                className={`text-xs tracking-[0.22em] uppercase transition ${
                  tab === t.k
                    ? "text-[#b87168] border-b-2 border-[#b87168] pb-2 -mb-4"
                    : "text-[#4a3f3a]/60 hover:text-[#4a3f3a]"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div className="py-10 grid md:grid-cols-2 gap-10 items-start">
          <div className="text-[#4a3f3a]/80 leading-relaxed">
            {tab === "details" && (
              <ul className="space-y-3">
                {(product.details ?? [
                  "Hand-loomed in our cottage studio",
                  "Signed by the maker",
                  "Wrapped in recycled tissue with a wax seal",
                ]).map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#d99a93] shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}
            {tab === "materials" && (
              <div className="space-y-3">
                <p><span className="text-[#4a3f3a]/60 mr-2">Materials:</span>{product.materials ?? "100% natural cotton yarn"}</p>
                <p><span className="text-[#4a3f3a]/60 mr-2">Dimensions:</span>{product.dimensions ?? "See product notes"}</p>
                <p><span className="text-[#4a3f3a]/60 mr-2">Origin:</span>Hand-loomed in our cottage studio, England</p>
              </div>
            )}
            {tab === "care" && (
              <ul className="space-y-3">
                {(product.care ?? [
                  "Spot clean with cool water and mild soap",
                  "Lay flat to dry, reshape gently",
                  "Store away from direct sunlight",
                ]).map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <LeafIcon className="text-[#8aa384] mt-0.5 shrink-0" size={16} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}
            {tab === "shipping" && (
              <div className="space-y-3">
                <p>Handmade with care — pieces are stitched to order in 7–14 days and shipped worldwide with carbon-neutral shipping.</p>
                <p>Free complimentary wrapping on orders over {formatPrice(settings.freeWrapOver)}. Returns accepted within 30 days on unworn, unused pieces.</p>
              </div>
            )}
          </div>

          {/* Second column: complementary content per tab */}
          <div className="rounded-[28px] overflow-hidden ring-1 ring-[#e8b4ad]/25">
            <img
              src={gallery[1] ?? gallery[0]}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Reviews snippet */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {reviewsForProduct(product.id).map((r, i) => (
            <figure
              key={i}
              className="rounded-[28px] bg-white/70 p-6 ring-1 ring-[#e8b4ad]/25"
            >
              <div className="flex items-center gap-1 text-[#d99a93]">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarIcon key={j} size={12} />
                ))}
              </div>
              <blockquote className="font-serif italic mt-3 text-[#4a3f3a]">
                "{r.quote}"
              </blockquote>
              <figcaption className="mt-3 text-xs text-[#4a3f3a]/60">— {r.name}, {r.role}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">
                You may also love
              </p>
              <h2 className="font-serif mt-3 text-3xl md:text-4xl text-[#4a3f3a]">
                More from {product.category}
              </h2>
            </div>
            <button
              onClick={() => navigate({ name: "category", slug: product.categorySlug })}
              className="text-xs tracking-[0.22em] uppercase text-[#b87168] hover:text-[#4a3f3a] transition"
            >
              View all →
            </button>
          </div>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
