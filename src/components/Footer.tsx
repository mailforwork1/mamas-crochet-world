import { useState } from "react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, PinterestIcon } from "./Icons";
import { useRouter } from "../router";
import { useCatalog } from "../catalog";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { navigate } = useRouter();
  const { categories, settings } = useCatalog();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative mt-24 bg-gradient-to-b from-[#fdfaf4] to-[#f6ede0]/60 pt-20 pb-10">
      {/* Newsletter band */}
      <section className="mx-auto max-w-5xl px-6 -mt-32 mb-16">
        <div className="rounded-[40px] bg-gradient-to-br from-[#f3d9d4]/70 via-[#fdfaf4] to-[#d9d3e4]/60 p-10 md:p-14 ring-1 ring-white shadow-[0_30px_80px_-40px_rgba(184,113,104,0.35)]">
          <div className="text-center">
            <p className="text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">
              ✿ Join Our Cottage Letter ✿
            </p>
            <h3 className="font-serif mt-3 text-3xl md:text-4xl text-[#4a3f3a]">
              Stitches of joy in your inbox
            </h3>
            <p className="mt-3 text-sm md:text-base text-[#4a3f3a]/70 max-w-xl mx-auto">
              Sign up for early access to new collections, behind-the-loop stories,
              and a sweet 10% off your first handmade treasure.
            </p>

            <form onSubmit={submit} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-full bg-white/80 px-5 py-3 text-sm text-[#4a3f3a] placeholder:text-[#4a3f3a]/40 outline-none ring-1 ring-[#e8b4ad]/30 focus:ring-2 focus:ring-[#d99a93]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#4a3f3a] px-7 py-3 text-xs font-medium tracking-[0.2em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="mt-4 text-sm text-[#5d7a58]">
                ✿ Welcome to the family — check your inbox for a little gift.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-[#4a3f3a]/70 max-w-xs">
              A small studio of slow craft. Every stitch is hand-loomed in our cottage
              with natural fibres and a great deal of love.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: InstagramIcon, label: "Instagram", href: `https://www.instagram.com/${settings.igHandle}/` },
                { Icon: PinterestIcon, label: "Pinterest", href: "#" },
                { Icon: FacebookIcon, label: "Facebook", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href === "#" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#b87168] ring-1 ring-[#e8b4ad]/30 hover:bg-[#f3d9d4] hover:scale-110 transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
            <a
              href={`https://www.instagram.com/${settings.igHandle}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-[#b87168] font-medium hover:text-[#4a3f3a] transition"
            >
              @{settings.igHandle}
            </a>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-serif text-base text-[#4a3f3a]">Shop</h4>
            <ul className="mt-4 space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => navigate({ name: "category", slug: c.slug })}
                    className="text-sm text-[#4a3f3a]/70 hover:text-[#b87168] transition text-left"
                  >
                    {c.short}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate({ name: "shop" })}
                  className="text-sm text-[#b87168] hover:text-[#4a3f3a] transition text-left"
                >
                  View all →
                </button>
              </li>
            </ul>
          </div>
          <FooterCol
            title="The Studio"
            links={["Our Handmade Story", "Custom Orders", "Care Guide", "Sustainability", "Press & Features"]}
          />
          <FooterCol
            title="Help"
            links={["Shipping & Returns", "Order Tracking", "FAQ", "Contact", "Wholesale"]}
          />
        </div>

        <div className="mt-14 border-t border-[#e8b4ad]/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#4a3f3a]/60">
          <p>
            © {new Date().getFullYear()} Mama's Crochet World. Stitched with love.
            <button
              onClick={() => navigate({ name: "admin" })}
              aria-label="Admin"
              className="ml-2 text-[#4a3f3a]/25 hover:text-[#b87168] transition"
              title="Admin"
            >
              ·
            </button>
          </p>
          <p className="flex items-center gap-4">
            <a href="#" className="hover:text-[#b87168]">Privacy</a>
            <a href="#" className="hover:text-[#b87168]">Terms</a>
            <a href="#" className="hover:text-[#b87168]">Accessibility</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="font-serif text-base text-[#4a3f3a]">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-[#4a3f3a]/70 hover:text-[#b87168] transition">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
