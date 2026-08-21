import { Link } from 'react-router-dom';
import { Fish } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="pt-28 pb-20 lg:pt-36 lg:pb-28 bg-cream min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-dark/10 flex items-center justify-center mx-auto mb-6">
          <Fish size={28} className="text-green-dark" />
        </div>
        <p className="font-heading text-5xl font-semibold text-green-dark mb-3">404</p>
        <h1 className="font-heading text-2xl font-semibold text-green-dark mb-3">
          Cette page a filé entre les mailles.
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-7 py-3 bg-gold hover:bg-gold-light text-green-dark font-semibold rounded-lg transition-colors"
        >
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
