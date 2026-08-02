import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Newspaper, CalendarDays, FileText, Users, Image, LogOut, Home } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { authed, logout } = useAuth();

  useEffect(() => {
    if (!authed) navigate('/admin/login');
  }, [authed, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const links = [
    { to: '/admin', icon: Home, label: 'Dashboard', end: true },
    { to: '/admin/actualites', icon: Newspaper, label: 'Actualites' },
    { to: '/admin/evenements', icon: CalendarDays, label: 'Evenements' },
    { to: '/admin/documents', icon: FileText, label: 'Documents' },
    { to: '/admin/adherents', icon: Users, label: 'Adherents' },
    { to: '/admin/galerie', icon: Image, label: 'Galerie' },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
    }`;

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-green-dark flex-col fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
          <img src="/photos/PHOTO-2025-02-01-13-26-33.jpg" alt="AAPPMA" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-heading text-white font-semibold">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-4 space-y-1">
          <NavLink to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Home size={18} />
            Voir le site
          </NavLink>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-red-300 hover:bg-white/5 transition-colors w-full cursor-pointer">
            <LogOut size={18} />
            Deconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-green-dark h-14 flex items-center justify-between px-4">
        <span className="font-heading text-white font-semibold text-sm">Admin AAPPMA</span>
        <div className="flex items-center gap-3">
          <NavLink to="/" className="text-white/60 hover:text-white"><Home size={18} /></NavLink>
          <button onClick={handleLogout} className="text-white/60 hover:text-red-300 cursor-pointer"><LogOut size={18} /></button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-green-dark border-t border-white/10 flex justify-around py-2">
        {links.slice(0, 5).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-medium px-2 py-1 ${isActive ? 'text-white' : 'text-white/50'}`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
