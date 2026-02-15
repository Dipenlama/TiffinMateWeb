"use client"

import { useState } from "react";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string; // data URL
};

export function useAdminViewModel() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Breads");
  const [price, setPrice] = useState<string | number>("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem("admin_items");
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  });

  const handleImageChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("Breads");
    setPrice("");
    setImageDataUrl(undefined);
  };

  const addItem = () => {
    const item: Product = {
      id: String(Date.now()),
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price) || 0,
      image: imageDataUrl,
    };
    const next = [item, ...items];
    setItems(next);
    try {
      localStorage.setItem("admin_items", JSON.stringify(next));
    } catch (e) {
      // ignore localStorage errors for now
    }
    resetForm();
  };

  return {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    price,
    setPrice,
    imageDataUrl,
    handleImageChange,
    items,
    addItem,
    resetForm,
  } as const;
}
