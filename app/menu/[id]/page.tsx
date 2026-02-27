"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id || "unknown");
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("Mon");
  const [selectedTime, setSelectedTime] = useState<string>("Lunch");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = ["Breakfast", "Lunch", "Dinner"];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchMenuItem(id)
      .then((d) => {
        if (mounted) setItem(d);
      })
      .catch(() => {
        if (mounted) setError("Failed to load item");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const addToCart = async () => {
    if (!item) return;
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, name: item.name, price: item.price, quantity: qty }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      alert("Added to cart");
    } catch (e) {
      console.error(e);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const bookForDay = () => {
    // open modal-based booking confirmation instead (handled below)
    setShowBooking(true);
  };

  const [showBooking, setShowBooking] = useState(false);
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly'>('once');

  const confirmBooking = () => {
    if (!item) return alert('Item not loaded');
    const price = Number(item.price || 99) || 99;
    const itm = { id: item.id || id, name: item.name || item.title || 'Item', qty: qty || 1, price, subtotal: (qty || 1) * price };
    const booking = {
      items: [itm],
      total: itm.subtotal,
      day: selectedDay,
      time: selectedTime,
      frequency,
      draftId: `draft-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      createdAt: new Date().toISOString(),
      source: 'menu-item',
    };

    try {
      sessionStorage.setItem('bookingDraft', JSON.stringify(booking));
      setShowBooking(false);
      router.push('/packages/confirm');
    } catch (e) {
      console.error(e);
      alert('Could not save booking draft.');
    }
  };

  if (loading) return <main><div>Loading item…</div></main>;
  if (error) return <main><div role="alert">{error}</div></main>;
  if (!item) return <main><div>Item not found</div></main>;

  return (
    <main className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow">
        <div className="flex gap-6">
          <div className="w-1/3">
            <img src={item.image || "/assets/images/placeholder.jpg"} alt={item.name} className="w-full h-48 object-cover rounded" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-neutral-900">{item.name}</h1>
            <p className="text-sm text-neutral-800 mt-2">{item.description}</p>
            <div className="mt-4 text-lg font-bold text-neutral-900">₹{Number(item.price || 99).toFixed(2)}</div>

            <div className="mt-6">
              <div className="flex gap-3">
                {days.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1 rounded text-sm font-medium ${selectedDay===d ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'}`}>
                    {d}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                {times.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`px-3 py-1 rounded text-sm font-medium ${selectedTime===t ? 'bg-orange-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm text-neutral-700">Quantity</label>
                <div className="flex items-center border rounded-full overflow-hidden bg-white">
                  <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-1 text-neutral-800">−</button>
                  <div className="px-4 py-1 min-w-[44px] text-center text-neutral-900">{qty}</div>
                  <button onClick={() => setQty(q => q+1)} className="px-3 py-1 text-neutral-800">+</button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={addToCart} disabled={adding} className="px-4 py-2 bg-white border rounded text-neutral-800">{adding ? 'Adding…' : 'Add to cart'}</button>
                <button onClick={bookForDay} className="px-4 py-2 bg-orange-600 text-white rounded">Book for {selectedDay}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBooking(false)} />
          <div className="relative w-full md:w-2/3 lg:w-1/2 bg-white rounded-t-lg md:rounded-lg p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Confirm Booking</h2>
            <p className="text-sm text-neutral-600 mt-2">{item.name} — ₹{Number(item.price||0).toFixed(2)}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-neutral-500">Day</div>
                <div className="font-medium">{selectedDay}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Time</div>
                <div className="font-medium">{selectedTime}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-neutral-500">Frequency</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setFrequency('once')} className={`px-3 py-1 rounded ${frequency==='once'? 'bg-neutral-900 text-white':'bg-white border'}`}>One-time</button>
                <button onClick={() => setFrequency('daily')} className={`px-3 py-1 rounded ${frequency==='daily'? 'bg-neutral-900 text-white':'bg-white border'}`}>Daily</button>
                <button onClick={() => setFrequency('weekly')} className={`px-3 py-1 rounded ${frequency==='weekly'? 'bg-neutral-900 text-white':'bg-white border'}`}>Weekly</button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm">Quantity</div>
              <div className="flex items-center border rounded-full overflow-hidden bg-white">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-1 text-neutral-800">−</button>
                <div className="px-4 py-1 min-w-[44px] text-center text-neutral-900">{qty}</div>
                <button onClick={() => setQty(q => q+1)} className="px-3 py-1 text-neutral-800">+</button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-neutral-700">Total</div>
              <div className="text-lg font-bold text-orange-600">₹{((Number(item.price||0)||0) * qty).toFixed(2)}</div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowBooking(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmBooking} className="px-4 py-2 bg-orange-600 text-white rounded">Confirm & Continue</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export async function fetchMenuItem(id: string): Promise<any> {
  try {
    const res = await fetch(`/api/menu/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch menu item');
    return res.json();
  } catch (e) {
    // fallback to local static items
    const staticMap: Record<string, any> = {
      pasta: { id: 'pasta', name: 'Creamy Alfredo Pasta', description: 'Rich creamy pasta with garlic, butter and parsley', price: 199, image: '/assets/images/pasta.jpg' },
      'pasta-spicy': { id: 'pasta-spicy', name: 'Spicy Tomato Pasta', description: 'Pasta tossed in spicy tomato sauce', price: 189, image: '/assets/images/pasta.jpg' },
      casuals: { id: 'casuals', name: 'Casuals Sandwich', description: 'Toasted sandwich with veggies and cheese', price: 129, image: '/assets/images/sandwich.jpg' },
    };
    if (staticMap[id]) return staticMap[id];
    // if not found, return a minimal object so page can still render
    return { id, name: id, description: 'Item details not available', price: 99, image: '/assets/images/placeholder.jpg' };
  }
}

