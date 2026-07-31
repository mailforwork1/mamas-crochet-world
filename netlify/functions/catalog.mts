import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { requireAdmin } from "./_auth.mts";

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

export default async (req: Request) => {
  const store = getStore({ name: "catalog", consistency: "strong" });

  if (req.method === "GET") {
    const data = await store.get("current", { type: "json" });
    if (!data) return new Response(null, { status: 204 });
    return json(data);
  }

  if (req.method === "PUT" || req.method === "POST") {
    const auth = await requireAdmin(req);
    if (!auth.ok) return json({ error: auth.error }, 401);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const payload = {
      ...(body as Record<string, unknown>),
      updatedAt: new Date().toISOString(),
      updatedBy: auth.email,
    };

    await store.setJSON("current", payload);
    return json({ ok: true, updatedAt: payload.updatedAt });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config: Config = {
  path: "/api/catalog",
};
