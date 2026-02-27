'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchMenu } from '../../lib/api';

type MenuItem = { id: string; title: string; description?: string; price?: number; category?: string };

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

export default function MenuPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [category, setCategory] = useState('All Meals');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchMenu()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        if (!list || list.length === 0) {
          // fallback static items
          const staticItems: MenuItem[] = [
            { id: 'pasta', title: 'Creamy Alfredo Pasta', description: 'Rich creamy pasta with garlic and parsley', price: 199, category: 'Lunch' },
            { id: 'casuals', title: 'Casuals Sandwich', description: 'Toasted sandwich with veggies and cheese', price: 129, category: 'Breakfast' },
            { id: 'pasta-spicy', title: 'Spicy Tomato Pasta', description: 'Pasta in tangy tomato sauce', price: 189, category: 'Dinner' },
          ];
          setItems(staticItems);
          setAllItems(staticItems);
        } else {
          setItems(list);
          setAllItems(list);
        }
      })
      .catch(() => {
        if (!mounted) return;
        // on error, show static sample items
        const fallback = [
          { id: 'pasta', title: 'Creamy Alfredo Pasta', description: 'Rich creamy pasta with garlic and parsley', price: 199, category: 'Lunch' },
          { id: 'casuals', title: 'Casuals Sandwich', description: 'Toasted sandwich with veggies and cheese', price: 129, category: 'Breakfast' },
        ];
        setItems(fallback);
        setAllItems(fallback);
      });
    return () => { mounted = false; };
  }, []);

  const categories = ['All Meals', 'Breakfast', 'Lunch', 'Dinner'];

  const visible = useMemo(() => {
    const base = category === 'All Meals' ? allItems : allItems.filter((it) => it.category === category);
    if (!search.trim()) return base;
    const q = search.trim().toLowerCase();
    return base.filter((it) =>
      (it.title || '').toLowerCase().includes(q) ||
      (it.description || '').toLowerCase().includes(q) ||
      (it.category || '').toLowerCase().includes(q)
    );
  }, [allItems, category, search]);

  function quickBook(it: MenuItem) {
    const price = Number(it.price || 99) || 99;
    const booking = {
      items: [{ id: it.id, name: it.title, qty: 1, price, subtotal: price }],
      total: price,
      day: 'Mon',
      time: 'Lunch',
      frequency: 'once',
      draftId: `draft-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      createdAt: new Date().toISOString(),
      source: 'quick-book',
    } as any;
    try {
      sessionStorage.setItem('bookingDraft', JSON.stringify(booking));
      router.push('/packages/confirm');
    } catch (e) {
      console.error(e);
      alert('Could not prepare booking draft');
    }
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="relative overflow-hidden rounded-2xl bg-orange-500 text-white px-6 py-8 shadow-lg">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_30%),radial-gradient(circle_at_80%_0%,white_0,transparent_25%)]" aria-hidden />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.18em] text-xs font-semibold text-white/80">Chef-crafted</p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-sm">Browse Our Menu</h1>
              <p className="mt-3 text-lg text-white/90 max-w-2xl">Home-style meals delivered with restaurant polish. Pick a day, pick a time, and we will handle the rest.</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/80">
                <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Zero prep</span>
                <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Freshly cooked</span>
                <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Delivery slots every hour</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-sm text-white/90 bg-white/10 px-3 py-2 rounded-lg border border-white/20 shadow-sm">Free delivery on orders above ₹299</div>
              <Link href="/cart" className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg shadow-lg hover:-translate-y-0.5 transition transform">View Cart</Link>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-8 mb-6">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex-1">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Search menu</label>
              <div className="mt-1 flex items-center gap-2 bg-white border border-neutral-200 shadow-sm rounded-xl px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-500"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="1.5"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input
                  aria-label="Search menu"
                  placeholder="Pasta, thali, sandwich…"
                  className="w-full bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex gap-2 bg-white p-2 rounded-full shadow-sm border border-neutral-100">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition ${category === c ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="min-h-[40vh]">
          {visible.length === 0 ? (
            <div className="text-center text-neutral-600 bg-white border border-dashed border-neutral-200 rounded-2xl py-12">No items match your filters</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((it) => (
                <article key={it.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition overflow-hidden">
                  <div className="h-48 bg-neutral-100 overflow-hidden relative">
                    <img
                      src={`/assets/images/${(it.id||'placeholder').toString().split('-')[0]}.jpg`}
                      onError={(e)=>{(e.currentTarget as HTMLImageElement).src=FALLBACK_IMG;}}
                      alt={it.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/85 backdrop-blur text-xs px-3 py-1 rounded-full border border-neutral-200">{it.category || 'Featured'}</div>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-neutral-900 leading-snug">{it.title}</h3>
                        <p className="text-sm text-neutral-600 line-clamp-2">{it.description || 'Freshly prepared meal crafted by our chefs.'}</p>
                      </div>
                      <div className="text-right ml-2 flex flex-col items-end">
                        <div className="text-xl font-bold text-orange-600">₹{(it.price||0).toFixed(2)}</div>
                        <div className="text-[11px] text-emerald-600 font-semibold mt-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">In stock</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex gap-2">
                        <Link href={`/menu/${it.id}`} className="px-3 py-2 border border-neutral-200 rounded-md text-sm text-neutral-800 hover:bg-neutral-50">View</Link>
                        <button onClick={() => quickBook(it)} className="px-3 py-2 bg-orange-600 text-white rounded-md text-sm shadow-sm hover:-translate-y-0.5 transition">Quick Book</button>
                      </div>
                      <div className="text-[11px] text-neutral-500">ID: {it.id}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Floating cart CTA for better visibility */}
        <Link href="/cart" className="fixed right-6 bottom-6 md:right-10 md:bottom-10 px-4 py-3 bg-neutral-900 text-white rounded-full shadow-xl hidden md:flex items-center gap-3 hover:-translate-y-0.5 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h15l-1.5 9h-12L4 2H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          View Cart
        </Link>
      </div>
    </main>
  );
}