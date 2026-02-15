"use client";

import React from 'react';
import Link from 'next/link';

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Browse Menu</h1>
        <p className="text-sm text-neutral-600 mb-6">Placeholder menu page — implement menu browsing here.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded">Sample Item 1</div>
          <div className="p-4 border rounded">Sample Item 2</div>
          <div className="p-4 border rounded">Sample Item 3</div>
          <div className="p-4 border rounded">Sample Item 4</div>
        </div>
        <div className="mt-6">
          <Link href="/" className="text-orange-600">Back home</Link>
        </div>
      </div>
    </div>
  );
}
