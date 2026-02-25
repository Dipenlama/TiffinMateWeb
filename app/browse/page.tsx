// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { API_BASE } from '../../lib/api';
// import { addToCart } from '../../lib/cart';

// type MenuItem = { id: string; title: string; description?: string; price?: number; category?: string };

// export default function BrowsePage() {
//   const [items, setItems] = useState<MenuItem[]>([]);
//   const [q, setQ] = useState('');
//   const [category, setCategory] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState<string | null>(null);

//   useEffect(() => {
//     load();
//   }, [q, category]);

//   async function load() {
//     setLoading(true);
//     try {
//       const url = `${API_BASE}/api/menu?q=${encodeURIComponent(q)}${category ? `&category=${encodeURIComponent(category)}` : ''}`;
//       const res = await fetch(url);
//       const json = await res.json();
//       setItems(json?.data || []);
//     } catch (e) {
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleAdd(it: MenuItem) {
//     addToCart({ id: it.id, title: it.title, price: it.price, category: it.category });
//     setMsg('Added to cart');
//     setTimeout(() => setMsg(null), 900);
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50 p-8">
//       <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-semibold">Browse Menu</h1>
//           <div className="flex gap-4">
//             <Link href="/cart" className="text-orange-600">View Cart</Link>
//             <Link href="/" className="text-neutral-600">Back home</Link>
//           </div>
//         </div>

//         <div className="flex gap-3 mb-6">
//           <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search menu" className="flex-1 border px-3 py-2 rounded" />
//           <select value={category} onChange={(e) => setCategory(e.target.value)} className="border px-3 py-2 rounded">
//             <option value="">All</option>
//             <option value="Vegetarian">Vegetarian</option>
//             <option value="Non-Veg">Non-Veg</option>
//           </select>
//         </div>

//         {loading && <div>Loading…</div>}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {items.map((it) => (
//             <div key={it.id} className="p-4 border rounded bg-white flex flex-col">
//               <div className="font-semibold mb-1">{it.title}</div>
//               <div className="text-sm text-neutral-600 mb-2 flex-1">{it.description}</div>
//               <div className="flex items-center justify-between mt-2">
//                 <div className="text-sm text-neutral-700">{it.category}</div>
//                 <div className="font-medium">${it.price?.toFixed(2)}</div>
//               </div>
//               <div className="mt-3 flex justify-end">
//                 <button onClick={() => handleAdd(it)} className="px-3 py-1 bg-orange-600 text-white rounded">Add to cart</button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {msg && <div className="fixed right-6 bottom-6 bg-green-600 text-white px-4 py-2 rounded">{msg}</div>}
//       </div>
//     </div>
//   );
// }
