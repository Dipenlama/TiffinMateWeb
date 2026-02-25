'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchMenu } from '../../lib/api';

type MenuItem = { id: string; title: string; description?: string; price?: number; category?: string };

export default function MenuPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [category, setCategory] = useState('All Meals');

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
        } else {
          setItems(list);
        }
      })
      .catch(() => {
        if (!mounted) return;
        // on error, show static sample items
        setItems([
          { id: 'pasta', title: 'Creamy Alfredo Pasta', description: 'Rich creamy pasta with garlic and parsley', price: 199, category: 'Lunch' },
          { id: 'casuals', title: 'Casuals Sandwich', description: 'Toasted sandwich with veggies and cheese', price: 129, category: 'Breakfast' },
        ]);
      });
    return () => { mounted = false; };
  }, []);

  const categories = ['All Meals', 'Breakfast', 'Lunch', 'Dinner'];

  const visible = items.filter((it) => category === 'All Meals' || it.category === category);

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
    <main className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-neutral-900">Browse Our Menu</h1>
            <p className="mt-3 text-lg text-neutral-600">Home-style meals delivered — pick a day and book delivery in a few clicks.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-sm text-neutral-600">Free delivery on orders above ₹299</div>
            <Link href="/cart" className="px-4 py-2 bg-orange-600 text-white rounded-md shadow-sm">View Cart</Link>
          </div>
        </header>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <input
              aria-label="Search menu"
              placeholder="Search dishes, e.g. pasta"
              className="px-4 py-2 rounded-lg border border-neutral-200 bg-white shadow-sm w-full md:w-80 text-neutral-800"
              onChange={(e) => {
                const q = e.target.value.trim().toLowerCase();
                if (!q) setItems(items);
                // local filter on initial items only
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex gap-2 bg-white/80 p-2 rounded-full shadow-sm">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${category === c ? 'bg-neutral-900 text-white' : 'text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="min-h-[40vh]">
          {visible.length === 0 ? (
            <div className="text-center text-neutral-600">No items available in this category</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((it) => (
                <article key={it.id} className="bg-white rounded-xl card-shadow hover:shadow-lg transform hover:-translate-y-1 transition overflow-hidden">
                  <div className="h-44 bg-neutral-100 overflow-hidden relative">
                    <img src={`/assets/images/${(it.id||'placeholder').toString().split('-')[0]}.jpg`} onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/assets/images/placeholder.jpg'}} alt={it.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/80 text-xs px-2 py-1 rounded">{it.category}</div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">{it.title}</h3>
                        <p className="text-sm text-neutral-700 mt-1 line-clamp-2">{it.description}</p>
                      </div>
                      <div className="text-right ml-4 flex flex-col items-end">
                        <div className="text-lg font-bold text-orange-600">₹{(it.price||0).toFixed(2)}</div>
                        <div className="text-xs text-neutral-500 mt-2">Available</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex gap-2">
                        <Link href={`/menu/${it.id}`} className="px-3 py-2 border border-neutral-200 rounded-md text-sm text-neutral-800 hover:bg-neutral-50">View</Link>
                        <button onClick={() => quickBook(it)} className="px-3 py-2 bg-orange-600 text-white rounded-md text-sm">Quick Book</button>
                      </div>
                      <div className="text-xs text-neutral-500">ID: {it.id}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        {/* Floating cart CTA for better visibility */}
        <Link href="/cart" className="fixed right-6 bottom-6 md:right-12 md:bottom-12 px-4 py-3 bg-orange-600 text-white rounded-full shadow-lg hidden md:flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h15l-1.5 9h-12L4 2H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          View Cart
        </Link>
      </div>
    </main>
  );
}