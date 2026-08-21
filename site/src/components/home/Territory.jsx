const WATERWAYS = [
  {
    name: 'Le Doubs',
    tag: 'rivière sauvage',
    description:
      'Une rivière capricieuse aux truites farios, entre courants vifs et fosses profondes. Le terrain de jeu rêvé du pêcheur à la mouche.',
    image: '/photos/PHOTO-2025-02-01-14-02-05.jpg',
  },
  {
    name: 'Lac de Chaillexon',
    tag: 'joyau alpin',
    description:
      'Cinq kilomètres d’eaux turquoise enchâssées entre des falaises calcaires vertigineuses. Brochets, perches, sandres : une cathédrale naturelle.',
    image: '/photos/PHOTO-2025-02-01-13-53-18.jpg',
  },
  {
    name: 'Lac de Moron',
    tag: 'lac réservoir',
    description:
      'Le miroir du Haut-Doubs. Un plan d’eau paisible, idéal pour la pêche en famille au coucher du soleil.',
    image: '/photos/PHOTO-2025-02-01-14-02-29.jpg',
  },
];

export default function Territory() {
  return (
    <section id="territoire" className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-6">
            Trois cours,{' '}
            <span className="block">
              un même <em className="italic font-normal">territoire.</em>
            </span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            Notre AAPPMA gère un territoire d’exception au cœur du Haut-Doubs,
            où trois cours d’eau se rejoignent pour offrir une diversité
            halieutique rare.
          </p>
        </div>

        {/* Grille de cartes */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
          {WATERWAYS.map((w) => (
            <div
              key={w.name}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
            >
              <img
                src={w.image}
                alt={w.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Étiquette */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full border border-white/20">
                  {w.tag}
                </span>
              </div>

              {/* Contenu */}
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                <h3 className="font-heading text-2xl lg:text-3xl text-white font-semibold mb-2">
                  {w.name}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {w.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
