import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

/**
 * GET /uploads/<key>  -> serves an uploaded image from Netlify Blobs.
 * Public (product photos need to be visible to shoppers).
 */
export default async (_req: Request, context: Context) => {
  const key = context.params.key;
  if (!key) return new Response("Not found", { status: 404 });

  const store = getStore({ name: "media" });
  const blob = await store.getWithMetadata(key, { type: "arrayBuffer" });

  if (!blob) return new Response("Not found", { status: 404 });

  return new Response(blob.data, {
    headers: {
      "content-type": String(blob.metadata?.contentType ?? "image/jpeg"),
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

export const config: Config = {
  path: "/.netlify/functions/media/:key",
};
