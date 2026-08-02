import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const links = [
    { label: 'Territoire', href: '/#territoire' },
    { label: 'Actualites', href: '/actualites' },
    { label: 'Evenements', href: '/evenements' },
    { label: 'Contact', href: '/#contact' },
  ];

  const needsSolid = scrolled || open || !isHome;

  const handleNavClick = (href) => {
    setOpen(false);
    if (href.startsWith('/#') && isHome) {
      const el = document.querySelector(href.replace('/', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        needsSolid
          ? 'bg-green-dark/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-18 lg:h-22">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/photos/PHOTO-2025-02-01-13-26-33.jpg"
              alt="AAPPMA Villers-le-Lac"
              className="h-9 w-9 rounded-full object-cover border border-white/30"
            />
            <span className="font-heading text-white text-lg font-semibold tracking-wide">
              AAPPMA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map((link) =>
              link.href.startsWith('/#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white/75 hover:text-white text-[13px] font-medium tracking-wide uppercase transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-[13px] font-medium tracking-wide uppercase transition-colors ${
                    location.pathname === link.href
                      ? 'text-white'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="https://www.cartedepeche.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-5 py-2 bg-gold hover:bg-gold-light text-green-dark text-[13px] font-semibold rounded-md transition-colors"
            >
              Ma carte
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white/80 hover:text-white p-2 transition-colors"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 pb-5 bg-green-dark/95 backdrop-blur-md">
          <nav className="px-5 pt-4 space-y-4">
            {links.map((link) =>
              link.href.startsWith('/#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block text-white/80 hover:text-white text-sm font-medium tracking-wide uppercase transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-white/80 hover:text-white text-sm font-medium tracking-wide uppercase transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="https://www.cartedepeche.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-5 text-center px-5 py-2.5 bg-gold hover:bg-gold-light text-green-dark text-sm font-semibold rounded-md transition-colors"
            >
              Ma carte
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
