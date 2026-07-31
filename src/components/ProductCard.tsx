import { HeartIcon, StarIcon } from "./Icons";
import { useRouter } from "../router";
import { useStore } from "../store";
import { formatPrice } from "../utils/cn";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: string;
  rating?: number;
  reviews?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { navigate } = useRouter();
  const { isWished, toggleWish } = useStore();
  const wished = isWished(product.id);
  const go = () => navigate({ name: "product", id: product.id });

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <article className="group relative">
      <div
        onClick={go}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go()}
        aria-label={`View ${product.name}`}
        className="relative cursor-pointer overflow-hidden rounded-[28px] bg-[#f6ede0]/40 ring-1 ring-[#e8b4ad]/20 focus:outline-none focus:ring-2 focus:ring-[#d99a93]"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {product.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-[#fdfaf4]/90 px-3 py-1 text-[0.65rem] font-medium tracking-[0.18em] uppercase text-[#b87168] backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={stop(() => toggleWish(product.id))}
          className={`absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition hover:scale-110 ${
            wished ? "bg-[#b87168] text-white" : "bg-[#fdfaf4]/90 text-[#b87168] hover:bg-white"
          }`}
        >
          <HeartIcon size={16} />
        </button>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={stop(go)}
            className="pointer-events-auto w-full rounded-full bg-[#4a3f3a] py-2.5 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168]"
          >
            View Product
          </button>
        </div>
      </div>

      <div className="px-1 pt-4 cursor-pointer" onClick={go}>
        <div className="flex items-center gap-1 text-[#d99a93]">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={i < (product.rating ?? 5) ? "" : "opacity-25"} />
          ))}
          <span className="ml-1 text-[0.7rem] text-[#4a3f3a]/55">
            ({product.reviews ?? 24})
          </span>
        </div>
        <h3 className="font-serif mt-1.5 text-lg leading-snug text-[#4a3f3a] hover:text-[#b87168] transition">
          {product.name}
        </h3>
        <p className="mt-0.5 text-sm text-[#b87168]">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
