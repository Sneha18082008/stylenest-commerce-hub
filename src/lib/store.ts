import { useEffect, useState } from "react";

export type Category = "Men" | "Women" | "Accessories";
export interface Product { id: string; name: string; category: Category; price: number; stock: number; image: string }
export interface CartItem { id: string; qty: number }

const u = (id: string) => `https://images.unsplash.com/${id}?w=600&q=70&auto=format&fit=crop`;

export const seedProducts = (): Product[] => [
  { id: "p1", name: "Tailored Navy Blazer", category: "Men", price: 149, stock: 12, image: u("photo-1594938298603-c8148c4dae35") },
  { id: "p2", name: "Classic Oxford Shirt", category: "Men", price: 59, stock: 3, image: u("photo-1602810318383-e386cc2a3ccf") },
  { id: "p3", name: "Slim Chino Trousers", category: "Men", price: 69, stock: 20, image: u("photo-1473966968600-fa801b869a1a") },
  { id: "p4", name: "Linen Wrap Dress", category: "Women", price: 119, stock: 8, image: u("photo-1595777457583-95e059d581b8") },
  { id: "p5", name: "Wool Teal Coat", category: "Women", price: 229, stock: 0, image: u("photo-1539533018447-63fcce2678e3") },
  { id: "p6", name: "Silk Blouse", category: "Women", price: 89, stock: 15, image: u("photo-1564257631407-4deb1f99d992") },
  { id: "p7", name: "Leather Tote Bag", category: "Accessories", price: 179, stock: 4, image: u("photo-1584917865442-de89df76afd3") },
  { id: "p8", name: "Minimal Steel Watch", category: "Accessories", price: 199, stock: 10, image: u("photo-1523275335684-37898b6baf30") },
];

function usePersisted<T>(key: string, init: () => T) {
  const [val, setVal] = useState<T>(init);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setVal(JSON.parse(raw)); } catch { /* ignore */ }
    setLoaded(true);
  }, [key]);
  useEffect(() => { if (loaded) localStorage.setItem(key, JSON.stringify(val)); }, [key, val, loaded]);
  return [val, setVal] as const;
}

export function useShop() {
  const [products, setProducts] = usePersisted<Product[]>("stylenest-products", seedProducts);
  const [cart, setCart] = usePersisted<CartItem[]>("stylenest-cart", () => []);

  const inCart = (id: string) => cart.find((c) => c.id === id)?.qty ?? 0;
  const addToCart = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p || inCart(id) >= p.stock) return false;
    setCart((c) => (c.some((i) => i.id === id) ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { id, qty: 1 }]));
    return true;
  };
  const setQty = (id: string, qty: number) => {
    const p = products.find((x) => x.id === id);
    const max = p?.stock ?? 0;
    setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, max) } : i))));
  };
  const checkout = () => {
    setProducts((ps) => ps.map((p) => ({ ...p, stock: Math.max(0, p.stock - (cart.find((c) => c.id === p.id)?.qty ?? 0)) })));
    setCart([]);
  };
  const saveProduct = (p: Product) =>
    setProducts((ps) => (ps.some((x) => x.id === p.id) ? ps.map((x) => (x.id === p.id ? p : x)) : [...ps, p]));
  const deleteProduct = (id: string) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    setCart((c) => c.filter((i) => i.id !== id));
  };
  return { products, cart, inCart, addToCart, setQty, checkout, saveProduct, deleteProduct };
}

export const money = (n: number) => `$${n.toFixed(2)}`;
