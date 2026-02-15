const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5050';

export async function postForgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error('Invalid response from server');
  }
  if (!res.ok) throw new Error(json?.message || 'Failed to send reset email');
  return json;
}

export async function postResetPassword(token: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  return res.json();
}

export async function postLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function fetchAdminUsers(token: string, page = 1, limit = 10) {
  const url = `${API_BASE}/api/admin/users?page=${page}&limit=${limit}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  let json: any = null;
  try {
    json = await res.json();
  } catch (e) {
    json = null;
  }
  return { ok: res.ok, status: res.status, data: json };
}

export async function deleteAdminUser(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  return res;
}

export async function fetchUserById(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
}

export async function updateUserById(token: string, id: string, data: any) {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export default API_BASE;
