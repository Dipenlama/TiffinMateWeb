"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../../lib/api";
import RectangleImg from "../../assets/images/Rectangle.png";
import food1 from "../../assets/images/food1.png";
import food2 from "../../assets/images/food2.png";
import food3 from "../../assets/images/food3.png";
import food4 from "../../assets/images/food4.png";
import food5 from "../../assets/images/food5.png";
import food6 from "../../assets/images/food6.png";
import food7 from "../../assets/images/food7.png";
import thukpa from "../../assets/images/thukpa.png";

const Hero = () => (
  <section className="max-w-7xl mx-auto px-6 py-10">
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg grid md:grid-cols-2 gap-6 items-center p-6">
      <div className="p-6">
        <p className="text-sm text-neutral-500 mb-2">Order food on a tiffin basis.</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 leading-tight">Feast Your Senses, <span className="text-orange-600">With Tiffin Mate</span></h1>
        <p className="mt-4 text-sm text-neutral-600">See what we serve on daily basis</p>

        <div className="mt-6 flex gap-3">
          <input className="flex-1 border border-neutral-200 rounded-full px-4 py-3" placeholder="Menu" />
          <button className="px-6 py-3 rounded-full bg-orange-600 text-white font-medium">Search</button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute right-0 top-0 -translate-y-8 w-72 h-72 md:w-96 md:h-96 rounded-l-full bg-orange-600/95"></div>
        <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-xl">
          <img src={RectangleImg.src} alt="hero" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </section>
);

const Card = ({ title, subtitle, img, badge }: { title: string; subtitle?: string; img: string; badge?: string }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md relative">
    <img src={img} className="w-full h-36 object-cover" />
    {badge && <div className="absolute right-3 top-3 bg-black/60 text-white text-xs px-2 py-1 rounded">{badge}</div>}
    <div className="p-4">
      <div className="text-xs text-neutral-500">Restaurant</div>
      <div className="font-semibold mt-1">{title}</div>
      {subtitle && <div className="text-sm text-neutral-500 mt-1">{subtitle}</div>}
    </div>
  </div>
);

const Categories = () => (
  <div className="max-w-7xl mx-auto px-6 py-8">
    <h3 className="text-lg font-semibold mb-4">Order Popular Categories</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {[
        { name: "Burgers & Fast food", img: food1.src },
        { name: "Salads", img: food2.src },
        { name: "Pasta & Casuals", img: food3.src },
        { name: "Pizza", img: food4.src },
        { name: "Breakfast", img: food5.src },
        { name: "Soups", img: food6.src },
      ].map((c) => (
        <div key={c.name} className="bg-white rounded-lg p-3 flex flex-col items-center gap-2 text-center shadow-sm">
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            <img src={c.img} className="w-full h-full object-cover" />
          </div>
          <div className="text-sm font-medium">{c.name}</div>
          <div className="text-xs text-neutral-500">32 Restaurants</div>
        </div>
      ))}
    </div>
  </div>
);

const Deals = () => (
  <section className="max-w-7xl mx-auto px-6 py-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Up to -40% 🎉 Order exclusive deals</h3>
      <div className="flex gap-3 text-sm text-neutral-600">
        <button className="px-3 py-1 rounded-full border">Vegan</button>
        <button className="px-3 py-1 rounded-full border">Sushi</button>
        <button className="px-3 py-1 rounded-full bg-orange-600 text-white">Pizza & Fast food</button>
        <button className="px-3 py-1 rounded-full border">others</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Card title="Chef Burgers London" img={food7.src} badge="-40%" />
      <Card title="Grand Ai Cafe London" img={food4.src} badge="-20%" />
      <Card title="Butterbrot Caf'e London" img={thukpa.src} badge="-17%" />
    </div>
  </section>
);

