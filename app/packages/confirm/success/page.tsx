"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // clear draft after success
    try { sessionStorage.removeItem('bookingDraft'); } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Booking Confirmed (Demo)</h2>
        <p className="mt-3 text-neutral-600">This is a demo success screen. No real payment was processed.</p>
        <div className="mt-6">
          <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-orange-600 text-white rounded">Back to dashboard</button>
        </div>
      </div>
    </div>
  );
}
