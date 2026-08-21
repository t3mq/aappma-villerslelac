import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Une ancre (`/#territoire`) peut venir d'une autre page : on attend le
    // rendu de la section avant de l'atteindre, sinon on remonte simplement.
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
