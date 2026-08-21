import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Newspaper, CalendarDays, FileText, Users, Image, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// `short` sert à la barre du bas sur mobile : six libellés complets n'y
// tiennent pas, et tronquer la liste rendait la galerie inaccessible.
const LINKS = [
  { to: '/admin', icon: Home, label: 'Tableau de bord', short: 'Accueil', end: true },
  { to: '/admin/actualites', icon: Newspaper, label: 'Actualités', short: 'Actus' },
  { to: '/admin/evenements', icon: CalendarDays, label: 'Événements', short: 'Agenda' },
  { to: '/admin/documents', icon: FileText, label: 'Documents', short: 'Docs' },
  { to: '/admin/adherents', icon: Users, label: 'Adhérents', short: 'Membres' },
  { to: '/admin/galerie', icon: Image, label: 'Galerie', short: 'Photos' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { authed, loading, logout } = useAuth();

  // Tant que le jeton n'a pas été vérifié, on n'affiche ni l'admin ni une
  // redirection : cela évitait auparavant un passage éclair par la page
  // de connexion à chaque rafraîchissement.
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 text-sm text-gray-500">
        Chargement…
      </div>
    );
  }

  if (!authed) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Barre latérale */}
      <aside className="hidden lg:flex w-64 bg-green-dark flex-col fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
          <img
            src="/photos/PHOTO-2025-02-01-13-26-33.jpg"
            alt="AAPPMA Villers-le-Lac"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-heading text-white font-semibold">Administration</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-4 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home size={18} />
            Voir le site
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-red-300 hover:bg-white/5 transition-colors w-full cursor-pointer"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* En-tête mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-green-dark h-14 flex items-center justify-between px-4">
        <span className="font-heading text-white font-semibold text-sm">Administration AAPPMA</span>
        <div className="flex items-center gap-3">
          <NavLink to="/" className="text-white/60 hover:text-white" aria-label="Voir le site">
            <Home size={18} />
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-red-300 cursor-pointer"
            aria-label="Déconnexion"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Navigation mobile (bas d'écran) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-green-dark border-t border-white/10 flex justify-around py-2">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-medium px-2 py-1 text-center ${
                isActive ? 'text-white' : 'text-white/50'
              }`
            }
          >
            <link.icon size={18} />
            {link.short}
          </NavLink>
        ))}
      </nav>

      {/* Contenu */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
