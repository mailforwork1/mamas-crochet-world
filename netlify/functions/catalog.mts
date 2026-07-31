import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

/**
 * GET  /api/catalog  -> public, returns the saved catalog (or 204 if none yet)
 * PUT  /api/catalog  -> admin only, saves the catalog
 *
 * Auth: Netlify Identity JWT. The user must have the "admin" role,
 * OR their email must be listed in the ADMIN_EMAILS env var.
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

function isAdmin(context: Context) {
  const user = context.clientContext?.user;
  if (!user) return false;

  const roles: string[] = user.app_metadata?.roles ?? [];
  if (roles.includes("admin")) return true;

  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allow.length > 0 && allow.includes(String(user.email).toLowerCase());
}

export default async (req: Request, context: Context) => {
  const store = getStore({ name: "catalog", consistency: "strong" });

  if (req.method === "GET") {
    const data = await store.get("current", { type: "json" });
    if (!data) return new Response(null, { status: 204 });
    return json(data);
  }

  if (req.method === "PUT" || req.method === "POST") {
    if (!isAdmin(context)) {
      return json({ error: "Not authorised. Please sign in as an admin." }, 401);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const payload = {
      ...(body as Record<string, unknown>),
      updatedAt: new Date().toISOString(),
      updatedBy: context.clientContext?.user?.email ?? "unknown",
    };

    await store.setJSON("current", payload);
    return json({ ok: true, updatedAt: payload.updatedAt });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config: Config = {
  path: "/api/catalog",
};
