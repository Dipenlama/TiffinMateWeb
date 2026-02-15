"use client";

import React, { useEffect, useState } from 'react';
import { fetchAdminUsers, deleteAdminUser } from '../../../lib/api';

export default function AdminUsersPage() {
  const [usersData, setUsersData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
    if (!token) {
      // redirect to login when unauthenticated
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }
    load();
  }, [page]);

  async function load() {
    setLoading(true);
    try {
      const resp = await fetchAdminUsers(token, page, 10);
      if (!resp.ok) {
        if (resp.status === 401 || resp.status === 403) {
          if (typeof window !== 'undefined') window.location.href = '/login';
          return;
        }
        setUsersData(null);
        return;
      }
      const json = resp.data;
      setUsersData(json.data || json);
    } catch (e) {
      setUsersData(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await deleteAdminUser(token, id);
      if (res.ok) {
        setMessage('User deleted');
        setTimeout(() => { setMessage(null); load(); }, 700);
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Delete failed');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {loading && <p>Loading...</p>}
      {!usersData && !loading && <p>No users or access denied.</p>}
      {usersData && (
        <div>
          {message && <div className="mb-3 text-green-700">{message}</div>}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Username</th>
                <th className="border px-2 py-1">Role</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.users.map((u: any) => (
                <tr key={u._id}>
                  <td className="border px-2 py-1">{u.email}</td>
                  <td className="border px-2 py-1">{u.username}</td>
                  <td className="border px-2 py-1">{u.role}</td>
                  <td className="border px-2 py-1">
                    <a href={`/admin/users/${u._id}`} className="mr-2 text-blue-600">View</a>
                    <a href={`/admin/users/${u._id}/edit`} className="mr-2 text-green-600">Edit</a>
                    <button onClick={() => handleDelete(u._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded">
              Prev
            </button>
            <span className="px-3 py-1">Page {usersData.page} / {usersData.totalPages}</span>
            <button disabled={page >= usersData.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
