const API = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('aappma_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('aappma_token');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

// Auth
export const authApi = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
};

// News
export const newsApi = {
  getAll: () => request('/news'),
  create: (data) => request('/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/news/${id}`, { method: 'DELETE' }),
};

// Events
export const eventsApi = {
  getAll: () => request('/events'),
  create: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
};

// Documents
export const documentsApi = {
  getAll: () => request('/documents'),
  create: (data) => request('/documents', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/documents/${id}`, { method: 'DELETE' }),
};

// Members
export const membersApi = {
  getAll: () => request('/members'),
  create: (data) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/members/${id}`, { method: 'DELETE' }),
};

// Photos
export const photosApi = {
  getAll: () => request('/photos'),
  create: (data) => request('/photos', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/photos/${id}`, { method: 'DELETE' }),
};
