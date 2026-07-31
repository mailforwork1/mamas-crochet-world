import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  allProducts as baseProducts,
  categories as baseCategories,
  subImages as baseSubImages,
  type ProductDetail,
  type CategoryMeta,
} from "./data";
import { useAuth } from "./auth";

/* ------------------------------------------------------------------
   Live catalog: base data from data.ts + any edits saved by the admin.
   Edits live in localStorage so nothing is lost on refresh, and can be
   exported / imported as a single JSON file.
------------------------------------------------------------------- */

export type Catalog = {
  products: ProductDetail[];
  categories: CategoryMeta[];
  subImages: Record<string, string>;
  settings: {
    igHandle: string;
    freeWrapOver: number;
    announcement: string;
  };
};

export const DEFAULT_SETTINGS: Catalog["settings"] = {
  igHandle: "mamas_crochet_world",
  freeWrapOver: 5000,
  announcement: "✿ Complimentary Wrapping on Orders Over Rs 5,000 · Nationwide Delivery ✿",
};

const STORAGE_KEY = "mcw_catalog_v1";

/** Downscale an image and return a data URL (local-dev fallback). */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1000;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve(String(reader.result));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function baseCatalog(): Catalog {
  return {
    products: JSON.parse(JSON.stringify(baseProducts)),
    categories: JSON.parse(JSON.stringify(baseCategories)),
    subImages: { ...baseSubImages },
    settings: { ...DEFAULT_SETTINGS },
  };
}

function loadCatalog(): Catalog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseCatalog();
    const saved = JSON.parse(raw) as Partial<Catalog>;
    const b = baseCatalog();
    return {
      products: saved.products?.length ? saved.products : b.products,
      categories: saved.categories?.length ? saved.categories : b.categories,
      subImages: saved.subImages ?? b.subImages,
      settings: { ...b.settings, ...(saved.settings ?? {}) },
    };
  } catch {
    return baseCatalog();
  }
}

type CatalogCtx = {
  catalog: Catalog;
  products: ProductDetail[];
  categories: CategoryMeta[];
  settings: Catalog["settings"];

  getProduct: (id: string) => ProductDetail | undefined;
  productsByCategory: (slug: string) => ProductDetail[];
  productsBySubcategory: (
    slug: string
  ) => { name: string; items: ProductDetail[]; image: string }[];
  newArrivals: ProductDetail[];
  favorites: ProductDetail[];

  /* admin actions */
  saveProduct: (p: ProductDetail) => void;
  deleteProduct: (id: string) => void;
  saveCategory: (c: CategoryMeta) => void;
  deleteCategory: (slug: string) => void;
  setSubImage: (name: string, image: string) => void;
  updateSettings: (s: Partial<Catalog["settings"]>) => void;
  resetAll: () => void;
  importCatalog: (c: Catalog) => void;
  isDirty: boolean;

  /* server sync (Netlify) */
  loading: boolean;
  publishing: boolean;
  lastPublished: string | null;
  publishError: string | null;
  publish: () => Promise<boolean>;
  uploadImage: (file: File) => Promise<string>;
};

