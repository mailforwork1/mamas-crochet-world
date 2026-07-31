import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

/**
 * POST /api/upload  (admin only)
 * Body: multipart/form-data with a single "file" field.
 * Returns: { url: "/uploads/<key>" }
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
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
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!isAdmin(context)) return json({ error: "Not authorised." }, 401);

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) return json({ error: "No file provided." }, 400);
  if (!file.type.startsWith("image/")) return json({ error: "Only images are allowed." }, 400);
  if (file.size > 6 * 1024 * 1024) return json({ error: "Image must be under 6 MB." }, 400);

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const store = getStore({ name: "media", consistency: "strong" });
  await store.set(key, await file.arrayBuffer(), {
    metadata: { contentType: file.type, name: file.name },
  });

  return json({ url: `/uploads/${key}` });
};

export const config: Config = {
  path: "/api/upload",
};
