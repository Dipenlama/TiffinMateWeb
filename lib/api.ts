export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5050/api';

async function handleResp(resp: Response) {
  if (!resp.ok) throw new Error((await resp.json().catch(() => ({}))).message || resp.statusText);
  return resp.json().catch(() => ({}));
}

export async function postForgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResp(res);
}

export async function postResetPassword(token: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  return handleResp(res);
}

export async function postLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResp(res);
}

export async function fetchAdminUsers(token: string, page = 1, limit = 10) {
  const url = `${API_BASE}/admin/users?page=${page}&limit=${limit}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  return handleResp(res);
}

export async function deleteAdminUser(token: string, id: string) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  return res;
}

export async function fetchUserById(token: string, id: string) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
}

export async function updateUserById(token: string, id: string, data: any) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchMenu() {
  const res = await fetch(`${API_BASE}/menu`);
  return handleResp(res);
}

export async function fetchMenuItem(id: string) {
  const res = await fetch(`${API_BASE}/menu/${id}`);
  return handleResp(res);
}

export async function createOrder(payload: { items: any[]; address: string; payment: string }) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResp(res);
}

export async function createBooking(payload: any, idempotencyKey?: string) {
  const headers: any = { 'Content-Type': 'application/json' };
  // Attach bearer token when available (frontend stored token)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json };
  } catch (e) {
    return { ok: false, status: 0, data: { error: String(e) } };
  }
}

export async function createPaymentSession(bookingId: string) {
  try {
    const res = await fetch(`${API_BASE}/payments/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ bookingId }),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json };
  } catch (e) {
    return { ok: false, status: 0, data: { error: String(e) } };
  }
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, { credentials: 'include' });
  return handleResp(res);
}

export async function fetchOrderById(id: string) {
  const res = await fetch(`${API_BASE}/orders/${id}`, { credentials: 'include' });
  return handleResp(res);
}

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
  return handleResp(res);
}

export async function fetchAddresses() {
  const res = await fetch(`${API_BASE}/profile/addresses`, { credentials: 'include' });
  return handleResp(res);
}

export async function addAddress(addr: string) {
  const res = await fetch(`${API_BASE}/profile/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ address: addr }),
  });
  return handleResp(res);
}

export async function fetchAdminOrders() {
  const res = await fetch(`${API_BASE}/admin/orders`, { credentials: 'include' });
  return handleResp(res);
}

export async function updateAdminOrderStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/admin/orders/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  return handleResp(res);
}
