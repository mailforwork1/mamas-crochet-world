import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { useRouter } from "../router";
import { useCatalog } from "../catalog";
import { SparkleIcon } from "./Icons";

export default function CategoryPage({ slug }: { slug?: string }) {
  const { navigate } = useRouter();
  const { categories, products: allProducts, productsByCategory, productsBySubcategory } = useCatalog();
  const meta = categories.find((c) => c.slug === slug);
  const isShop = !slug || slug === "all";

  const items = useMemo(
    () => (isShop ? allProducts : productsByCategory(slug!)),
    [slug, isShop]
  );
  const subgroups = useMemo(
    () => (isShop ? [] : productsBySubcategory(slug!)),
    [slug, isShop]
  );

  const defaultSub = subgroups.length > 0 ? subgroups[0].name : "all";
  const [sub, setSub] = useState<string>(defaultSub);

  // reset to the first sub-category whenever the category changes
  useEffect(() => {
    setSub(subgroups.length > 0 ? subgroups[0].name : "all");
  }, [slug, isShop]);
  const [sort, setSort] = useState<"featured" | "priceAsc" | "priceDesc">("featured");

  const filtered = useMemo(() => {
    let list = sub === "all" ? items : items.filter((p) => p.subcategory === sub);
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [items, sub, sort]);

  return (
    <div className="relative">
      {/* Hero banner */}
      <section className="relative overflow-hidden border-b border-[#f3d9d4]/50">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#f3d9d4]/40 blur-3xl" />
        <div className="pointer-events-none absolute top-20 -right-24 h-96 w-96 rounded-full bg-[#d9d3e4]/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-14">
          {/* Breadcrumb */}
          <nav className="text-xs tracking-[0.18em] uppercase text-[#4a3f3a]/60">
            <button onClick={() => navigate({ name: "home" })} className="hover:text-[#b87168]">Home</button>
            <span className="mx-2">·</span>
            <button onClick={() => navigate({ name: "shop" })} className="hover:text-[#b87168]">Shop</button>
            {!isShop && (
              <>
                <span className="mx-2">·</span>
                <span className="text-[#4a3f3a]">{meta?.name}</span>
              </>
            )}
          </nav>

          <div className="mt-8 grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <p className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">
                <SparkleIcon size={12} /> {isShop ? "The Whole Cottage" : meta?.name}
              </p>
              <h1 className="font-serif mt-4 text-5xl md:text-6xl leading-[1.05] text-[#4a3f3a]">
                {isShop ? "Shop the Full Collection" : meta?.name}
              </h1>
              <p className="mt-4 max-w-xl text-[#4a3f3a]/75 leading-relaxed">
                {isShop
                  ? "Everything we make — from tiny pouches to heirloom cardigans, slow-stitched in our cottage studio."
                  : meta?.tagline}
              </p>
            </div>
            <div className="lg:col-span-4 text-sm text-[#4a3f3a]/70">
              <div className="rounded-2xl bg-white/70 ring-1 ring-[#e8b4ad]/25 p-5">
                <p className="text-[0.7rem] tracking-[0.22em] uppercase text-[#b87168]">Handmade care</p>
                <p className="mt-2 leading-relaxed">
                  Each piece is stitched to order in 7–14 days, wrapped in tissue with a wax-sealed note.
                </p>
              </div>
            </div>
          </div>

          {/* Sub-category cards */}
          {!isShop && subgroups.length > 0 && (
            <div className="mt-10">
              <p className="text-[0.65rem] tracking-[0.28em] uppercase text-[#4a3f3a]/50 mb-4">
                Browse {meta?.name}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {subgroups.map((g) => {
                  const active = sub === g.name;
                  return (
                    <button
                      key={g.name}
                      onClick={() => setSub(g.name)}
                      aria-pressed={active}
                      className={`group relative aspect-[4/3] overflow-hidden rounded-3xl text-left transition-all duration-500 ${
                        active
                          ? "ring-2 ring-[#b87168] shadow-lg"
                          : "ring-1 ring-[#e8b4ad]/30 hover:shadow-xl"
                      }`}
                    >
                      <img
                        src={g.image}
                        alt={g.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 transition ${
                          active
                            ? "bg-gradient-to-t from-[#b87168]/90 via-[#3c352e]/40 to-[#3c352e]/10"
                            : "bg-gradient-to-t from-[#3c352e]/85 via-[#3c352e]/25 to-[#3c352e]/5"
                        }`}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full mb-1.5">
                          {g.items.length} Products
                        </span>
                        <h3 className="font-serif text-sm md:text-base font-semibold text-white leading-tight">
                          {g.name}
                        </h3>
                      </div>
                      {active && (
                        <span className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full bg-white text-[#b87168]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category quick-links (shop page only) */}
      {isShop && (
        <section className="mx-auto max-w-7xl px-6 pt-12">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate({ name: "category", slug: c.slug })}
                className="group rounded-2xl bg-white/60 ring-1 ring-[#e8b4ad]/25 p-3 hover:bg-white hover:shadow transition text-center"
              >
                <div className="mx-auto h-14 w-14 rounded-xl overflow-hidden">
                  <img src={c.image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition" />
                </div>
                <p className="mt-2 text-[0.6rem] tracking-[0.15em] uppercase text-[#4a3f3a] leading-tight">
                  {c.short}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Toolbar + product grid */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between border-y border-[#e8b4ad]/30 py-4">
          <p className="text-xs tracking-[0.18em] uppercase text-[#4a3f3a]/70">
            {filtered.length} pieces
          </p>
          <label className="text-xs tracking-[0.18em] uppercase text-[#4a3f3a]/70 flex items-center gap-2">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-transparent border-b border-[#e8b4ad]/50 px-2 py-1 text-[#4a3f3a] outline-none focus:border-[#b87168]"
            >
              <option value="featured">Featured</option>
              <option value="priceAsc">Price · Low to High</option>
              <option value="priceDesc">Price · High to Low</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-[#4a3f3a]">Nothing here yet — but soon.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Sister categories */}
      {!isShop && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="border-t border-[#e8b4ad]/30 pt-12">
            <p className="text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168] text-center">
              Wander a little further
            </p>
            <h2 className="font-serif text-center mt-3 text-3xl text-[#4a3f3a]">
              More cottage corners
            </h2>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories
                .filter((c) => c.slug !== slug)
                .slice(0, 4)
                .map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => navigate({ name: "category", slug: c.slug })}
                    className="group relative overflow-hidden rounded-[24px] text-left"
                  >
                    <img src={c.image} alt="" className="aspect-[4/5] w-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a3f3a]/70 via-[#4a3f3a]/10 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 text-[#fdfaf4]">
                      <p className="font-serif text-lg">{c.short}</p>
                      <p className="text-[0.6rem] tracking-[0.2em] uppercase opacity-80 mt-1">
                        Explore →
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
