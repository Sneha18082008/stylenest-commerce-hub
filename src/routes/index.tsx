import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingBag, X, Minus, Plus, Pencil, Trash2, Package, Boxes, DollarSign, AlertTriangle, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import hero from "@/assets/hero.jpg";
import { useShop, money, type Product, type Category } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StyleNest — Modern Fashion Store" },
      { name: "description", content: "Shop curated men's, women's and accessories at StyleNest, with a built-in inventory manager." },
      { property: "og:title", content: "StyleNest — Modern Fashion Store" },
      { property: "og:description", content: "Curated modern fashion for men and women, plus timeless accessories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

const CATS = ["All", "Men", "Women", "Accessories"] as const;

function App() {
  const shop = useShop();
  const [tab, setTab] = useState<"store" | "inventory">("store");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const count = shop.cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
          <div className="font-display text-xl font-bold text-navy">Style<span className="text-primary">Nest</span></div>
          <nav className="flex rounded-full bg-secondary p-1 text-sm font-semibold">
            {(["store", "inventory"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 capitalize transition-all ${tab === t ? "bg-navy text-navy-foreground shadow-card" : "text-muted-foreground hover:text-navy"}`}>
                {t}
              </button>
            ))}
          </nav>
          <div className="order-last flex w-full items-center gap-2 rounded-full border bg-background px-4 py-2 sm:order-none sm:ml-auto sm:w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <button onClick={() => setCartOpen(true)} aria-label="Open cart"
            className="relative ml-auto rounded-full p-2.5 text-navy transition hover:bg-accent sm:ml-0">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">{count}</span>}
          </button>
        </div>
      </header>

      {tab === "store" ? <Store shop={shop} search={search} /> : <Inventory shop={shop} search={search} />}

      <CartDrawer shop={shop} open={cartOpen} onClose={() => setCartOpen(false)} />
      <footer className="mt-16 bg-navy py-8 text-center text-sm text-navy-foreground/70">© 2026 StyleNest. Crafted with care.</footer>
    </div>
  );
}

type Shop = ReturnType<typeof useShop>;

function Store({ shop, search }: { shop: Shop; search: string }) {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const list = shop.products.filter((p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={hero} alt="StyleNest models in navy and teal" width={1600} height={912} className="h-[440px] w-full object-cover object-right sm:h-[520px]" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">New Season 2026</p>
          <h1 className="max-w-lg text-4xl font-bold leading-tight text-navy-foreground sm:text-6xl">Dress with quiet confidence.</h1>
          <p className="mt-4 max-w-md text-navy-foreground/80">Timeless essentials in deep navy and ocean teal, tailored for everyday elegance.</p>
          <button onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 w-fit rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lift">
            Shop Now
          </button>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-navy">The Collection</h2>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${cat === c ? "border-navy bg-navy text-navy-foreground" : "bg-card hover:border-primary hover:text-primary"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {list.length === 0 ? <p className="py-16 text-center text-muted-foreground">No products found.</p> : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => {
              const out = p.stock === 0;
              const maxed = shop.inCart(p.id) >= p.stock;
              return (
                <article key={p.id} className="group overflow-hidden rounded-2xl bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img src={p.image} alt={p.name} loading="lazy" className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${out ? "opacity-50 grayscale" : ""}`} />
                    <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-navy">{p.category}</span>
                    {out && <span className="absolute right-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">Sold out</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-navy">{p.name}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{money(p.price)}</span>
                      {!out && p.stock < 5 && <span className="text-xs font-medium text-destructive">Only {p.stock} left</span>}
                    </div>
                    <button disabled={out || maxed}
                      onClick={() => shop.addToCart(p.id) && toast.success(`${p.name} added to cart`)}
                      className="mt-4 w-full rounded-xl bg-navy py-2.5 text-sm font-semibold text-navy-foreground transition hover:bg-primary disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground">
                      {out ? "Out of Stock" : maxed ? "Max in cart" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function CartDrawer({ shop, open, onClose }: { shop: Shop; open: boolean; onClose: () => void }) {
  const items = shop.cart.map((c) => ({ ...c, p: shop.products.find((p) => p.id === c.id)! })).filter((i) => i.p);
  const total = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-40 bg-navy/50 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-lift transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-bold text-navy">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="rounded-full p-2 transition hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {items.length === 0 && <p className="py-20 text-center text-muted-foreground">Your cart is empty.</p>}
          {items.map(({ p, qty }) => (
            <div key={p.id} className="flex gap-4 rounded-xl border p-3">
              <img src={p.image} alt={p.name} className="h-20 w-16 rounded-lg object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <span className="text-sm font-semibold text-navy">{p.name}</span>
                  <button onClick={() => shop.setQty(p.id, 0)} aria-label="Remove" className="text-muted-foreground transition hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                <span className="text-sm text-primary">{money(p.price)}</span>
                <div className="mt-auto flex items-center gap-2">
                  <button onClick={() => shop.setQty(p.id, qty - 1)} className="rounded-md border p-1 transition hover:bg-accent"><Minus className="h-3 w-3" /></button>
                  <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                  <button disabled={qty >= p.stock} onClick={() => shop.setQty(p.id, qty + 1)} className="rounded-md border p-1 transition hover:bg-accent disabled:opacity-40"><Plus className="h-3 w-3" /></button>
                  <span className="ml-auto text-sm font-bold">{money(p.price * qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-5">
          <div className="mb-4 flex justify-between text-lg font-bold text-navy"><span>Total</span><span>{money(total)}</span></div>
          <button disabled={!items.length} onClick={() => { shop.checkout(); onClose(); toast.success("Order placed! Thank you for shopping with StyleNest."); }}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:shadow-lift disabled:opacity-50">
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}

function Inventory({ shop, search }: { shop: Shop; search: string }) {
  const [editing, setEditing] = useState<Product | null | "new">(null);
  const list = shop.products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const stats = useMemo(() => ({
    total: shop.products.length,
    units: shop.products.reduce((s, p) => s + p.stock, 0),
    value: shop.products.reduce((s, p) => s + p.stock * p.price, 0),
    low: shop.products.filter((p) => p.stock < 5).length,
  }), [shop.products]);
  const cards = [
    { label: "Total Products", value: stats.total, icon: Package },
    { label: "Units in Stock", value: stats.units, icon: Boxes },
    { label: "Inventory Value", value: money(stats.value), icon: DollarSign },
    { label: "Low Stock Items", value: stats.low, icon: AlertTriangle, danger: true },
  ];
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Inventory</h1>
          <p className="text-muted-foreground">Manage products and stock levels.</p>
        </div>
        <button onClick={() => setEditing("new")} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lift">
          <PlusCircle className="h-4 w-4" /> Add Product
        </button>
      </div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, danger }) => (
          <div key={label} className="rounded-2xl bg-card p-5 shadow-card transition hover:shadow-lift">
            <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${danger ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground"}`}><Icon className="h-5 w-5" /></div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-navy">{value}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-card shadow-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-navy text-left text-navy-foreground">
            <tr>{["Product", "Category", "Price", "Stock", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t transition hover:bg-muted/60">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" /><span className="font-semibold text-navy">{p.name}</span></div></td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 font-medium">{money(p.price)}</td>
                <td className={`px-4 py-3 font-bold ${p.stock < 5 ? "text-destructive" : ""}`}>{p.stock}</td>
                <td className="px-4 py-3">
                  {p.stock === 0 ? <span className="rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">Out of Stock</span>
                    : p.stock < 5 ? <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">Low Stock</span>
                    : <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">In Stock</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setEditing(p)} aria-label="Edit" className="rounded-lg p-2 text-navy transition hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm(`Delete ${p.name}?`)) { shop.deleteProduct(p.id); toast("Product deleted"); } }} aria-label="Delete" className="rounded-lg p-2 text-destructive transition hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <ProductForm initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={(p) => { shop.saveProduct(p); setEditing(null); toast.success("Product saved"); }} />}
    </main>
  );
}

function ProductForm({ initial, onClose, onSave }: { initial: Product | null; onClose: () => void; onSave: (p: Product) => void }) {
  const [f, setF] = useState({ name: initial?.name ?? "", category: initial?.category ?? ("Men" as Category), price: String(initial?.price ?? ""), stock: String(initial?.stock ?? ""), image: initial?.image ?? "" });
  const field = "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(f.price), stock = parseInt(f.stock, 10);
    if (!f.name.trim() || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) { toast.error("Please fill all fields with valid values"); return; }
    onSave({ id: initial?.id ?? `p${Date.now()}`, name: f.name.trim(), category: f.category, price, stock, image: f.image.trim() || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=70&auto=format&fit=crop" });
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-2xl bg-card p-6 shadow-lift animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy">{initial ? "Edit Product" : "Add Product"}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <label className="block text-sm font-medium">Name<input className={`${field} mt-1`} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="block text-sm font-medium">Category
          <select className={`${field} mt-1`} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>
            <option>Men</option><option>Women</option><option>Accessories</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">Price ($)<input type="number" step="0.01" min="0" className={`${field} mt-1`} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></label>
          <label className="block text-sm font-medium">Stock<input type="number" min="0" className={`${field} mt-1`} value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value })} /></label>
        </div>
        <label className="block text-sm font-medium">Image URL<input className={`${field} mt-1`} value={f.image} placeholder="https://..." onChange={(e) => setF({ ...f, image: e.target.value })} /></label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-muted">Cancel</button>
          <button className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:shadow-lift">Save</button>
        </div>
      </form>
    </div>
  );
}
