import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const TOKEN_KEY = 'aappma_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then(() => setAuthed(true))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
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

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
