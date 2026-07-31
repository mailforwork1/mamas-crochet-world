import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Route =
  | { name: "home" }
  | { name: "product"; id: string }
  | { name: "category"; slug: string }
  | { name: "shop" }
  | { name: "admin" };

type RouterCtx = {
  route: Route;
  navigate: (r: Route) => void;
};

const RouterContext = createContext<RouterCtx | null>(null);

/** Netlify Identity puts its tokens in the hash — leave those alone. */
function isIdentityHash(h: string) {
  return /(invite_token|recovery_token|confirmation_token|email_change_token|access_token|error_description)=/.test(h);
}

function parseHash(): Route {
  const raw = window.location.hash;
  if (isIdentityHash(raw)) return { name: "admin" };
  const h = raw.replace(/^#\/?/, "");
  if (h.startsWith("product/")) return { name: "product", id: h.slice("product/".length) };
  if (h.startsWith("category/")) return { name: "category", slug: h.slice("category/".length) };
  if (h === "shop") return { name: "shop" };
  if (h === "admin") return { name: "admin" };
  return { name: "home" };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() =>
    typeof window !== "undefined" ? parseHash() : { name: "home" }
  );

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    const iv = window.setInterval(onHash, 400);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
      window.clearInterval(iv);
    };
  }, []);

  const navigate = (r: Route) => {
    const hash =
      r.name === "home" ? "#/"
      : r.name === "shop" ? "#/shop"
      : r.name === "admin" ? "#/admin"
      : r.name === "product" ? `#/product/${r.id}`
      : `#/category/${r.slug}`;
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}
