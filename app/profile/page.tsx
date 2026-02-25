'use client';
import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../../lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchProfile().then((d) => { if (mounted) setUser(d); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <main>
      <h1>Profile</h1>
      <p>TODO: fetch and edit user profile via lib/api.ts</p>
      <p>
        Links: <a href="/profile/addresses">Addresses</a>
      </p>
    </main>
  );
}