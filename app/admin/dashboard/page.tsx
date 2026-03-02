"use client";

import React, { useEffect, useMemo, useState } from "react";

type User = {
    _id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    createdAt?: string;
};

type NewUser = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
};

type Booking = {
    _id: string;
    package?: string;
    packageName?: string;
    day?: string;
    time?: string;
    total?: number;
    status?: string;
    userId?: string;
    createdAt?: string;
};

type MenuItem = {
    _id?: string;
    id?: string;
    title?: string; // legacy
    name?: string;
    description?: string;
    image?: string;
    price?: number;
    category?: string;
    available?: boolean;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050/api").replace(/\/$/, "");

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    const local = localStorage.getItem("token");
    if (local) return local;
    try {
        const cookies = document.cookie.split(";").map((c) => c.trim());
        const entry = cookies.find((c) => c.startsWith("auth_token=")) || cookies.find((c) => c.startsWith("token="));
        if (entry) return entry.split("=")[1];
    } catch {}
    return null;
}

async function apiGet(path: string, token: string) {
    const res = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json?.data ?? json };
}

async function apiSend(path: string, token: string, method: string, body?: any) {
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json?.data ?? json };
}

type TabKey = "overview" | "users" | "bookings" | "items";

export default function AdminDashboardPage() {
    const [tab, setTab] = useState<TabKey>("overview");
    const [token, setToken] = useState<string | null>(null);

    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState<string | null>(null);

    const [items, setItems] = useState<MenuItem[]>([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [itemsError, setItemsError] = useState<string | null>(null);

    const [itemForm, setItemForm] = useState<MenuItem>({ name: "", description: "", price: 0, category: "", available: true, image: "" });
    const [itemImagePreview, setItemImagePreview] = useState<string | undefined>(undefined);
    const [savingItem, setSavingItem] = useState(false);

    const [userForm, setUserForm] = useState<NewUser>({ username: "", email: "", password: "", confirmPassword: "", role: "user" });
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [savingUser, setSavingUser] = useState(false);

    useEffect(() => {
        setToken(getToken());
    }, []);

    useEffect(() => {
        if (!token) return;
        loadUsers();
        loadBookings();
        loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const loadUsers = async () => {
        if (!token) return;
        setUsersLoading(true);
        setUsersError(null);
        const res = await apiGet("/admin/users", token);
        if (!res.ok) setUsersError(`Failed to load users (${res.status})`);
        const list = Array.isArray(res.data?.items)
            ? res.data.items
            : Array.isArray(res.data?.users)
            ? res.data.users
            : Array.isArray(res.data)
            ? res.data
            : [];
        setUsers(list as User[]);
        setUsersLoading(false);
    };

    const startEditUser = (u: User) => {
        setEditingUserId(u._id);
        setUserForm({
            username: u.username || "",
            email: u.email || "",
            password: "",
            confirmPassword: "",
            role: u.role || "user",
        });
        setTab("users");
    };

    const deleteUser = async (id: string) => {
        if (!token) return;
        const ok = confirm("Delete this user?");
        if (!ok) return;
        const res = await apiSend(`/admin/users/${id}`, token, "DELETE");
        if (!res.ok) {
            alert("Failed to delete user");
            return;
        }
        setUsers((u) => u.filter((x) => x._id !== id));
    };

    const loadBookings = async () => {
        if (!token) return;
        setBookingsLoading(true);
        setBookingsError(null);
        const res = await apiGet("/admin/bookings?page=1&limit=50", token);
        if (!res.ok) setBookingsError(`Failed to load bookings (${res.status})`);
        setBookings(Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : []);
        setBookingsLoading(false);
    };

    const updateBookingStatus = async (id: string, status: string) => {
        if (!token) return;
        const res = await apiSend(`/admin/bookings/${id}/status`, token, "PUT", { status });
        if (!res.ok) {
            alert("Failed to update booking");
            return;
        }
        loadBookings();
    };

    const cancelBooking = async (id: string) => {
        if (!token) return;
        const ok = confirm("Cancel this booking?");
        if (!ok) return;
        const res = await apiSend(`/admin/bookings/${id}`, token, "DELETE");
        if (!res.ok) alert("Failed to cancel booking");
        loadBookings();
    };

    const loadItems = async () => {
        if (!token) return;
        setItemsLoading(true);
        setItemsError(null);
        const res = await apiGet("/admin/items?page=1&limit=100", token);
        if (!res.ok) setItemsError(`Failed to load items (${res.status})`);
        const list = Array.isArray(res.data?.items) ? res.data.items : Array.isArray(res.data) ? res.data : [];
        setItems(list as MenuItem[]);
        setItemsLoading(false);
    };

    const saveItem = async () => {
        if (!token) return;
        setSavingItem(true);
        const payload = {
            name: itemForm.name?.trim() || "",
            description: itemForm.description?.trim() || "",
            image: (itemForm.image || itemImagePreview || "").trim() || undefined,
            price: Number(itemForm.price) || 0,
            category: itemForm.category || "General",
            available: itemForm.available !== false,
        };
        const path = itemForm._id ? `/admin/items/${itemForm._id}` : "/admin/items";
        const method = itemForm._id ? "PUT" : "POST";
        const res = await apiSend(path, token, method, payload);
        if (!res.ok) {
            alert("Failed to save item");
        } else {
            loadItems();
            setItemForm({ name: "", description: "", price: 0, category: "", available: true, image: "" });
            setItemImagePreview(undefined);
        }
        setSavingItem(false);
    };

    const editItem = (itm: MenuItem) => {
        setItemForm({
            ...itm,
            name: itm.name || itm.title || itm.id || "",
            description: itm.description || "",
            image: itm.image || "",
            price: itm.price ?? 0,
            category: itm.category || "",
            available: itm.available !== false,
        } as any);
        setItemImagePreview(itm.image);
        setTab("items");
    };

    const deleteItem = async (id?: string) => {
        if (!token || !id) return;
        const ok = confirm("Delete this item?");
        if (!ok) return;
        const res = await apiSend(`/admin/items/${id}`, token, "DELETE");
        if (!res.ok) alert("Failed to delete item");
        loadItems();
    };

    const stats = useMemo(() => ({
        users: users.length,
        bookings: bookings.length,
        items: items.length,
    }), [users, bookings, items]);

    const orangeCard = "bg-gradient-to-r from-orange-500 to-amber-500 text-white";

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <main className="max-w-7xl mx-auto px-6 py-8">
                <header className="mb-8">
                    <p className="text-sm text-neutral-500">Admin</p>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button onClick={() => setTab("overview")} className={`px-3 py-2 rounded-full text-sm font-semibold ${tab === "overview" ? orangeCard : "bg-white border border-neutral-200 text-neutral-800"}`}>Overview</button>
                        <button onClick={() => setTab("users")} className={`px-3 py-2 rounded-full text-sm font-semibold ${tab === "users" ? orangeCard : "bg-white border border-neutral-200 text-neutral-800"}`}>Users</button>
                        <button onClick={() => setTab("bookings")} className={`px-3 py-2 rounded-full text-sm font-semibold ${tab === "bookings" ? orangeCard : "bg-white border border-neutral-200 text-neutral-800"}`}>Bookings</button>
                        <button onClick={() => setTab("items")} className={`px-3 py-2 rounded-full text-sm font-semibold ${tab === "items" ? orangeCard : "bg-white border border-neutral-200 text-neutral-800"}`}>Items</button>
                    </div>
                </header>

                {tab === "overview" && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[{ label: "Users", value: stats.users }, { label: "Bookings", value: stats.bookings }, { label: "Menu Items", value: stats.items }].map((s) => (
                            <div key={s.label} className={`${orangeCard} rounded-xl p-5 shadow`}> 
                                <div className="text-sm text-white/80">{s.label}</div>
                                <div className="text-3xl font-bold mt-2">{s.value}</div>
                            </div>
                        ))}
                    </section>
                )}

                {tab === "users" && (
                    <section className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                                <h2 className="font-semibold">Users</h2>
                                <button onClick={loadUsers} className="text-sm px-3 py-2 rounded border">Refresh</button>
                            </div>
                            {usersLoading && <div className="p-4 text-sm text-neutral-600">Loading users…</div>}
                            {usersError && <div className="p-4 text-sm text-red-600">{usersError}</div>}
                            {!usersLoading && !usersError && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-neutral-100 text-neutral-700">
                                            <tr>
                                                <th className="text-left px-4 py-3">Name</th>
                                                <th className="text-left px-4 py-3">Email</th>
                                                <th className="text-left px-4 py-3">Role</th>
                                                <th className="text-left px-4 py-3">Created</th>
                                                <th className="text-right px-4 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u._id} className="border-t border-neutral-100">
                                                    <td className="px-4 py-3 font-medium">{u.username || u.firstName || u.email}</td>
                                                    <td className="px-4 py-3 text-neutral-700">{u.email}</td>
                                                    <td className="px-4 py-3 text-neutral-700">{u.role || "user"}</td>
                                                    <td className="px-4 py-3 text-neutral-600">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                                                    <td className="px-4 py-3 text-right flex justify-end gap-3">
                                                        <button onClick={() => startEditUser(u)} className="text-sm text-orange-600 hover:underline">Edit</button>
                                                        <button onClick={() => deleteUser(u._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
                            <h3 className="font-semibold mb-3">{editingUserId ? "Edit User" : "Create User"}</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-neutral-600">Email</label>
                                    <input value={userForm.email} onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-600">Password</label>
                                    <input type="password" value={userForm.password} onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-600">Confirm Password</label>
                                    <input type="password" value={userForm.confirmPassword} onChange={(e) => setUserForm((f) => ({ ...f, confirmPassword: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-600">Username</label>
                                    <input value={userForm.username} onChange={(e) => setUserForm((f) => ({ ...f, username: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-600">Role</label>
                                    <select value={userForm.role} onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            if (!token) return;
                                            const trimmedPassword = (userForm.password || "").trim();
                                            const trimmedConfirm = (userForm.confirmPassword || "").trim();

                                            if (!editingUserId) {
                                                if (!trimmedPassword || trimmedPassword !== trimmedConfirm) {
                                                    alert('Passwords do not match');
                                                    return;
                                                }
                                            } else if (trimmedPassword || trimmedConfirm) {
                                                if (trimmedPassword !== trimmedConfirm) {
                                                    alert('Passwords do not match');
                                                    return;
                                                }
                                            }

                                            setSavingUser(true);
                                            const payload: any = {
                                                username: userForm.username.trim(),
                                                email: userForm.email.trim(),
                                                role: userForm.role === 'admin' ? 'admin' : 'user',
                                            };
                                            if (trimmedPassword) {
                                                payload.password = trimmedPassword;
                                                payload.confirmPassword = trimmedConfirm || trimmedPassword;
                                            }

                                            const path = editingUserId ? `/admin/users/${editingUserId}` : '/admin/users';
                                            const method = editingUserId ? 'PUT' : 'POST';
                                            const res = await apiSend(path, token, method, payload);
                                            setSavingUser(false);
                                            if (!res.ok) { alert('Failed to save user'); return; }
                                            setUserForm({ username: '', email: '', password: '', confirmPassword: '', role: 'user' });
                                            setEditingUserId(null);
                                            loadUsers();
                                        }}
                                        disabled={savingUser}
                                        className="flex-1 bg-orange-600 text-white rounded px-3 py-2 text-sm"
                                    >
                                        {savingUser ? (editingUserId ? 'Saving…' : 'Creating…') : editingUserId ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        onClick={() => { setUserForm({ username: '', email: '', password: '', confirmPassword: '', role: 'user' }); setEditingUserId(null); }}
                                        className="px-3 py-2 text-sm border rounded"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {tab === "bookings" && (
                    <section className="mt-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                            <h2 className="font-semibold">Bookings</h2>
                            <button onClick={loadBookings} className="text-sm px-3 py-2 rounded border">Refresh</button>
                        </div>
                        {bookingsLoading && <div className="p-4 text-sm text-neutral-600">Loading bookings…</div>}
                        {bookingsError && <div className="p-4 text-sm text-red-600">{bookingsError}</div>}
                        {!bookingsLoading && !bookingsError && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-neutral-100 text-neutral-700">
                                        <tr>
                                            <th className="text-left px-4 py-3">Package</th>
                                            <th className="text-left px-4 py-3">Day / Time</th>
                                            <th className="text-left px-4 py-3">Total</th>
                                            <th className="text-left px-4 py-3">Status</th>
                                            <th className="text-left px-4 py-3">User</th>
                                            <th className="text-left px-4 py-3">Created</th>
                                            <th className="text-right px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((b) => (
                                            <tr key={b._id} className="border-t border-neutral-100">
                                                <td className="px-4 py-3 font-medium">{b.packageName || b.package || "—"}</td>
                                                <td className="px-4 py-3 text-neutral-700">{b.day || "—"} {b.time ? `• ${b.time}` : ""}</td>
                                                <td className="px-4 py-3 text-neutral-900">₹{Number(b.total || 0).toFixed(2)}</td>
                                                <td className="px-4 py-3"><span className="inline-flex px-2 py-1 rounded-full text-xs bg-neutral-100 text-neutral-700">{b.status || "pending"}</span></td>
                                                <td className="px-4 py-3 text-neutral-700">{b.userId || "—"}</td>
                                                <td className="px-4 py-3 text-neutral-600">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}</td>
                                                <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                    <select
                                                        value={b.status || 'pending'}
                                                        onChange={(e) => updateBookingStatus(b._id, e.target.value)}
                                                        className="border rounded px-2 py-1 text-xs"
                                                    >
                                                        {['pending','accepted','dispatched','delivered','cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    <button onClick={() => cancelBooking(b._id)} className="text-xs text-red-600 hover:underline">Cancel</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {tab === "items" && (
                    <section className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                                <h2 className="font-semibold">Menu Items</h2>
                                <button onClick={loadItems} className="text-sm px-3 py-2 rounded border">Refresh</button>
                            </div>
                            {itemsLoading && <div className="p-4 text-sm text-neutral-600">Loading items…</div>}
                            {itemsError && <div className="p-4 text-sm text-red-600">{itemsError}</div>}
                            {!itemsLoading && !itemsError && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-neutral-100 text-neutral-700">
                                            <tr>
                                                <th className="text-left px-4 py-3">Name</th>
                                                <th className="text-left px-4 py-3">Category</th>
                                                <th className="text-left px-4 py-3">Price</th>
                                                <th className="text-left px-4 py-3">Available</th>
                                                <th className="text-right px-4 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((it) => (
                                                <tr key={it._id || it.id} className="border-t border-neutral-100">
                                                    <td className="px-4 py-3 font-medium">{it.name || it.title || it.id}</td>
                                                    <td className="px-4 py-3 text-neutral-700">{it.category || "—"}</td>
                                                    <td className="px-4 py-3 text-neutral-900">₹{Number(it.price || 0).toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-neutral-700">{it.available === false ? "No" : "Yes"}</td>
                                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                        <button onClick={() => editItem(it)} className="text-sm text-orange-600 hover:underline">Edit</button>
                                                        <button onClick={() => deleteItem(it._id || it.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
                            <h3 className="font-semibold mb-3">{itemForm._id ? "Edit Item" : "Add Item"}</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-neutral-600">Name</label>
                                    <input value={itemForm.name} onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" placeholder="Paneer Butter Masala" />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-600">Description</label>
                                    <textarea value={itemForm.description} onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" rows={3} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-neutral-600">Image</label>
                                    <div className="text-xs text-neutral-500">Choose a file from your computer to send as the item image.</div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="text-sm"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) { setItemImagePreview(undefined); setItemForm((f) => ({ ...f, image: "" })); return; }
                                                // Guard against very large files that could trigger 413 when sent as data URLs
                                                const maxBytes = 1 * 1024 * 1024; // 1MB
                                                if (file.size > maxBytes) {
                                                    alert('Image too large. Please pick a file under 1MB.');
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    const dataUrl = reader.result as string;
                                                    setItemImagePreview(dataUrl);
                                                    setItemForm((f) => ({ ...f, image: dataUrl }));
                                                };
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                        {(itemImagePreview || itemForm.image) && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={itemImagePreview || itemForm.image} alt="preview" className="mt-2 h-24 w-32 object-cover rounded" />
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-neutral-600">Price</label>
                                        <input type="number" step="0.01" value={itemForm.price ?? 0} onChange={(e) => setItemForm((f) => ({ ...f, price: Number(e.target.value) }))} className="w-full border rounded px-3 py-2 mt-1" placeholder="6.5" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-600">Category</label>
                                        <input value={itemForm.category || ""} onChange={(e) => setItemForm((f) => ({ ...f, category: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" placeholder="Vegetarian" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-600">Available</label>
                                    <select value={itemForm.available ? "true" : "false"} onChange={(e) => setItemForm((f) => ({ ...f, available: e.target.value === "true" }))} className="w-full border rounded px-3 py-2 mt-1">
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={saveItem} disabled={savingItem} className="flex-1 bg-orange-600 text-white rounded px-3 py-2 text-sm">{savingItem ? "Saving…" : itemForm._id ? "Update" : "Add"}</button>
                                    {itemForm._id && <button onClick={() => { setItemForm({ name: "", description: "", price: 0, category: "", available: true, image: "" }); setItemImagePreview(undefined); }} className="px-3 py-2 text-sm border rounded">Clear</button>}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}