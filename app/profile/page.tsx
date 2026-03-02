'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addAddress, changePassword, fetchAddresses, fetchProfile, updateProfile } from '../../lib/api';

type Profile = {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [addressMsg, setAddressMsg] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchProfile(),
      fetchAddresses().catch(() => []),
    ])
      .then(([profile, addr]) => {
        if (!mounted) return;
        setUser(profile || null);
        setAddresses(Array.isArray(addr) ? addr : []);
        setName(profile?.name || profile?.fullName || '');
        setPhone(profile?.phone || '');
      })
      .catch(() => {
        if (!mounted) return;
        setError('Failed to load profile');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

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
      const res: any = await updateProfile({ name, phone });
      if (!res.ok) {
        setSaveMsg(res?.data?.message || res?.data?.error || 'Failed to update profile');
        return;
      }
      setSaveMsg('Profile updated');
      setUser((u) => ({ ...(u || {}), name, phone }));
    } finally {
      setSaving(false);
    }
  };

  const onAddAddress = async () => {
    const value = newAddress.trim();
    if (!value) return;
    setAddressMsg(null);
    try {
      await addAddress(value);
      setAddresses((s) => [...s, value]);
      setNewAddress('');
      setAddressMsg('Address added');
    } catch (e) {
      setAddressMsg('Failed to add address');
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
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-3 py-2"
                  placeholder="Phone number"
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
              <div><span className="text-neutral-500">Phone:</span> {user?.phone || '-'}</div>
            </div>
          </section>

          <section className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold">Addresses</h2>
            <p className="text-sm text-neutral-500 mt-1">Manage delivery addresses.</p>

            <div className="mt-4 space-y-2">
              {addresses.length === 0 && (
                <div className="text-sm text-neutral-600">No saved addresses yet.</div>
              )}
              {addresses.map((a, i) => (
                <div key={`${a}-${i}`} className="text-sm text-neutral-800 border border-neutral-200 rounded px-3 py-2">
                  {a}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Add new address"
                className="flex-1 border border-neutral-300 rounded px-3 py-2"
              />
              <button onClick={onAddAddress} className="px-4 py-2 rounded bg-neutral-900 text-white text-sm">
                Add
              </button>
            </div>
            {addressMsg && <div className="mt-2 text-sm text-neutral-600">{addressMsg}</div>}
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
