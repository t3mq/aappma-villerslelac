export default function FishingTypes() {
  const types = [
    {
      title: 'Peche a la mouche',
      description:
        "L'art de la presentation. Sechez vos mouches sur les eaux cristallines du Doubs et du Dessoubre.",
      image: '/photos/PHOTO-2025-02-01-14-05-07.jpg',
    },
    {
      title: 'Peche au lancer',
      description:
        "Cuilleres, leurres souples ou poissons nageurs : explorez les postes des gorges au rythme du courant.",
      image: '/photos/PHOTO-2025-02-01-14-06-44.jpg',
    },
    {
      title: 'Peche au toc',
      description:
        "Technique traditionnelle par excellence, la derive naturelle au plus pres des veines d'eau.",
      image: '/photos/PHOTO-2025-02-01-14-02-05.jpg',
    },
    {
      title: 'Peche au coup',
      description:
        "Au bord du lac ou sur les berges calmes du Doubs, une peche contemplative accessible a tous.",
      image: '/photos/PHOTO-2025-02-01-13-53-18.jpg',
    },
  ];

  return (
    <section id="peche" className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-6">
            Une eau,{' '}
            <span className="block">
              mille facons de <em className="italic font-normal">la vivre.</em>
            </span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            Que vous soyez moucheur passionne, adepte du lancer ou amateur de peche
            tranquille, nos eaux sauront vous combler.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((t) => (
            <div
              key={t.title}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative overflow-hidden aspect-[3/2]">
                <img
                  src={t.image}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-green-dark mb-2">
                  {t.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
