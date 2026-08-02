import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
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
                <span className="text-sm text-white/60 block">
                  Villers-le-Lac
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Association agreee pour la peche et la protection du milieu
              aquatique de Villers-le-Lac.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                ['Accueil', '/'],
                ['Actualites', '/actualites'],
                ['Evenements', '/evenements'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Association */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              L'association
            </h4>
            <ul className="space-y-2.5">
              {[
                ["L'equipe", '/#equipe'],
                ['Nos actions', '/#actions'],
                ['Contact', '/#contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </a>
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
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>Villers-le-Lac, 25130</li>
              <li>
                <a
                  href="mailto:contact@aappma-villerslac.fr"
                  className="hover:text-white transition-colors"
                >
                  contact@aappma-villerslac.fr
                </a>
              </li>
              <li>Permanences : samedi 9h-12h</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} AAPPMA Villers-le-Lac. Tous droits reserves.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40">Mentions legales</span>
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
