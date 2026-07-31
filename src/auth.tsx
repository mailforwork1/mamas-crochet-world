import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------
   Admin authentication.

   • On Netlify  -> uses Netlify Identity (real email + password login,
                    invite-only, with password reset).
   • Locally     -> falls back to a simple email + passcode so you can
                    still open the panel with `npm run dev`.
------------------------------------------------------------------- */

/** Local-dev fallback only. On Netlify, access is controlled by
 *  Identity + the ADMIN_EMAILS environment variable. */
export const DEV_ADMIN_EMAILS = ["mamascrochetworld@gmail.com"];
export const DEV_ADMIN_PASSCODE = "mama2026";

type IdentityUser = {
  email: string;
  token?: { access_token?: string };
  app_metadata?: { roles?: string[] };
  jwt: () => Promise<string>;
};

type NetlifyIdentity = {
  init: (opts?: Record<string, unknown>) => void;
  open: (tab?: string) => void;
  close: () => void;
  logout: () => Promise<void>;
  currentUser: () => IdentityUser | null;
  on: (event: string, cb: (user?: IdentityUser) => void) => void;
};

declare global {
  interface Window {
    netlifyIdentity?: NetlifyIdentity;
  }
}

type AuthCtx = {
  email: string | null;
  isAdmin: boolean;
  /** true when Netlify Identity is available (i.e. deployed) */
  hasIdentity: boolean;
  ready: boolean;
  /** opens the Netlify Identity modal */
  openLogin: () => void;
  /** local-dev fallback login */
  devLogin: (email: string, passcode: string) => { ok: boolean; error?: string };
  logout: () => void;
  /** fresh JWT for API calls, or null when running locally */
  getToken: () => Promise<string | null>;
};

const Ctx = createContext<AuthCtx | null>(null);
const DEV_KEY = "mcw_admin_dev_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<NetlifyIdentity | null>(null);
  const [user, setUser] = useState<IdentityUser | null>(null);
  const [devEmail, setDevEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(DEV_KEY);
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(false);

  /* Wire up Netlify Identity if the widget is on the page */
  useEffect(() => {
    let tries = 0;
    const attach = () => {
      const ni = window.netlifyIdentity;
      if (!ni) {
        if (tries++ < 20) return void setTimeout(attach, 150);
        setReady(true); // no Identity -> local mode
        return;
      }
      ni.on("init", (u) => {
        setUser(u ?? null);
        setReady(true);
      });
      ni.on("login", (u) => {
        setUser(u ?? null);
        ni.close();
      });
      ni.on("logout", () => setUser(null));
      ni.init();
      setIdentity(ni);
    };
    attach();
  }, []);

  useEffect(() => {
    try {
      if (devEmail) localStorage.setItem(DEV_KEY, devEmail);
      else localStorage.removeItem(DEV_KEY);
    } catch {
      /* ignore */
    }
  }, [devEmail]);

  const value = useMemo<AuthCtx>(() => {
    const hasIdentity = !!identity;
    const email = user?.email ?? (hasIdentity ? null : devEmail);

    return {
      email,
      // With Identity, the server is the real gatekeeper — any signed-in
      // Identity user gets the UI, but writes are rejected unless the
      // server recognises them as an admin.
      isAdmin: hasIdentity
        ? !!user
        : !!devEmail && DEV_ADMIN_EMAILS.includes(devEmail.toLowerCase()),
      hasIdentity,
      ready,
      openLogin: () => identity?.open("login"),
      devLogin: (e, code) => {
        const clean = e.toLowerCase().trim();
        if (!DEV_ADMIN_EMAILS.includes(clean))
          return { ok: false, error: "This email does not have admin access." };
        if (code !== DEV_ADMIN_PASSCODE) return { ok: false, error: "Incorrect passcode." };
        setDevEmail(clean);
        return { ok: true };
      },
      logout: () => {
        if (identity) identity.logout();
        setDevEmail(null);
      },
      getToken: async () => {
        const u = identity?.currentUser();
        if (!u) return null;
        try {
          return await u.jwt();
        } catch {
          return null;
        }
      },
    };
  }, [identity, user, devEmail, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
