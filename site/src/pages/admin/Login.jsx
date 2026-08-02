import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
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
              Espace administration
            </h1>
            <p className="text-gray-500 text-sm">
              Connectez-vous pour gerer le site.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 focus:border-green-dark transition-colors"
                placeholder="vous@exemple.fr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 focus:border-green-dark transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 bg-green-dark hover:bg-green-medium text-white font-semibold rounded-lg text-sm transition-colors cursor-pointer"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
