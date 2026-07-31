import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { requireAdmin } from "./_auth.mts";

/**
 * POST /api/upload  (admin only)
 * Body: multipart/form-data with one or more "file" fields.
 * Returns: { urls: ["/uploads/<key>", ...] }
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const auth = await requireAdmin(req);
  if (!auth.ok) return json({ error: auth.error }, 401);

  const form = await req.formData();
  const files = form.getAll("file").filter((f): f is File => f instanceof File);

  if (files.length === 0) return json({ error: "No file provided." }, 400);

  const store = getStore({ name: "media", consistency: "strong" });
  const urls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) return json({ error: `"${file.name}" is not an image.` }, 400);
    if (file.size > 6 * 1024 * 1024) return json({ error: `"${file.name}" is larger than 6 MB.` }, 400);

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const key = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    await store.set(key, await file.arrayBuffer(), {
      metadata: { contentType: file.type, name: file.name },
    });
    urls.push(`/uploads/${key}`);
  }

  return json({ urls, url: urls[0] });
};

export const config: Config = {
  path: "/api/upload",
};
