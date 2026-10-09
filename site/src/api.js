const API = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'aappma_token';

// Émis dès qu'une requête revient en 401 : le contexte d'authentification s'y
// abonne pour repasser l'interface en « déconnecté ». Sans cela, l'admin
// resterait affiché comme connecté avec un jeton expiré.
export const UNAUTHORIZED_EVENT = 'aappma:unauthorized';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Renvoie la réponse brute (succès uniquement) : utilisé tel quel pour les
// téléchargements de fichiers, via request() pour les réponses JSON.
async function send(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  // Pour un FormData, le navigateur fixe lui-même le Content-Type (avec la
  // frontière multipart) : le forcer casserait l'envoi.
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API}${path}`, { ...options, headers });
  } catch {
    throw new Error('Serveur injoignable. Vérifiez votre connexion.');
  }

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!res.ok) {
    // Le corps n'est pas toujours du JSON (erreur renvoyée par le proxy,
    // réponse vide…) : on ne casse pas sur un parsing impossible.
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `Erreur serveur (${res.status}).`);
  }
  return res;
}

async function request(path, options) {
  const res = await send(path, options);
  return res.json().catch(() => null);
}

// Authentification
export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
};

// Actualités
export const newsApi = {
  getAll: () => request('/news'),
  create: (data) => request('/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/news/${id}`, { method: 'DELETE' }),
};

// Événements
export const eventsApi = {
  getAll: () => request('/events'),
  create: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
};

// Espace documents — réservé à l'administration, jamais exposé aux visiteurs.
export const foldersApi = {
  getAll: () => request('/folders'),
  create: (data) => request('/folders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/folders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/folders/${id}`, { method: 'DELETE' }),
};

export const documentsApi = {
  getAll: () => request('/documents'),
  upload: (files, folderId) => {
    const body = new FormData();
    if (folderId !== null) body.append('folderId', String(folderId));
    for (const file of files) body.append('files', file);
    return request('/documents', { method: 'POST', body });
  },
  update: (id, data) => request(`/documents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/documents/${id}`, { method: 'DELETE' }),
  // Le fichier exige le jeton d'authentification : un simple lien <a href> ne
  // l'enverrait pas, d'où la récupération en Blob.
  download: async (id) => (await send(`/documents/${id}/file`)).blob(),
};

// Adhérents
export const membersApi = {
  getAll: () => request('/members'),
  create: (data) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/members/${id}`, { method: 'DELETE' }),
};

// Galerie photos
export const photosApi = {
  getAll: () => request('/photos'),
  create: (data) => request('/photos', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/photos/${id}`, { method: 'DELETE' }),
};
