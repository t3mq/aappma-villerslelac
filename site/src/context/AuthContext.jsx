import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, UNAUTHORIZED_EVENT } from '../api';

const TOKEN_KEY = 'aappma_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  // `loading` est exposé plutôt que de bloquer le rendu : le site public
  // s'affiche immédiatement, seul l'espace d'administration attend la
  // vérification du jeton.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(() => setAuthed(true))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // Un jeton peut expirer entre deux requêtes : l'API signale les 401 et
  // l'interface repasse en « déconnecté » sans attendre un rechargement.
  useEffect(() => {
    const onUnauthorized = () => setAuthed(false);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const { token } = await authApi.login(email, password);
      localStorage.setItem(TOKEN_KEY, token);
      setAuthed(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ authed, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider.');
  return ctx;
}
