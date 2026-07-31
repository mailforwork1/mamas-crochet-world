import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = { id: string; qty: number };

type StoreCtx = {
  /* cart */
  cart: CartLine[];
  cartCount: number;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  /* wishlist */
  wishlist: string[];
  wishCount: number;
  isWished: (id: string) => boolean;
  toggleWish: (id: string) => void;
  wishOpen: boolean;
  setWishOpen: (v: boolean) => void;

  /* search */
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => load("mcw_cart", []));
  const [wishlist, setWishlist] = useState<string[]>(() => load("mcw_wish", []));
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("mcw_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("mcw_wish", JSON.stringify(wishlist));
  }, [wishlist]);

  /* lock body scroll while a panel is open */
  useEffect(() => {
    const anyOpen = cartOpen || wishOpen || searchOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, wishOpen, searchOpen]);

  /* close panels on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
        setWishOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<StoreCtx>(() => {
    const addToCart = (id: string, qty = 1) => {
      setCart((prev) => {
        const found = prev.find((l) => l.id === id);
        if (found) {
          return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
        }
        return [...prev, { id, qty }];
      });
    };

    return {
      cart,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      addToCart,
      removeFromCart: (id) => setCart((prev) => prev.filter((l) => l.id !== id)),
      setQty: (id, qty) =>
        setCart((prev) =>
          qty <= 0
            ? prev.filter((l) => l.id !== id)
            : prev.map((l) => (l.id === id ? { ...l, qty } : l))
        ),
      clearCart: () => setCart([]),
      cartOpen,
      setCartOpen,

      wishlist,
      wishCount: wishlist.length,
      isWished: (id) => wishlist.includes(id),
      toggleWish: (id) =>
        setWishlist((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        ),
      wishOpen,
      setWishOpen,

      searchOpen,
      setSearchOpen,
    };
  }, [cart, wishlist, cartOpen, wishOpen, searchOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