const DashboardPage = () => {
  const router = useRouter();
  const [specialItems, setSpecialItems] = useState<Array<{ id: string; name: string; description?: string; price?: number; category?: string; image?: string; available?: boolean }>>([]);
  const [specialLoading, setSpecialLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const normalize = (list: any[]) => (list || []).map((it: any) => ({
      id: it._id || it.id || it.name,
      name: it.name || it.title || "Item",
      description: it.description,
      price: it.price,
      category: it.category,
      image: it.image,
      available: it.available !== false,
    }));

    const load = async () => {
      setSpecialLoading(true);
      try {
        const paths = [
          `${API_BASE}/items`,
          `${API_BASE}/menu`,
          `/api/items`,
          `/api/menu`,
        ];
        for (const url of paths) {
          try {
            const res = await fetch(url);
            const json = await res.json().catch(() => ({}));
            if (!res.ok) continue;
            const list = Array.isArray(json?.data?.items)
              ? json.data.items
              : Array.isArray(json?.items)
              ? json.items
              : Array.isArray(json?.data)
              ? json.data
              : Array.isArray(json)
              ? json
              : [];
            if (active) setSpecialItems(normalize(list));
            return;
          } catch (err) {
            if ((err as any)?.name === 'AbortError') return;
            continue;
          }
        }
        if (active) setSpecialItems([]);
      } catch (e) {
        if (active) setSpecialItems([]);
      } finally {
        if (active) setSpecialLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const quickBook = (it: { id: string; name: string; price?: number; available?: boolean }) => {
    if (it.available === false) { alert('This item is currently unavailable.'); return; }
    const price = Number(it.price || 99) || 99;
    const draft = {
      items: [{ id: it.id, name: it.name, qty: 1, price, subtotal: price }],
      total: price,
      day: 'Mon',
      time: 'Lunch',
      frequency: 'once',
      draftId: `draft-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      createdAt: new Date().toISOString(),
      source: 'dashboard-special',
    };
    try {
      sessionStorage.setItem('bookingDraft', JSON.stringify(draft));
      router.push('/packages/confirm');
    } catch (e) {
      alert('Could not create booking draft');
    }
  };

  // Package selection: fixed items per package and day
  const packages = ["Veg", "Non-Veg", "Mixed", "Premium"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const packageMenu: Record<string, Record<string, Array<{ id: string; name: string; desc?: string }>>> = {
    "Veg": {
      Mon: [{ id: 'v1', name: 'Paneer Curry' }, { id: 'v2', name: 'Mixed Veg' }],
      Tue: [{ id: 'v3', name: 'Chole Masala' }, { id: 'v4', name: 'Aloo Gobi' }],
      Wed: [{ id: 'v5', name: 'Dal Tadka' }, { id: 'v6', name: 'Jeera Rice' }],
      Thu: [{ id: 'v7', name: 'Palak Paneer' }, { id: 'v8', name: 'Roti' }],
      Fri: [{ id: 'v9', name: 'Veg Biryani' }, { id: 'v10', name: 'Raita' }],
      Sat: [{ id: 'v11', name: 'Methi Malai' }, { id: 'v12', name: 'Paratha' }],
      Sun: [{ id: 'v13', name: 'Navratan Korma' }, { id: 'v14', name: 'Naan' }],
    },
    "Non-Veg": {
      Mon: [{ id: 'n1', name: 'Chicken Curry' }, { id: 'n2', name: 'Egg Fry' }],
      Tue: [{ id: 'n3', name: 'Mutton Curry' }, { id: 'n4', name: 'Fried Fish' }],
      Wed: [{ id: 'n5', name: 'Kadai Chicken' }, { id: 'n6', name: 'Egg Bhurji' }],
      Thu: [{ id: 'n7', name: 'Fish Curry' }, { id: 'n8', name: 'Tandoori Chicken' }],
      Fri: [{ id: 'n9', name: 'Prawn Masala' }, { id: 'n10', name: 'Rice' }],
      Sat: [{ id: 'n11', name: 'Chicken Biryani' }, { id: 'n12', name: 'Salad' }],
      Sun: [{ id: 'n13', name: 'Mixed Grill' }, { id: 'n14', name: 'Naan' }],
    },
    "Mixed": {
      Mon: [{ id: 'm1', name: 'Veg + Egg' }, { id: 'm2', name: 'Salad' }],
      Tue: [{ id: 'm3', name: 'Chicken + Veg' }, { id: 'm4', name: 'Roti' }],
      Wed: [{ id: 'm5', name: 'Dal + Fish' }, { id: 'm6', name: 'Rice' }],
      Thu: [{ id: 'm7', name: 'Paneer + Chicken' }, { id: 'm8', name: 'Naan' }],
      Fri: [{ id: 'm9', name: 'Biryani (Mixed)' }, { id: 'm10', name: 'Raita' }],
      Sat: [{ id: 'm11', name: 'Grill + Veg' }, { id: 'm12', name: 'Paratha' }],
      Sun: [{ id: 'm13', name: 'Special Mixed' }, { id: 'm14', name: 'Dessert' }],
    },
    "Premium": {
      Mon: [{ id: 'p1', name: 'Chef Special Chicken' }, { id: 'p2', name: 'Gourmet Salad' }],
      Tue: [{ id: 'p3', name: 'Lamb Shank' }, { id: 'p4', name: 'Exotic Rice' }],
      Wed: [{ id: 'p5', name: 'Seafood Platter' }, { id: 'p6', name: 'Steamed Veg' }],
      Thu: [{ id: 'p7', name: 'Duck Confit' }, { id: 'p8', name: 'Gourmet Bread' }],
      Fri: [{ id: 'p9', name: 'Lobster' }, { id: 'p10', name: 'Saffron Rice' }],
      Sat: [{ id: 'p11', name: 'Chef Thali' }, { id: 'p12', name: 'Premium Dessert' }],
      Sun: [{ id: 'p13', name: 'Sunday Roast' }, { id: 'p14', name: 'Sides' }],
    },
  };

  const [selectedPackage, setSelectedPackage] = React.useState<string>(packages[0]);
  const [selectedDay, setSelectedDay] = React.useState<string>(days[0]);
  const [selectedItems, setSelectedItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setSelectedItems((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <main>
        <Hero />
        <Deals />
        <Categories />

        <section className="max-w-7xl mx-auto px-6 py-8">
          <h3 className="text-lg font-semibold mb-4">Choose a Subscription Package</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { key: 'Veg', title: 'Veg', img: food5.src, price: '₹99', features: ['Fresh veggies', 'Protein rich'] },
              { key: 'Non-Veg', title: 'Non-Veg', img: food7.src, price: '₹129', features: ['Daily non-veg', 'High protein'] },
              { key: 'Mixed', title: 'Mixed', img: food3.src, price: '₹149', features: ['Balanced meals', 'Variety'] },
              { key: 'Premium', title: 'Premium', img: thukpa.src, price: '₹199', features: ['Chef curated', 'Gourmet sides'] },
            ].map((p) => (
              <Link key={p.key} href={`/packages/${p.key.toLowerCase().replace(/\s+/g, '-')}`} className="block">
                <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all h-full">
                  <div className="absolute inset-0">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover brightness-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>

                  <div className="relative p-5 flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-white/90">{p.title} Package</div>
                      <div className="bg-white/20 text-white px-2 py-1 rounded text-xs">Popular</div>
                    </div>

                    <div className="mt-4 flex-1">
                      <div className="text-white font-bold text-xl">{p.title}</div>
                      <div className="text-sm text-white/90 mt-2">{p.features.join(' • ')}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-white/90">From</div>
                      <div className="text-white font-semibold text-lg">{p.price} / day</div>
                    </div>

                    <div className="mt-4">
                      <button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 font-medium">View package</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-sm text-neutral-600">Click a package to view day-wise menu and select items by day and time.</div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Special Items</h3>
            <div className="text-sm text-neutral-500">Curated by admin</div>
          </div>
          {specialLoading && <div className="text-neutral-600">Loading items…</div>}
          {!specialLoading && specialItems.length === 0 && (
            <div className="bg-white border border-dashed border-neutral-200 rounded-xl p-6 text-neutral-600">No special items available right now.</div>
          )}
          {!specialLoading && specialItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialItems.map((it) => (
                <article key={it.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-lg transition">
                  <div className="h-44 bg-neutral-100 overflow-hidden relative">
                    <img
                      src={it.image || RectangleImg.src}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = RectangleImg.src; }}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/85 backdrop-blur text-xs px-3 py-1 rounded-full border border-neutral-200">{it.category || 'Special'}</div>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm text-neutral-500">Special item</div>
                        <h4 className="text-lg font-semibold text-neutral-900">{it.name}</h4>
                        <p className="text-sm text-neutral-600 line-clamp-2">{it.description || 'Freshly prepared by our kitchen.'}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-600">₹{(Number(it.price||0)).toFixed(2)}</div>
                        <div className={`text-[11px] font-semibold mt-1 px-2 py-1 rounded-full border ${it.available === false ? 'text-red-600 bg-red-50 border-red-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
                          {it.available === false ? 'Unavailable' : 'Available'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/menu/${it.id}`} className="px-3 py-2 border border-neutral-200 rounded-md text-sm text-neutral-800 hover:bg-neutral-50">View</Link>
                      <button
                        onClick={() => quickBook(it)}
                        disabled={it.available === false}
                        className={`px-3 py-2 rounded-md text-sm shadow-sm transition ${it.available === false ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-orange-600 text-white hover:-translate-y-0.5'}`}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