const Ctx = createContext<CatalogCtx | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { getToken, hasIdentity } = useAuth();
  const [catalog, setCatalog] = useState<Catalog>(() => loadCatalog());
  const [isDirty, setDirty] = useState(
    () => typeof localStorage !== "undefined" && !!localStorage.getItem(STORAGE_KEY)
  );
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [lastPublished, setLastPublished] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  /* Load the live catalog published by the admin (everyone sees this) */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/catalog", { headers: { accept: "application/json" } });
        if (res.status === 204) return; // nothing published yet -> use bundled data
        if (!res.ok) return;
        const remote = (await res.json()) as Partial<Catalog> & { updatedAt?: string };
        if (cancelled || !remote?.products?.length) return;
        const b = baseCatalog();
        setCatalog({
          products: remote.products,
          categories: remote.categories?.length ? remote.categories : b.categories,
          subImages: remote.subImages ?? b.subImages,
          settings: { ...b.settings, ...(remote.settings ?? {}) },
        });
        setLastPublished(remote.updatedAt ?? null);
        setDirty(false);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch { /* ignore */ }
      } catch {
        /* offline or local dev — bundled data is fine */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    } catch {
      /* quota — ignore */
    }
  }, [catalog]);

  const value = useMemo<CatalogCtx>(() => {
    const products = catalog.products;

    const productsByCategory = (slug: string) =>
      products.filter((p) => p.categorySlug === slug);

    return {
      catalog,
      products,
      categories: catalog.categories,
      settings: catalog.settings,

      getProduct: (id) => products.find((p) => p.id === id),
      productsByCategory,
      productsBySubcategory: (slug) => {
        const list = productsByCategory(slug);
        const groups = new Map<string, ProductDetail[]>();
        list.forEach((p) => {
          const key = p.subcategory ?? "Everything";
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(p);
        });
        return Array.from(groups.entries()).map(([name, items]) => ({
          name,
          items,
          image: catalog.subImages[name] ?? items[0]?.image ?? "",
        }));
      },
      newArrivals: products.filter((p) => p.badge === "New").slice(0, 5),
      favorites: products.filter((p) => p.badge === "Bestseller").slice(0, 8),

      saveProduct: (p) => {
        setDirty(true);
        setCatalog((c) => {
          const i = c.products.findIndex((x) => x.id === p.id);
          const products = [...c.products];
          if (i >= 0) products[i] = p;
          else products.unshift(p);
          return { ...c, products };
        });
      },
      deleteProduct: (id) => {
        setDirty(true);
        setCatalog((c) => ({ ...c, products: c.products.filter((p) => p.id !== id) }));
      },
      saveCategory: (cat) => {
        setDirty(true);
        setCatalog((c) => {
          const i = c.categories.findIndex((x) => x.slug === cat.slug);
          const categories = [...c.categories];
          if (i >= 0) categories[i] = cat;
          else categories.push(cat);
          return { ...c, categories };
        });
      },
      deleteCategory: (slug) => {
        setDirty(true);
        setCatalog((c) => ({
          ...c,
          categories: c.categories.filter((x) => x.slug !== slug),
        }));
      },
      setSubImage: (name, image) => {
        setDirty(true);
        setCatalog((c) => ({ ...c, subImages: { ...c.subImages, [name]: image } }));
      },
      updateSettings: (s) => {
        setDirty(true);
        setCatalog((c) => ({ ...c, settings: { ...c.settings, ...s } }));
      },
      resetAll: () => {
        localStorage.removeItem(STORAGE_KEY);
        setCatalog(baseCatalog());
        setDirty(false);
      },
      publish: async () => {
        setPublishing(true);
        setPublishError(null);
        try {
          const token = await getToken();
          const res = await fetch("/api/catalog", {
            method: "PUT",
            headers: {
              "content-type": "application/json",
              ...(token ? { authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(catalog),
          });
          if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            setPublishError(e.error ?? `Could not publish (${res.status}).`);
            return false;
          }
          const out = await res.json();
          setLastPublished(out.updatedAt ?? new Date().toISOString());
          setDirty(false);
          return true;
        } catch {
          setPublishError("Network error — could not reach the server.");
          return false;
        } finally {
          setPublishing(false);
        }
      },

      uploadImage: async (file: File) => {
        const token = await getToken();
        // No server (local dev): fall back to an inline data URL.
        if (!hasIdentity || !token) return await fileToDataUrl(file);

        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error ?? "Upload failed.");
        }
        const { url } = await res.json();
        return url as string;
      },

      loading,
      publishing,
      lastPublished,
      publishError,

      importCatalog: (c) => {
        setDirty(true);
        setCatalog({
          products: c.products ?? [],
          categories: c.categories ?? [],
          subImages: c.subImages ?? {},
          settings: { ...DEFAULT_SETTINGS, ...(c.settings ?? {}) },
        });
      },
      isDirty,
    };
  }, [catalog, isDirty, loading, publishing, lastPublished, publishError, getToken, hasIdentity]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
