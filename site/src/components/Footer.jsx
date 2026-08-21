import { Link } from 'react-router-dom';

const NAV_LINKS = [
  ['Accueil', '/'],
  ['Actualités', '/actualites'],
  ['Événements', '/evenements'],
];

const ASSOCIATION_LINKS = [
  ['L’équipe', '/#equipe'],
  ['Nos actions', '/#actions'],
  ['Contact', '/#contact'],
];

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Identité */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/photos/PHOTO-2025-02-01-13-26-33.jpg"
                alt="AAPPMA Villers-le-Lac"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <span className="font-heading text-lg text-white font-semibold block">
                  AAPPMA
                </span>
                <span className="text-sm text-white/60 block">Villers-le-Lac</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Association agréée pour la pêche et la protection du milieu
              aquatique de Villers-le-Lac.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h2>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Association */}
          <div>
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              L’association
            </h2>
            <ul className="space-y-2.5">
              {ASSOCIATION_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.cartedepeche.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold hover:text-gold-light transition-colors"
                >
                  Prendre ma carte
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>Villers-le-Lac, 25130</li>
              <li>
                <a
                  href="mailto:sebastiendrozgrey@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  sebastiendrozgrey@gmail.com
                </a>
              </li>
              <li>Permanences : samedi 9 h - 12 h</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bandeau bas */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AAPPMA Villers-le-Lac. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40">Mentions légales</span>
            <Link
              to="/admin/login"
              className="text-xs text-white/25 hover:text-white/40 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
