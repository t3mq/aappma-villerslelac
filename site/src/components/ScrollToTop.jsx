import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-green-dark hover:bg-green-medium text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
      aria-label="Retour en haut"
    >
      <ArrowUp size={20} />
    </button>
  );
}
