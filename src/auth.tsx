import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------
   Admin authentication — talks to Netlify Identity (GoTrue) directly.

   We deliberately do NOT use the netlify-identity-widget: its popup
   fights with our hash router. Doing the few API calls ourselves is
   simpler and completely predictable.
------------------------------------------------------------------- */

const GOTRUE = "/.netlify/identity";
const SESSION_KEY = "mcw_admin_tokens";

/** Local-dev fallback (no Netlify server available). */
export const DEV_ADMIN_EMAILS = ["mamascrochetworld@gmail.com"];
export const DEV_ADMIN_PASSCODE = "mama2026";

type Tokens = {
  access_token: string;
  refresh_token?: string;
  expires_at: number; // ms epoch
};

/** Pending action taken from an invite / recovery email link. */
export type PendingToken = { kind: "invite" | "recovery"; token: string } | null;

type AuthCtx = {
  email: string | null;
  isAdmin: boolean;
  hasIdentity: boolean;
  ready: boolean;

  /** set when the user arrived from an email link and must choose a password */
  pending: PendingToken;
  clearPending: () => void;

  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>;
  /** completes an invite / recovery link by setting a new password */
  setPassword: (password: string) => Promise<{ ok: boolean; error?: string }>;

  devLogin: (email: string, passcode: string) => { ok: boolean; error?: string };
  logout: () => void;
  getToken: () => Promise<string | null>;
};

const Ctx = createContext<AuthCtx | null>(null);
const DEV_KEY = "mcw_admin_dev_session";

/* ---------- helpers ---------- */

function decodeEmail(jwt: string): string | null {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.email ?? null;
  } catch {
    return null;
  }
}

function readTokens(): Tokens | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  } catch {
    return null;
  }
}

function writeTokens(t: Tokens | null) {
  try {
    if (t) localStorage.setItem(SESSION_KEY, JSON.stringify(t));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

async function readError(res: Response, fallback: string) {
  try {
    const j = await res.json();
    return j.error_description || j.msg || j.error || fallback;
  } catch {
    return fallback;
  }
}

/** Pull an invite / recovery token out of the URL (or the stash made in index.html). */
function grabEmailLinkToken(): PendingToken {
  const sources: string[] = [];
  try {
    const stashed = sessionStorage.getItem("mcw_identity_hash");
    if (stashed) {
      sources.push(stashed);
      sessionStorage.removeItem("mcw_identity_hash");
    }
  } catch {
    /* ignore */
  }
  sources.push(window.location.hash, window.location.search);

  for (const src of sources) {
    if (!src) continue;
    const invite = src.match(/invite_token=([^&]+)/);
    if (invite) return { kind: "invite", token: decodeURIComponent(invite[1]) };
    const rec = src.match(/recovery_token=([^&]+)/);
    if (rec) return { kind: "recovery", token: decodeURIComponent(rec[1]) };
  }
  return null;
}

/* ---------- provider ---------- */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Tokens | null>(() => readTokens());
  const [devEmail, setDevEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(DEV_KEY);
    } catch {
      return null;
    }
  });
  const [pending, setPending] = useState<PendingToken>(null);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [ready, setReady] = useState(false);

  /* Grab any email-link token immediately, then send the user to /#/admin */
  useEffect(() => {
    const found = grabEmailLinkToken();
    if (found) {
      setPending(found);
      window.history.replaceState(null, "", window.location.pathname + "#/admin");
      try {
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      } catch {
        window.dispatchEvent(new Event("hashchange"));
      }
    }
  }, []);

  /* Is Netlify Identity actually running on this host? */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${GOTRUE}/settings`, { headers: { accept: "application/json" } });
        if (!cancelled) setHasIdentity(res.ok);
      } catch {
        if (!cancelled) setHasIdentity(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => writeTokens(tokens), [tokens]);

  useEffect(() => {
    try {
      if (devEmail) localStorage.setItem(DEV_KEY, devEmail);
      else localStorage.removeItem(DEV_KEY);
    } catch {
      /* ignore */
    }
  }, [devEmail]);

  const value = useMemo<AuthCtx>(() => {
    const email = tokens ? decodeEmail(tokens.access_token) : hasIdentity ? null : devEmail;

    const saveSession = (data: {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    }) => {
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
      });
    };

    return {
      email,
      isAdmin: hasIdentity
        ? !!tokens
        : !!devEmail && DEV_ADMIN_EMAILS.includes(devEmail.toLowerCase()),
      hasIdentity,
      ready,
      pending,
      clearPending: () => setPending(null),

      login: async (e, password) => {
        try {
          const body = new URLSearchParams({
            grant_type: "password",
            username: e.trim(),
            password,
          });
          const res = await fetch(`${GOTRUE}/token`, {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body,
          });
          if (!res.ok) return { ok: false, error: await readError(res, "Wrong email or password.") };
          saveSession(await res.json());
          return { ok: true };
        } catch {
          return { ok: false, error: "Could not reach the server." };
        }
      },

      requestPasswordReset: async (e) => {
        try {
          const res = await fetch(`${GOTRUE}/recover`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: e.trim() }),
          });
          if (!res.ok) return { ok: false, error: await readError(res, "Could not send the email.") };
          return { ok: true };
        } catch {
          return { ok: false, error: "Could not reach the server." };
        }
      },

      setPassword: async (password) => {
        if (!pending) return { ok: false, error: "This link is no longer valid." };
        try {
          // 1. exchange the email token for a session
          const verify = await fetch(`${GOTRUE}/verify`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              type: pending.kind === "invite" ? "signup" : "recovery",
              token: pending.token,
            }),
          });
          if (!verify.ok) {
            return {
              ok: false,
              error: await readError(verify, "This link has expired — please request a new one."),
            };
          }
          const session = await verify.json();

          // 2. set the chosen password on that session
          const upd = await fetch(`${GOTRUE}/user`, {
            method: "PUT",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ password }),
          });
          if (!upd.ok) return { ok: false, error: await readError(upd, "Could not set the password.") };

          saveSession(session);
          setPending(null);
          return { ok: true };
        } catch {
          return { ok: false, error: "Could not reach the server." };
        }
      },

      devLogin: (e, code) => {
        const clean = e.toLowerCase().trim();
        if (!DEV_ADMIN_EMAILS.includes(clean))
          return { ok: false, error: "This email does not have admin access." };
        if (code !== DEV_ADMIN_PASSCODE) return { ok: false, error: "Incorrect passcode." };
        setDevEmail(clean);
        return { ok: true };
      },

      logout: () => {
        setTokens(null);
        setDevEmail(null);
      },

      getToken: async () => {
        if (!tokens) return null;
        if (Date.now() < tokens.expires_at - 60_000) return tokens.access_token;
        if (!tokens.refresh_token) return tokens.access_token;
        try {
          const res = await fetch(`${GOTRUE}/token`, {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: tokens.refresh_token,
            }),
          });
          if (!res.ok) return tokens.access_token;
          const data = await res.json();
          saveSession(data);
          return data.access_token as string;
        } catch {
          return tokens.access_token;
        }
      },
    };
  }, [tokens, devEmail, hasIdentity, ready, pending]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
