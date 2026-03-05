// Derive API base from env: prefer full base, otherwise combine origin + prefix for flexible setups
const envOrigin = (process.env.NEXT_PUBLIC_API_ORIGIN || '').trim();
const envPrefix = (process.env.NEXT_PUBLIC_API_PREFIX || '').trim();
const envBase = (process.env.NEXT_PUBLIC_API_BASE || '').trim();
const derivedBase = envOrigin && envPrefix
  ? `${envOrigin.replace(/\/$/, '')}${envPrefix.startsWith('/') ? envPrefix : `/${envPrefix}`}`
  : '';
export const API_BASE = envBase || derivedBase || 'http://localhost:5050/api';

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

export async function postRegister(fullName: string, email: string, password: string, confirmPassword: string) {
  // Backend expects `username` and `confirmPassword`, so map full name into
  // username and send both password fields.
  const payload = { username: fullName, name: fullName, fullName, email, password, confirmPassword };
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
  const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json().catch(() => ({}));
  const scrubbed = (() => {
    const clone = typeof json === 'object' && json !== null ? { ...json } : json;
    if (clone?.data?.password) delete clone.data.password;
    if (clone?.password) delete clone.password;
    return clone;
  })();
  return { ok: res.ok, status: res.status, data: scrubbed };
}

export async function updateUserById(token: string, id: string, data: any) {
  const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json };
}

export async function fetchMenu() {
  // Primary: /items (per backend URL provided), fallback: /menu for legacy
  const tryFetch = async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`);
    return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
  };

  const primary = await tryFetch('/items');
  if (primary.ok) return primary.data;

  const fallback = await tryFetch('/menu');
  if (fallback.ok) return fallback.data;

  // If both fail, throw with best effort message
  const err = primary.data?.message || fallback.data?.message || 'Failed to fetch menu/items';
  throw new Error(err);
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

  const postTo = async (url: string) => {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json } as const;
  };

  const attempts = [
    `${API_BASE}/bookings`,
    `${API_BASE}/booking`,
    `/api/bookings`,
    `/api/booking`,
  ];

  for (const url of attempts) {
    try {
      const res = await postTo(url);
      if (res.status !== 404) return res;
    } catch (e) {
      // continue to next attempt
      continue;
    }
  }

  return { ok: false, status: 0, data: { error: 'All booking endpoints failed' } };
}

export async function createPaymentSession(bookingId: string) {
  try {
    const res = await fetch(`${API_BASE}/payments/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  const headers: any = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const getFrom = async (url: string) => {
    const res = await fetch(url, { credentials: 'include', headers });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json } as const;
  };

  const attempts = [
    `${API_BASE}/auth/me`,
    `${API_BASE}/profile`,
    `${API_BASE}/me`,
    `${API_BASE}/users/me`,
  ];

  let lastErr: string | null = null;
  for (const url of attempts) {
    try {
      const res = await getFrom(url);
      if (res.status === 404) continue;
      if (!res.ok) {
        lastErr = res.data?.message || res.data?.error || 'Failed to fetch profile';
        continue;
      }
      return res.data?.data || res.data?.user || res.data || {};
    } catch (e: any) {
      lastErr = e?.message || 'Failed to fetch profile';
    }
  }

  throw new Error(lastErr || 'Failed to fetch profile');
}

export async function updateProfile(data: any) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const putTo = async (url: string) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json } as const;
  };

  const attempts = [
    `/api/users/me`, // explicit frontend route for current user update
    `${API_BASE}/users/me`,
    `${API_BASE}/profile`,
    `${API_BASE}/auth/me`,
  ];

  for (const url of attempts) {
    try {
      const res = await putTo(url);
      if (res.status !== 404) return res;
    } catch (e) {
      continue;
    }
  }

  return { ok: false, status: 0, data: { error: 'All profile update endpoints failed' } };
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const postTo = async (url: string) => {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json } as const;
  };

  const attempts = [
    `${API_BASE}/auth/change-password`,
    `${API_BASE}/profile/change-password`,
  ];

  for (const url of attempts) {
    try {
      const res = await postTo(url);
      if (res.status !== 404) return res;
    } catch (e) {
      continue;
    }
  }

  return { ok: false, status: 0, data: { error: 'All change-password endpoints failed' } };
}

export async function fetchAddresses() {
  const headers: any = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const getFrom = async (url: string) => {
    const res = await fetch(url, { credentials: 'include', headers });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json } as const;
  };

  const attempts = [
    `${API_BASE}/profile/addresses`,
    `${API_BASE}/addresses`,
    `${API_BASE}/profile/address`,
    `${API_BASE}/auth/addresses`,
    `${API_BASE}/users/addresses`,
  ];

  let lastErr: string | null = null;
  for (const url of attempts) {
    try {
      const res = await getFrom(url);
      if (res.status === 404) continue; // try next shape
      if (!res.ok) {
        lastErr = res.data?.message || res.data?.error || 'Failed to fetch addresses';
        continue;
      }
      return res.data?.data || res.data?.addresses || res.data || [];
    } catch (e: any) {
      lastErr = e?.message || 'Failed to fetch addresses';
      continue;
    }
  }

  if (lastErr) throw new Error(lastErr);
  return []; // all 404s
}

export async function addAddress(addr: string) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const postTo = async (url: string) => {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ address: addr }),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json } as const;
  };

  const attempts = [
    `${API_BASE}/profile/addresses`,
    `${API_BASE}/addresses`,
    `${API_BASE}/profile/address`,
    `${API_BASE}/auth/addresses`,
    `${API_BASE}/users/addresses`,
  ];

  let lastErr: string | null = null;
  for (const url of attempts) {
    try {
      const res = await postTo(url);
      if (res.status === 404) continue;
      if (!res.ok) {
        lastErr = res.data?.message || res.data?.error || 'Failed to add address';
        continue;
      }
      return res.data;
    } catch (e: any) {
      lastErr = e?.message || 'Failed to add address';
      continue;
    }
  }

  throw new Error(lastErr || 'Failed to add address');
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
