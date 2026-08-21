import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          src="/photos/PHOTO-2025-02-01-14-05-07.jpg"
          alt="Gorges du Doubs"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white font-semibold leading-tight mb-6">
          Vivez la pêche{' '}
          <em className="italic font-normal">autrement.</em>
        </h1>
        <p className="text-white/85 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Au cœur des gorges du Doubs, découvrez un territoire préservé
          où la pêche se vit avec passion et respect.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.cartedepeche.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-gold hover:bg-gold-light text-green-dark font-semibold rounded-lg text-base transition-colors"
          >
            Prendre ma carte
          </a>
          <a
            href="#territoire"
            className="px-8 py-3.5 border-2 border-white/60 hover:border-white text-white font-semibold rounded-lg text-base transition-colors"
          >
            Découvrir le territoire
          </a>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <a
        href="#territoire"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white animate-bounce transition-colors"
        aria-label="Aller à la section Territoire"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
