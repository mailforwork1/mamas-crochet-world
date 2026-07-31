import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { requireAdmin } from "./_auth.mts";

/**
 * POST  /api/orders            -> public, a shopper places an order
 * GET   /api/orders            -> admin only, list all orders
 * PATCH /api/orders            -> admin only, { id, status } or { id, delete: true }
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

type Line = { id: string; name: string; price: number; qty: number };

type Order = {
  id: string;
  ref: string;
  createdAt: string;
  status: "new" | "confirmed" | "shipped" | "completed" | "cancelled";
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: Line[];
  subtotal: number;
  delivery: number;
  total: number;
};

const clean = (v: unknown, max = 300) =>
  String(v ?? "").trim().slice(0, max);

export default async (req: Request) => {
  const store = getStore({ name: "orders", consistency: "strong" });

  /* ---------- shopper places an order ---------- */
  if (req.method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return json({ error: "Invalid request." }, 400);
    }

    const c = (body.customer ?? {}) as Record<string, unknown>;
    const name = clean(c.name, 120);
    const phone = clean(c.phone, 40);
    const address = clean(c.address, 500);
    const city = clean(c.city, 120);

    if (!name || !phone || !address || !city) {
      return json({ error: "Please fill in your name, phone, address and city." }, 400);
    }

    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) return json({ error: "Your basket is empty." }, 400);

    const items: Line[] = rawItems.slice(0, 100).map((i) => {
      const it = i as Record<string, unknown>;
      return {
        id: clean(it.id, 80),
        name: clean(it.name, 200),
        price: Number(it.price) || 0,
        qty: Math.max(1, Math.min(99, Number(it.qty) || 1)),
      };
    });

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = Number(body.delivery) || 0;

    const now = new Date();
    const id = `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const ref =
      "MCW-" +
      now.getFullYear().toString().slice(2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    const order: Order = {
      id,
      ref,
      createdAt: now.toISOString(),
      status: "new",
      customer: {
        name,
        phone,
        email: clean(c.email, 160) || undefined,
        address,
        city,
        notes: clean(c.notes, 800) || undefined,
      },
      items,
      subtotal,
      delivery,
      total: subtotal + delivery,
    };

    await store.setJSON(`order-${id}`, order);
    return json({ ok: true, ref, id });
  }

  /* ---------- admin: list ---------- */
  if (req.method === "GET") {
    const auth = await requireAdmin(req);
    if (!auth.ok) return json({ error: auth.error }, 401);

    const { blobs } = await store.list({ prefix: "order-" });
    const orders = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: "json" }) as Promise<Order>)
    );

    orders.sort((a, b) => (a?.createdAt < b?.createdAt ? 1 : -1));
    return json({ orders: orders.filter(Boolean) });
  }

  /* ---------- admin: update / delete ---------- */
  if (req.method === "PATCH") {
    const auth = await requireAdmin(req);
    if (!auth.ok) return json({ error: auth.error }, 401);

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return json({ error: "Invalid request." }, 400);
    }

    const id = clean(body.id, 80);
    if (!id) return json({ error: "Missing order id." }, 400);

    if (body.delete === true) {
      await store.delete(`order-${id}`);
      return json({ ok: true });
    }

    const existing = (await store.get(`order-${id}`, { type: "json" })) as Order | null;
    if (!existing) return json({ error: "Order not found." }, 404);

    const status = clean(body.status, 20) as Order["status"];
    const allowed = ["new", "confirmed", "shipped", "completed", "cancelled"];
    if (!allowed.includes(status)) return json({ error: "Unknown status." }, 400);

    existing.status = status;
    await store.setJSON(`order-${id}`, existing);
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config: Config = {
  path: "/api/orders",
};
