import { useMemo, useRef, useState } from "react";
import { useAuth } from "../auth";
import { useCatalog, type Catalog } from "../catalog";
import { useRouter } from "../router";
import { formatPrice } from "../utils/cn";
import type { ProductDetail } from "../data";

/* =================== LOGIN =================== */
function Login() {
  const { openLogin, devLogin, hasIdentity, ready } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = devLogin(email, code);
    if (!r.ok) setErr(r.error ?? "Could not sign in.");
  };

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <div className="rounded-[28px] bg-white/80 p-8 ring-1 ring-[#e8b4ad]/30 shadow-[0_20px_60px_-30px_rgba(184,113,104,0.35)]">
        <p className="text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">Private</p>
        <h1 className="font-serif mt-3 text-3xl text-[#4a3f3a]">Admin Sign In</h1>

        {!ready ? (
          <p className="mt-6 text-sm text-[#4a3f3a]/60">Loading…</p>
        ) : hasIdentity ? (
          <>
            <p className="mt-2 text-sm text-[#4a3f3a]/65">
              Sign in with your shop email to manage products, prices and photos.
            </p>
            <button
              onClick={openLogin}
              className="mt-7 w-full rounded-full bg-[#4a3f3a] py-3.5 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
            >
              Sign in with email
            </button>
            <p className="mt-3 text-center text-[0.65rem] leading-relaxed text-[#4a3f3a]/50">
              Forgot your password? Choose “Forgot password” in the sign-in window.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-[#4a3f3a]/65">
              Local preview mode — sign in with your development passcode.
            </p>
            <form onSubmit={submit} className="mt-7 grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[#4a3f3a]/60">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  placeholder="you@example.com"
                  required
                  className="rounded-xl bg-white px-4 py-3 text-sm text-[#4a3f3a] ring-1 ring-[#e8b4ad]/40 outline-none focus:ring-[#b87168]"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[#4a3f3a]/60">Passcode</span>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setErr(""); }}
                  placeholder="••••••••"
                  required
                  className="rounded-xl bg-white px-4 py-3 text-sm text-[#4a3f3a] ring-1 ring-[#e8b4ad]/40 outline-none focus:ring-[#b87168]"
                />
              </label>
              {err && <p className="text-sm text-[#b87168]">{err}</p>}
              <button
                type="submit"
                className="mt-2 rounded-full bg-[#4a3f3a] py-3.5 text-xs font-medium tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
              >
                Sign In
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          className="mt-6 w-full text-[0.7rem] tracking-[0.18em] uppercase text-[#4a3f3a]/50 hover:text-[#b87168]"
        >
          ← Back to shop
        </button>
      </div>
    </section>
  );
}

/* =================== SHARED BITS =================== */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.62rem] tracking-[0.2em] uppercase text-[#4a3f3a]/55">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "rounded-xl bg-white px-3.5 py-2.5 text-sm text-[#4a3f3a] ring-1 ring-[#e8b4ad]/40 outline-none focus:ring-[#b87168] w-full";

/* Image picker: file upload (stored as data URL) or a path/URL */
function ImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { uploadImage } = useCatalog();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (f: File) => {
    setBusy(true);
    setErr("");
    try {
      onChange(await uploadImage(f));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f6ede0]/60 ring-1 ring-[#e8b4ad]/30">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#4a3f3a]/30 text-xs">No image</div>
        )}
      </div>
      <div className="min-w-0 flex-1 grid gap-2">
        <input
          value={value.startsWith("data:") ? "(uploaded image)" : value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={value.startsWith("data:")}
          placeholder="/images/your-photo.jpg  or  https://…"
          className={inputCls}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full bg-[#4a3f3a] px-4 py-1.5 text-[0.6rem] tracking-[0.18em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
          >
              {busy ? "Uploading…" : "Upload photo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-full px-3 py-1.5 text-[0.6rem] tracking-[0.18em] uppercase text-[#4a3f3a]/55 hover:text-[#b87168]"
            >
              Clear
            </button>
          )}
        </div>
        {err && <p className="text-[0.65rem] text-[#b87168]">{err}</p>}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
        />
      </div>
    </div>
  );
}

/* =================== PRODUCT EDITOR =================== */
function ProductEditor({
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  draft: ProductDetail;
  onChange: (p: ProductDetail) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { categories, products } = useCatalog();
  const set = (k: keyof ProductDetail, v: unknown) => onChange({ ...draft, [k]: v });

  const subOptions = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .filter((p) => p.categorySlug === draft.categorySlug && p.subcategory)
            .map((p) => p.subcategory!)
        )
      ),
    [products, draft.categorySlug]
  );

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#3c352e]/45 backdrop-blur-sm p-4 md:p-8">
      <div className="mx-auto max-w-2xl rounded-[28px] bg-[#fdfaf4] p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-[#4a3f3a]">
            {products.some((p) => p.id === draft.id) ? "Edit product" : "New product"}
          </h3>
          <button onClick={onCancel} className="text-[#4a3f3a]/50 hover:text-[#b87168]">✕</button>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="Photo">
            <ImagePicker value={draft.image} onChange={(v) => set("image", v)} />
          </Field>

          <Field label="Product name">
            <input value={draft.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price (Rs)">
              <input
                type="number"
                min={0}
                value={draft.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Badge">
              <select
                value={draft.badge ?? ""}
                onChange={(e) => set("badge", e.target.value || undefined)}
                className={inputCls}
              >
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Limited">Limited</option>
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select
                value={draft.categorySlug}
                onChange={(e) => {
                  const c = categories.find((x) => x.slug === e.target.value)!;
                  onChange({ ...draft, categorySlug: c.slug, category: c.name });
                }}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Sub-category">
              <input
                list="sub-options"
                value={draft.subcategory ?? ""}
                onChange={(e) => set("subcategory", e.target.value)}
                placeholder="e.g. Cartoon & Anime Characters"
                className={inputCls}
              />
              <datalist id="sub-options">
                {subOptions.map((s) => <option key={s} value={s} />)}
              </datalist>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={3}
              value={draft.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Materials">
              <input value={draft.materials ?? ""} onChange={(e) => set("materials", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Dimensions">
              <input value={draft.dimensions ?? ""} onChange={(e) => set("dimensions", e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onSave}
            disabled={!draft.name.trim()}
            className="flex-1 rounded-full bg-[#4a3f3a] py-3 text-xs tracking-[0.22em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition disabled:opacity-40"
          >
            Save product
          </button>
          <button
            onClick={onCancel}
            className="rounded-full px-6 py-3 text-xs tracking-[0.22em] uppercase text-[#4a3f3a]/60 ring-1 ring-[#e8b4ad]/40 hover:text-[#b87168]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== TABS =================== */
function ProductsTab() {
  const { products, categories, saveProduct, deleteProduct } = useCatalog();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [draft, setDraft] = useState<ProductDetail | null>(null);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (cat === "all" || p.categorySlug === cat) &&
        (!term || p.name.toLowerCase().includes(term))
    );
  }, [products, q, cat]);

  const blank = (): ProductDetail => ({
    id: "new-" + Date.now().toString(36),
    name: "",
    price: 500,
    image: "",
    category: categories[0]?.name ?? "",
    categorySlug: categories[0]?.slug ?? "",
    subcategory: "",
    rating: 5,
    reviews: 12,
    description: "",
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className={inputCls + " max-w-xs"}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={inputCls + " max-w-[220px]"}>
          <option value="all">All categories ({products.length})</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => setDraft(blank())}
          className="ml-auto rounded-full bg-[#4a3f3a] px-5 py-2.5 text-xs tracking-[0.2em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
        >
          + Add product
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-[#e8b4ad]/30 bg-white/60">
        {list.length === 0 && (
          <p className="p-8 text-center text-sm text-[#4a3f3a]/55">No products found.</p>
        )}
        {list.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border-b border-[#f3d9d4]/50 p-3 last:border-0 hover:bg-[#f3d9d4]/15"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f6ede0]/60">
              {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#4a3f3a]">{p.name}</p>
              <p className="truncate text-[0.68rem] text-[#4a3f3a]/55">
                {p.category}
                {p.subcategory ? ` · ${p.subcategory}` : ""}
                {p.badge ? ` · ${p.badge}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-sm text-[#b87168]">{formatPrice(p.price)}</span>
            <button
              onClick={() => setDraft({ ...p })}
              className="shrink-0 rounded-full px-3 py-1.5 text-[0.6rem] tracking-[0.16em] uppercase text-[#4a3f3a]/70 ring-1 ring-[#e8b4ad]/40 hover:text-[#b87168]"
            >
              Edit
            </button>
            <button
              onClick={() => confirm(`Delete "${p.name}"?`) && deleteProduct(p.id)}
              className="shrink-0 rounded-full px-3 py-1.5 text-[0.6rem] tracking-[0.16em] uppercase text-[#4a3f3a]/40 hover:text-[#b87168]"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {draft && (
        <ProductEditor
          draft={draft}
          onChange={setDraft}
          onSave={() => { saveProduct(draft); setDraft(null); }}
          onCancel={() => setDraft(null)}
        />
      )}
    </>
  );
}

function CategoriesTab() {
  const { categories, saveCategory, productsByCategory, productsBySubcategory, setSubImage } =
    useCatalog();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      {categories.map((c) => {
        const expanded = open === c.slug;
        const subs = productsBySubcategory(c.slug);
        return (
          <div key={c.slug} className="rounded-2xl bg-white/60 ring-1 ring-[#e8b4ad]/30 overflow-hidden">
            <div className="flex items-center gap-4 p-3">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f6ede0]/60">
                {c.image && <img src={c.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#4a3f3a]">{c.name}</p>
                <p className="text-[0.68rem] text-[#4a3f3a]/55">
                  {productsByCategory(c.slug).length} products · {subs.length} sub-categories
                </p>
              </div>
              <button
                onClick={() => setOpen(expanded ? null : c.slug)}
                className="rounded-full px-4 py-1.5 text-[0.6rem] tracking-[0.16em] uppercase text-[#4a3f3a]/70 ring-1 ring-[#e8b4ad]/40 hover:text-[#b87168]"
              >
                {expanded ? "Close" : "Edit"}
              </button>
            </div>

            {expanded && (
              <div className="border-t border-[#f3d9d4]/50 p-5 grid gap-4">
                <Field label="Category cover image">
                  <ImagePicker
                    value={c.image}
                    onChange={(v) => saveCategory({ ...c, image: v })}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name">
                    <input
                      value={c.name}
                      onChange={(e) => saveCategory({ ...c, name: e.target.value, short: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Tagline">
                    <input
                      value={c.tagline}
                      onChange={(e) => saveCategory({ ...c, tagline: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                </div>

                {subs.length > 0 && (
                  <div>
                    <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#4a3f3a]/55 mb-3">
                      Sub-category images
                    </p>
                    <div className="grid gap-4">
                      {subs.map((s) => (
                        <div key={s.name}>
                          <p className="text-xs text-[#4a3f3a]/75 mb-1.5">
                            {s.name} <span className="text-[#4a3f3a]/40">({s.items.length})</span>
                          </p>
                          <ImagePicker
                            value={s.image}
                            onChange={(v) => setSubImage(s.name, v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings, catalog, importCatalog, resetAll } = useCatalog();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mamas-crochet-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = (f: File) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        importCatalog(JSON.parse(String(r.result)) as Catalog);
        setMsg("✓ Catalog imported successfully.");
      } catch {
        setMsg("✕ That file could not be read.");
      }
      setTimeout(() => setMsg(""), 4000);
    };
    r.readAsText(f);
  };

  return (
    <div className="grid gap-6 max-w-xl">
      <Field label="Instagram handle (without @)">
        <input
          value={settings.igHandle}
          onChange={(e) => updateSettings({ igHandle: e.target.value.replace(/^@/, "") })}
          className={inputCls}
        />
      </Field>

      <Field label="Free wrapping over (Rs)">
        <input
          type="number"
          value={settings.freeWrapOver}
          onChange={(e) => updateSettings({ freeWrapOver: Number(e.target.value) })}
          className={inputCls}
        />
      </Field>

      <Field label="Top announcement bar">
        <input
          value={settings.announcement}
          onChange={(e) => updateSettings({ announcement: e.target.value })}
          className={inputCls}
        />
      </Field>

      <div className="rounded-2xl bg-white/60 p-5 ring-1 ring-[#e8b4ad]/30">
        <p className="font-serif text-lg text-[#4a3f3a]">Backup & restore</p>
        <p className="mt-1.5 text-xs leading-relaxed text-[#4a3f3a]/60">
          Your changes are saved in this browser. Download a backup file to keep them safe,
          or to move them to another device.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={exportJson}
            className="rounded-full bg-[#4a3f3a] px-5 py-2.5 text-[0.6rem] tracking-[0.18em] uppercase text-[#fdfaf4] hover:bg-[#b87168] transition"
          >
            ↓ Download backup
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-full px-5 py-2.5 text-[0.6rem] tracking-[0.18em] uppercase text-[#4a3f3a]/70 ring-1 ring-[#e8b4ad]/40 hover:text-[#b87168]"
          >
            ↑ Restore backup
          </button>
          <button
            onClick={() =>
              confirm("Discard ALL your changes and go back to the original catalog?") && resetAll()
            }
            className="rounded-full px-5 py-2.5 text-[0.6rem] tracking-[0.18em] uppercase text-[#4a3f3a]/40 hover:text-[#b87168]"
          >
            Reset everything
          </button>
        </div>
        {msg && <p className="mt-3 text-xs text-[#b87168]">{msg}</p>}
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
        />
      </div>
    </div>
  );
}

/* =================== SHELL =================== */
export default function AdminPage() {
  const { isAdmin, email, logout, hasIdentity } = useAuth();
  const { navigate } = useRouter();
  const {
    products, categories, isDirty,
    publish, publishing, lastPublished, publishError,
  } = useCatalog();
  const [tab, setTab] = useState<"products" | "categories" | "settings">("products");
  const [done, setDone] = useState(false);

  if (!isAdmin) return <Login />;

  const doPublish = async () => {
    const ok = await publish();
    if (ok) {
      setDone(true);
      setTimeout(() => setDone(false), 4000);
    }
  };

  const tabs = [
    { id: "products", label: `Products (${products.length})` },
    { id: "categories", label: `Categories (${categories.length})` },
    { id: "settings", label: "Settings" },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] tracking-[0.32em] uppercase text-[#b87168]">Admin Panel</p>
          <h1 className="font-serif mt-2 text-4xl text-[#4a3f3a]">Manage your shop</h1>
          <p className="mt-1.5 text-xs text-[#4a3f3a]/55">
            Signed in as {email}
            {lastPublished && (
              <span className="ml-2">
                · last published {new Date(lastPublished).toLocaleString("en-PK")}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasIdentity && (
            <button
              onClick={doPublish}
              disabled={publishing || (!isDirty && !done)}
              className={`rounded-full px-6 py-2.5 text-[0.62rem] font-medium tracking-[0.2em] uppercase transition disabled:opacity-40 ${
                done
                  ? "bg-[#7d9b76] text-white"
                  : isDirty
                  ? "bg-[#b87168] text-white hover:bg-[#4a3f3a] animate-pulse"
                  : "bg-[#4a3f3a] text-[#fdfaf4]"
              }`}
            >
              {publishing ? "Publishing…" : done ? "✓ Live on your site" : isDirty ? "● Publish changes" : "Published"}
            </button>
          )}
          <button
            onClick={() => navigate({ name: "home" })}
            className="rounded-full px-5 py-2.5 text-[0.6rem] tracking-[0.18em] uppercase text-[#4a3f3a]/70 ring-1 ring-[#e8b4ad]/40 hover:text-[#b87168]"
          >
            View shop
          </button>
          <button
            onClick={logout}
            className="rounded-full px-5 py-2.5 text-[0.6rem] tracking-[0.18em] uppercase text-[#4a3f3a]/70 ring-1 ring-[#e8b4ad]/40 hover:text-[#b87168]"
          >
            Sign out
          </button>
        </div>
      </div>

      {publishError && (
        <p className="mt-4 rounded-xl bg-[#f3d9d4]/50 px-4 py-3 text-sm text-[#b87168]">
          {publishError}
        </p>
      )}
      {!hasIdentity && (
        <p className="mt-4 rounded-xl bg-[#f3d9d4]/40 px-4 py-3 text-xs leading-relaxed text-[#4a3f3a]/70">
          <strong>Preview mode.</strong> Changes are saved in this browser only.
          Deploy to Netlify and enable Identity to publish changes live for your customers.
        </p>
      )}
      {isDirty && hasIdentity && (
        <p className="mt-4 rounded-xl bg-[#f3d9d4]/40 px-4 py-3 text-xs text-[#4a3f3a]/70">
          You have unpublished changes — press <strong>Publish changes</strong> when you're ready
          for customers to see them.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2 border-b border-[#e8b4ad]/30 pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-5 py-2.5 text-[0.62rem] tracking-[0.2em] uppercase transition ${
              tab === t.id
                ? "bg-[#4a3f3a] text-[#fdfaf4]"
                : "text-[#4a3f3a]/65 ring-1 ring-[#e8b4ad]/40 hover:text-[#b87168]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "products" && <ProductsTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
