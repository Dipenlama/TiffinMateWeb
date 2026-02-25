"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { days, packageMenu } from "../data";
import placeholderImg from "../../assets/images/food1.png";

const times = ["Breakfast", "Lunch", "Dinner"];

export default function PackagePage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug as string | string[] | undefined;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] ?? "" : rawSlug ?? "";
  const packageName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const dayLabels = days;
  const [selectedDay, setSelectedDay] = useState<string>(dayLabels[0]);
  const [selectedTime, setSelectedTime] = useState<string>(times[0]);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getPrice = (id: string) => {
    if (!id) return '₹99';
    const prefix = id[0];
    switch (prefix) {
      case 'v': return '₹99';
      case 'n': return '₹129';
      case 'm': return '₹149';
      case 'p': return '₹199';
      default: return '₹119';
    }
  };

  const incQty = (id: string) => setQuantities(q => ({ ...q, [id]: (q[id] || 0) + 1 }));
  const decQty = (id: string) => setQuantities(q => ({ ...q, [id]: Math.max(0, (q[id] || 0) - 1) }));
  const addToSelection = (id: string) => setSelectedItems(s => ({ ...s, [id]: true }));

  const pkgKey = Object.keys(packageMenu).find(k => k.toLowerCase() === packageName.toLowerCase()) || packageName;
  const items = (packageMenu as any)[pkgKey]?.[selectedDay] || [];

  const toggle = (id: string) => setSelectedItems(s => ({ ...s, [id]: !s[id] }));
  const saveBookingAndProceed = () => {
    const selected = Object.keys(selectedItems).filter(k => selectedItems[k]);
    if (selected.length === 0) {
      // nothing selected, still allow proceeding with quantities >0
      const withQty = Object.keys(quantities).filter(k => (quantities as any)[k] > 0);
      if (withQty.length === 0) return alert('Please select at least one item or increase quantity.');
    }

    const items = (Object.keys(selectedItems).length > 0 ? Object.keys(selectedItems).filter(k => selectedItems[k]) : Object.keys(quantities).filter(k => (quantities as any)[k] > 0)).map(id => {
      const pkgItems = (packageMenu as any)[pkgKey]?.[selectedDay] || [];
      const meta = pkgItems.find((x: any) => x.id === id) || { name: id };
      const qty = quantities[id] || 1;
      const priceStr = getPrice(id).replace('₹', '') || '0';
      const price = Number(priceStr) || 0;
      return { id, name: meta.name || id, qty, price, subtotal: qty * price };
    });

    const total = items.reduce((s, it) => s + it.subtotal, 0);

    const booking = {
      package: pkgKey,
      packageName,
      day: selectedDay,
      time: selectedTime,
      items,
      total,
      createdAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem('bookingDraft', JSON.stringify(booking));
      router.push('/packages/confirm');
    } catch (e) {
      console.error(e);
      alert('Could not save booking draft.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <div className="font-semibold text-lg">{packageName} Package</div>
          <div className="text-sm text-neutral-600">Select items by day and time</div>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="text-sm text-neutral-600">Back to Dashboard</Link>
          <button onClick={() => router.push('/menu')} className="px-3 py-1 bg-orange-600 text-white rounded">Browse Menu</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-4">
          {dayLabels.map(d => (
            <button key={d} onClick={() => setSelectedDay(d)} className={`px-3 py-1 rounded ${selectedDay===d? 'bg-neutral-900 text-white' : 'bg-white'}`}>
              {d}
            </button>
          ))}
        </div>

        <div className="flex gap-4 mb-6">
          {times.map(t => (
            <button key={t} onClick={() => setSelectedTime(t)} className={`px-3 py-1 rounded ${selectedTime===t? 'bg-orange-600 text-white' : 'bg-white'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it: any) => {
            const firstWord = (it.name || '').split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
            const trySrc = `/assets/images/${firstWord}.jpg`;
            const price = getPrice(it.id);
            const qty = quantities[it.id] || 0;

            return (
              <div key={it.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                <div className="w-full h-44 overflow-hidden">
                  <img src={trySrc} onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholderImg.src; }} alt={it.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="font-semibold text-lg">{it.name}</div>
                    <div className="text-xs text-neutral-500 mt-1">{packageName} • {selectedTime} • {selectedDay}</div>
                    <p className="text-sm text-neutral-600 mt-3">A tasty serving of {it.name.toLowerCase()} prepared fresh each {selectedDay}. (Sample description)</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <div className="text-orange-600 font-bold">{price}</div>
                      <div className="flex items-center border rounded-full overflow-hidden">
                        <button onClick={() => decQty(it.id)} className="px-3 py-1 text-lg">−</button>
                        <div className="px-4 py-1 min-w-[44px] text-center">{qty}</div>
                        <button onClick={() => incQty(it.id)} className="px-3 py-1 text-lg">+</button>
                      </div>
                    </div>

                    <div>
                      <button onClick={() => addToSelection(it.id)} className={`px-4 py-2 rounded-full text-white ${selectedItems[it.id] ? 'bg-neutral-700' : 'bg-orange-600 hover:bg-orange-700'}`}>{selectedItems[it.id] ? 'Selected' : 'Add'}</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <div className="w-full max-w-7xl px-6">
            <div className="bg-white rounded-full shadow-lg p-4 flex items-center justify-between">
              <div className="text-sm text-neutral-600">{Object.keys(selectedItems).filter(k => selectedItems[k]).length} selected</div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border rounded" onClick={() => { try { sessionStorage.setItem('bookingDraft', JSON.stringify({ savedAt: new Date().toISOString(), package: pkgKey })); alert('Saved draft'); } catch(e){}}}>Save for later</button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded" onClick={saveBookingAndProceed}>Proceed</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
