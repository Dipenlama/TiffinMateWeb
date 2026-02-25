"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, updateQty, clearCart, cartTotal } from '../../lib/cart';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    setItems(getCart());
  }, []);

  function refresh() {
    setItems(getCart());
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Your Cart</h1>
            <Link href="/" className="text-orange-600">Continue browsing</Link>
          </div>

          {items.length === 0 && <p className="text-sm">Your cart is empty.</p>}

          {items.length > 0 && (
            <div>
              <ul className="space-y-4">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between border p-3 rounded">
                    <div>
                      <div className="font-semibold">{it.title}</div>
                      <div className="text-sm text-neutral-600">{it.category}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="number" min={1} value={it.qty} onChange={(e) => { updateQty(it.id, Number(e.target.value)); refresh(); }} className="w-16 border px-2 py-1 rounded" />
                      <div className="font-medium">₹{((it.price||0)*it.qty).toFixed(2)}</div>
                      <button onClick={() => { removeFromCart(it.id); refresh(); }} className="text-red-600">Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="bg-neutral-50 p-4 rounded-md">
          <div className="font-medium">Order Summary</div>
          <div className="mt-3 text-sm text-neutral-600">Items: {items.length}</div>
          <div className="mt-4 text-lg font-bold">Total: ₹{cartTotal().toFixed(2)}</div>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={() => { clearCart(); refresh(); }} className="px-3 py-2 border rounded">Clear</button>
            <button onClick={() => router.push('/checkout')} className="px-3 py-2 bg-orange-600 text-white rounded">Proceed to Checkout</button>
          </div>
        </aside>
      </div>
    </div>
  );
}