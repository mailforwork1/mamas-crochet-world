import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductPage from "./components/ProductPage";
import CategoryPage from "./components/CategoryPage";
import { HookIcon, LeafIcon, SparkleIcon, StarIcon } from "./components/Icons";
import { useRouter } from "./router";
import Panels from "./components/Panels";
import AdminPage from "./components/AdminPage";
import { useCatalog } from "./catalog";
import { formatPrice } from "./utils/cn";
import { testimonials } from "./data";

export default function App() {
  const { route } = useRouter();

  return (
    <div className="min-h-screen bg-[#fdfaf4] text-[#4a3f3a]">
      <Header />
      {route.name === "admin" ? (
        <AdminPage />
      ) : route.name === "product" ? (
        <ProductPage id={route.id} />
      ) : route.name === "category" ? (
        <CategoryPage slug={route.slug} />
      ) : route.name === "shop" ? (
        <CategoryPage />
      ) : (
        <>
          <Hero />
          <Marquee />
          <Categories />
          <NewArrivals />
          <HandmadeStory />
          <Testimonials />
        </>
      )}
      <Footer />
      <Panels />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative botanical blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#f3d9d4]/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-[#d9d3e4]/40 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 pt-10 lg:pt-16 pb-20 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 relative z-10 float-up">
          <p className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.3em] uppercase text-[#b87168]">
            <SparkleIcon size={14} /> Handmade with love
          </p>
          <h1 className="font-serif mt-5 text-5xl md:text-6xl lg:text-[4.6rem] leading-[1.02] text-[#4a3f3a]">
            Beautifully{" "}
            <span className="font-script text-[#b87168] italic font-normal">Handcrafted</span>
            <br />
            Creations,
            <br />
            <span className="text-[#8aa384]">Made with Love.</span>
          </h1>
          <p className="mt-7 max-w-md text-base md:text-lg leading-relaxed text-[#4a3f3a]/75">
            From garden-fresh florals to lace-soft cardigans — every piece is hand-loomed
            with natural fibres and a slow, careful heart.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#home-decor"
              className="rounded-full bg-[#4a3f3a] px-8 py-4 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition shadow-[0_18px_40px_-20px_rgba(74,63,58,0.55)]"
            >
              Shop the Collection
            </a>
            <a
              href="#story"
              className="group inline-flex items-center gap-3 text-sm text-[#4a3f3a] hover:text-[#b87168] transition"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white ring-1 ring-[#e8b4ad]/30">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span className="tracking-[0.2em] uppercase text-[0.72rem]">Our story</span>
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8">
            <Stat number="2,400+" label="Happy homes" />
            <span className="h-8 w-px bg-[#e8b4ad]/50" />
            <Stat number="100%" label="Hand-loomed" />
            <span className="h-8 w-px bg-[#e8b4ad]/50" />
            <Stat number="14 yrs" label="Of slow craft" />
          </div>
        </div>

        {/* Hero image */}
        <div className="lg:col-span-7 relative">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[44px] bg-gradient-to-br from-[#f3d9d4] via-[#fdfaf4] to-[#c5d3bf]/60 blur-xl opacity-70" />
            <div className="relative overflow-hidden rounded-[40px] ring-1 ring-white/60 shadow-[0_40px_120px_-40px_rgba(184,113,104,0.45)]">
              <img
                src="/images/hero.jpg"
                alt="A woman wearing a handmade white lace crochet cardigan in a sunlit garden"
                className="h-[520px] md:h-[640px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4a3f3a]/30 via-transparent to-transparent" />

              {/* Floating product card */}
              <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-xs rounded-2xl bg-[#fdfaf4]/95 backdrop-blur-md p-4 ring-1 ring-white shadow-xl">
                <div className="flex items-center gap-3">
                  <img src="/images/cardigan.jpg" alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base text-[#4a3f3a] truncate">Lillian Lace Cardigan</p>
                    <div className="flex items-center gap-1 text-[#d99a93] mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={11} />)}
                      <span className="ml-1 text-[0.65rem] text-[#4a3f3a]/55">312 reviews</span>
                    </div>
                  </div>
                  <span className="text-sm text-[#b87168] font-medium">Rs 5,500</span>
                </div>
              </div>
            </div>

            {/* Decorative badge */}
            <div className="hidden md:flex absolute -top-6 -left-6 h-28 w-28 rounded-full bg-[#fdfaf4] ring-1 ring-[#e8b4ad]/30 items-center justify-center text-center text-[0.55rem] tracking-[0.25em] uppercase text-[#b87168] shadow-lg rotate-[-10deg]">
              <span>Made<br />with<br />♥ Love</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-2xl text-[#4a3f3a]">{number}</div>
      <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[#4a3f3a]/55 mt-1">{label}</div>
    </div>
  );
}

/* ---------- MARQUEE / VALUE BAR ---------- */
function Marquee() {
  const items = [
    { icon: <HookIcon />, text: "Hand-loomed in small batches" },
    { icon: <LeafIcon />, text: "Natural cotton & merino" },
    { icon: <SparkleIcon />, text: "Free wrapping over Rs 5,000" },
    { icon: <HookIcon />, text: "Sustainably stitched" },
    { icon: <LeafIcon />, text: "From our cottage to yours" },
  ];
  return (
    <section className="border-y border-[#f3d9d4]/60 bg-[#fdfaf4]">
      <div className="mx-auto max-w-7xl px-6 py-5 grid grid-cols-2 md:grid-cols-5 gap-6 text-[#4a3f3a]/80">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 text-xs tracking-[0.16em] uppercase">
            <span className="text-[#b87168]">{it.icon}</span>
            <span className="leading-tight">{it.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- CATEGORIES ---------- */
function Categories() {
  const { navigate } = useRouter();
  const { categories, productsByCategory } = useCatalog();
  const sizes = ["normal", "wide", "normal", "wide", "normal", "normal", "normal", "wide", "normal"] as const;

  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 pt-24">
      <div className="text-center mb-10 md:mb-14">
        <p className="text-[0.7rem] md:text-xs font-medium uppercase tracking-[0.28em] text-[#b87168] mb-3">
          ✦ Explore Our Collection
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#4a3f3a]">
          Shop by <span className="italic text-[#b87168]">Category</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {categories.map((c, i) => {
          const size = sizes[i] ?? "normal";
          const count = productsByCategory(c.slug).length;
          return (
            <button
              key={c.slug}
              onClick={() => navigate({ name: "category", slug: c.slug })}
              className={`group relative overflow-hidden rounded-3xl text-left shadow-sm hover:shadow-xl transition-all duration-500 ${
                size === "wide" ? "aspect-[16/9] md:col-span-2" : "aspect-[4/3]"
              }`}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3c352e]/85 via-[#3c352e]/20 to-[#3c352e]/5" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                {count > 0 && (
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full mb-2">
                    {count} Products
                  </span>
                )}
                <h3 className="font-serif text-lg md:text-xl font-semibold text-white mb-1 leading-tight">
                  {c.name}
                </h3>
                <span className="text-[0.65rem] font-medium text-white/80 uppercase tracking-[0.18em] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Shop Now
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate({ name: "shop" })}
          className="rounded-full bg-[#4a3f3a] px-8 py-3 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
        >
          Shop the full collection →
        </button>
      </div>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-xl"}>
      <p className="inline-flex items-center gap-3 text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">
        <span className="h-px w-6 bg-[#d99a93]" />
        {eyebrow}
        <span className="h-px w-6 bg-[#d99a93]" />
      </p>
      <h2 className="font-serif mt-4 text-4xl md:text-5xl text-[#4a3f3a] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-[#4a3f3a]/70 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

/* ---------- NEW ARRIVALS ---------- */
function NewArrivals() {
  const { navigate } = useRouter();
  const { newArrivals } = useCatalog();
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <div className="flex items-end justify-between flex-wrap gap-6">
        <SectionTitle
          eyebrow="Fresh off the hook"
          title="New Arrivals"
          subtitle="Tiny new wonders just stitched and wrapped in tissue."
          align="left"
        />
        <button
          onClick={() => navigate({ name: "shop" })}
          className="text-xs tracking-[0.22em] uppercase text-[#b87168] hover:text-[#4a3f3a] transition"
        >
          View all →
        </button>
      </div>

      {/* Bento grid — first piece large, four beside it */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[190px] md:auto-rows-[215px]">
        {newArrivals.map((p, i) => (
          <button
            key={p.id}
            onClick={() => navigate({ name: "product", id: p.id })}
            className={`group relative overflow-hidden rounded-3xl text-left shadow-sm hover:shadow-xl transition-all duration-500 ring-1 ring-[#e8b4ad]/20 ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3c352e]/85 via-[#3c352e]/20 to-[#3c352e]/5" />

            {p.badge && (
              <span className="absolute top-4 left-4 rounded-full bg-[#fdfaf4]/90 px-3 py-1 text-[0.6rem] font-medium tracking-[0.18em] uppercase text-[#b87168] backdrop-blur-sm">
                {p.badge}
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <h3
                className={`font-serif font-semibold text-white leading-tight ${
                  i === 0 ? "text-xl md:text-2xl" : "text-sm md:text-base"
                }`}
              >
                {p.name}
              </h3>
              <div className="mt-1 flex items-center gap-3">
                <span className={`text-white/90 ${i === 0 ? "text-base" : "text-xs"}`}>
                  {formatPrice(p.price)}
                </span>
                <span className="text-[0.6rem] font-medium text-white/75 uppercase tracking-[0.18em] flex items-center gap-1 group-hover:gap-2 transition-all">
                  View
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function HandmadeStory() {
  return (
    <section id="story" className="relative mt-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#fdfaf4] via-[#f6ede0]/40 to-[#fdfaf4]" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden rounded-[40px] ring-1 ring-white shadow-[0_30px_80px_-30px_rgba(184,113,104,0.4)]">
            <img src="/images/story.jpg" alt="Hands crocheting in a sunlit studio" className="h-[560px] w-full object-cover" />
          </div>
          <div className="hidden md:block absolute -bottom-10 -right-6 w-56 rounded-[28px] overflow-hidden ring-1 ring-white shadow-2xl rotate-[6deg]">
            <img src="/images/flowers.jpg" alt="Crochet roses" className="aspect-[3/4] w-full object-cover" />
          </div>
        </div>

        <div className="lg:col-span-6 lg:pl-10">
          <SectionTitle
            eyebrow="Our Handmade Story"
            title="Slow craft, gentle days, tiny stitches."
            align="left"
          />
          <p className="mt-6 text-[#4a3f3a]/75 leading-relaxed">
            Mama's Crochet World began at a sunlit kitchen table — a single ball of cotton,
            a worn wooden hook, and a daughter who wanted to wear the meadow. Fourteen years
            later we are still that same cottage studio, only with a few more friends, an
            overgrown garden, and a great deal more yarn.
          </p>
          <p className="mt-4 text-[#4a3f3a]/75 leading-relaxed">
            Every piece you'll find here is hand-loomed in small batches, dyed with botanical
            love, and finished with a little wax-sealed note from the maker who made it.
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              { t: "Made one stitch at a time", d: "Never machine-knit, never rushed." },
              { t: "Naturally dyed fibres", d: "Soft cottons, merinos & linens." },
              { t: "Signed by the maker", d: "Each piece carries her initials." },
              { t: "Carbon-neutral shipping", d: "Wrapped in recyclable tissue." },
            ].map((f) => (
              <li key={f.t} className="rounded-2xl bg-white/70 ring-1 ring-[#e8b4ad]/30 p-5">
                <p className="font-serif text-lg text-[#4a3f3a]">{f.t}</p>
                <p className="mt-1 text-sm text-[#4a3f3a]/65">{f.d}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-4">
            <img src="/images/story.jpg" alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow" />
            <div>
              <p className="font-script text-2xl text-[#b87168] leading-none">Mama</p>
              <p className="text-[0.7rem] tracking-[0.22em] uppercase text-[#4a3f3a]/60 mt-1">
                Founder & Head Maker
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const reviews = testimonials;
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <SectionTitle eyebrow="Sweet Words" title="Loved by gentle homes" />
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="rounded-[28px] bg-gradient-to-br from-white to-[#f6ede0]/50 p-8 ring-1 ring-[#e8b4ad]/25 shadow-[0_20px_50px_-30px_rgba(184,113,104,0.3)]"
          >
            <div className="flex items-center gap-1 text-[#d99a93]">
              {Array.from({ length: 5 }).map((_, j) => <StarIcon key={j} size={14} />)}
            </div>
            <blockquote className="font-serif italic mt-5 text-lg leading-relaxed text-[#4a3f3a]">
              "{r.quote}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f3d9d4] text-[#b87168] font-serif">
                {r.name.charAt(0)}
              </span>
              <div>
                <div className="text-sm font-medium text-[#4a3f3a]">{r.name}</div>
                <div className="text-xs text-[#4a3f3a]/55">{r.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
