/**
 * Shared admin check.
 *
 * We verify the Netlify Identity token by asking Identity who it belongs to.
 * (context.clientContext is not reliably populated for v2 functions, so we
 * do the lookup ourselves.)
 */
export type AdminCheck = { ok: true; email: string } | { ok: false; error: string };

export async function requireAdmin(req: Request): Promise<AdminCheck> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();

  if (!token) return { ok: false, error: "Please sign in again." };

  const base =
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    new URL(req.url).origin;

  let email = "";
  try {
    const res = await fetch(`${base}/.netlify/identity/user`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { ok: false, error: "Your session has expired — please sign in again." };
    const user = (await res.json()) as {
      email?: string;
      app_metadata?: { roles?: string[] };
    };
    email = String(user.email ?? "").toLowerCase();

    // A user with the "admin" role is always allowed.
    if (user.app_metadata?.roles?.includes("admin")) return { ok: true, email };
  } catch {
    return { ok: false, error: "Could not verify your sign-in." };
  }

  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // No allow-list configured: any signed-in Identity user may edit.
  if (allow.length === 0) return { ok: true, email };

  if (!allow.includes(email)) {
    return { ok: false, error: `${email} is not an admin on this shop.` };
  }

  return { ok: true, email };
}
