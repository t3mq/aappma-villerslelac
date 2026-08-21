import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/admin/Alert';
import { INPUT_CLASS } from '../../components/admin/Field';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { authed, loading, login } = useAuth();

  if (!loading && authed) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
  };

  return (
    <main className="pt-28 pb-20 lg:pt-36 lg:pb-28 bg-cream min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-green-dark/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-green-dark" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-green-dark mb-1">
              Espace d’administration
            </h1>
            <p className="text-gray-500 text-sm">Connectez-vous pour gérer le site.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={INPUT_CLASS}
                placeholder="vous@exemple.fr"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={INPUT_CLASS}
                placeholder="••••••••"
              />
            </div>

            <Alert>{error}</Alert>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 bg-green-dark hover:bg-green-medium text-white font-semibold rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
