'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword, fetchProfile, fetchUserById, updateProfile } from '../../lib/api';

type Profile = {
  name?: string;
  fullName?: string;
  email?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const cachedUser = (() => {
          try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            return raw ? JSON.parse(raw) : null;
          } catch {
            return null;
          }
        })();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        const decodedId = (() => {
          if (!token) return null;
          try {
            const payload = JSON.parse(atob(token.split('.')[1] || ''));
            return payload?.id || payload?._id || payload?.userId || payload?.sub || null;
          } catch {
            return null;
          }
        })();

        const candidateId = cachedUser?._id || cachedUser?.id || decodedId;

        const profile = candidateId && token
          ? await fetchUserById(token, candidateId).then((r) => (r.ok ? (r.data?.data || r.data) : null)).catch(() => null)
          : null;

        const fallbackProfile = profile || await fetchProfile().catch(() => null) || cachedUser;

        if (!mounted) return;
        setUser(fallbackProfile || null);
        setName(fallbackProfile?.name || fallbackProfile?.fullName || fallbackProfile?.username || '');
      } catch (e) {
        if (!mounted) return;
        setError('Failed to load profile');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, []);

  const displayName = useMemo(() => {
    return user?.name || user?.fullName || 'User';
  }, [user]);

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    try {
      document.cookie = 'auth_token=; Max-Age=0; path=/';
      document.cookie = 'token=; Max-Age=0; path=/';
      document.cookie = 'role=; Max-Age=0; path=/';
    } catch (e) {}
    try {
      window.location.replace('/login');
      return;
    } catch (e) {}
    router.replace('/login');
    router.refresh();
  };

  const onSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res: any = await updateProfile({ name });
      if (!res.ok) {
        setSaveMsg(res?.data?.message || res?.data?.error || 'Failed to update profile');
        return;
      }
      setSaveMsg('Profile updated');
      setUser((u) => ({ ...(u || {}), name }));
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    setPwMsg(null);
    if (!currentPassword || !newPassword) {
      setPwMsg('Enter current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg('Passwords do not match');
      return;
    }
    setPwSaving(true);
    try {
      const res: any = await changePassword(currentPassword, newPassword);
      if (!res.ok) {
        setPwMsg(res?.data?.message || res?.data?.error || 'Failed to change password');
        return;
      }
      setPwMsg('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-neutral-600">Manage your account and preferences.</p>
        </div>
        <button onClick={logout} className="px-4 py-2 rounded bg-neutral-900 text-white text-sm">
          Logout
        </button>
      </div>

      {loading && <div className="text-neutral-600">Loading profile…</div>}
      {!loading && error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold">Account Details</h2>
            <p className="text-sm text-neutral-500 mt-1">Update your profile information.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-3 py-2"
                  placeholder="Your name"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-neutral-600 mb-1">Email</label>
                <input
                  value={user?.email || ''}
                  readOnly
                  className="w-full border border-neutral-200 bg-neutral-50 rounded px-3 py-2 text-neutral-600"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onSaveProfile}
                disabled={saving}
                className="px-4 py-2 rounded bg-orange-600 text-white text-sm disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              {saveMsg && <span className="text-sm text-neutral-600">{saveMsg}</span>}
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold">Quick Info</h2>
            <div className="mt-4 text-sm text-neutral-700 space-y-2">
              <div><span className="text-neutral-500">Name:</span> {displayName}</div>
              <div><span className="text-neutral-500">Email:</span> {user?.email || '-'}</div>
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onChangePassword}
                disabled={pwSaving}
                className="px-4 py-2 rounded bg-orange-600 text-white text-sm disabled:opacity-60"
              >
                {pwSaving ? 'Saving…' : 'Update password'}
              </button>
              {pwMsg && <span className="text-sm text-neutral-600">{pwMsg}</span>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
