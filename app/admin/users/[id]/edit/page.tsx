"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchUserById, updateUserById } from '@/lib/api';

export default function UserEditPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    if (!token) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }
    fetchUserById(token, id).then((j) => { const d = j.data || j; setUser(d); setUsername(d.username); setRole(d.role || 'user'); }).catch(() => setUser(null));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateUserById(token, id!, { username, role });
      setMessage('Saved');
      setTimeout(() => router.push(`/admin/users/${id}`), 700);
    } catch (err) {
      alert('Save failed');
    }
  }

  if (!id) return <div className="p-6">Missing id</div>;

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-4 px-3 py-1 border rounded">Back</button>
      {!user && <p>Loading...</p>}
      {user && (
        <form onSubmit={handleSave} className="max-w-md space-y-4">
          {message && <div className="mb-2 text-green-700">{message}</div>}
          <div>
            <label className="block text-sm">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border px-3 py-2 rounded">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="bg-orange-600 text-white px-4 py-2 rounded" type="submit">Save</button>
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
