"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Settings,
  LogOut,
  User,
  Moon,
  Edit2,
  Sun,
} from "lucide-react";
import RectangleImg from "../../assets/images/Rectangle.png";
import food1 from "../../assets/images/food1.png";
import food2 from "../../assets/images/food2.png";
import food3 from "../../assets/images/food3.png";
import food4 from "../../assets/images/food4.png";
import food5 from "../../assets/images/food5.png";
import food6 from "../../assets/images/food6.png";
import food7 from "../../assets/images/food7.png";
import thukpa from "../../assets/images/thukpa.png";

const Header = () => (
  <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <img src={RectangleImg.src} alt="TiffinMate logo" className="w-12 h-12 object-contain" />
        <div>
          <div className="font-semibold text-lg">TiffinMate</div>
          <div className="text-xs text-neutral-600">Daily Treats</div>
        </div>
      </div>
    </div>
    <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-700">
      <Link href="/" className="text-orange-600 font-medium">Home</Link>
      <Link href="/browse">Browse Menu</Link>
      <Link href="/special-offers">Special Offers</Link>
    </nav>
    <div className="flex items-center gap-4">
      <ProfileMenu />
    </div>
  </header>
);

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow"
      >
        <User size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1 z-50">
          <button className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-sm" onClick={() => { setOpen(false); /* navigate to settings */ }}>
            <Settings size={14} /> Settings
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-sm" onClick={toggleTheme}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />} Theme
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-sm" onClick={() => { setOpen(false); /* navigate to edit profile */ }}>
            <Edit2 size={14} /> Edit Profile
          </button>
          <div className="border-t mt-1" />
          <button className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-sm text-rose-600" onClick={() => { console.log('logout'); setOpen(false); }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

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
    <h3 className="text-lg font-semibold mb-4">Order.uk Popular Categories</h3>
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
      <h3 className="text-lg font-semibold">Up to -40% 🎉 Order.uk exclusive deals</h3>
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
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <Header />
      <main>
        <Hero />
        <Deals />
        <Categories />
      </main>
    </div>
  );
};

export default DashboardPage;