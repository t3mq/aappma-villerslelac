import { ArrowRight } from 'lucide-react';

export default function Territory() {
  const waterways = [
    {
      name: 'Le Doubs',
      tag: 'riviere sauvage',
      description:
        "Une riviere capricieuse aux truites farios, entre courants vifs et fosses profondes. Le terrain de jeu reve du pecheur a la mouche.",
      image: '/photos/PHOTO-2025-02-01-14-02-05.jpg',
    },
    {
      name: 'Lac de Chaillexon',
      tag: 'joyau alpin',
      description:
        "Cinq kilometres d'eaux turquoise enchassees entre des falaises de calcaires vertigineuses. Brochets, perches, sandre. Une cathedrale naturelle.",
      image: '/photos/PHOTO-2025-02-01-13-53-18.jpg',
    },
    {
      name: 'Lac de Moron',
      tag: 'lac reservoir',
      description:
        "Le miroir du Haut-Doubs. Un plan d'eau paisible, ideal pour la peche en famille au coucher du soleil.",
      image: '/photos/PHOTO-2025-02-01-14-02-29.jpg',
    },
  ];

  return (
    <section id="territoire" className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-6">
            Trois cours,{' '}
            <span className="block">
              un meme <em className="italic font-normal">territoire.</em>
            </span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            Notre AAPPMA gere un territoire d'exception au coeur du Haut-Doubs,
            ou trois cours d'eau se rejoignent pour offrir une diversite
            halieutique rare.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
          {waterways.map((w) => (
            <div
              key={w.name}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
            >
              {/* Background image */}
              <img
                src={w.image}
                alt={w.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full border border-white/20">
                  {w.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                <h3 className="font-heading text-2xl lg:text-3xl text-white font-semibold mb-2">
                  {w.name}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-3">
                  {w.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-gold text-sm font-medium group-hover:gap-2.5 transition-all">
                  Explorer <ArrowRight size={15} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
