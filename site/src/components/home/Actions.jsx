import { Leaf, Wrench, Fish } from 'lucide-react';

export default function Actions() {
  const actions = [
    {
      icon: Leaf,
      title: 'Nettoyage des berges',
      description:
        "Chaque annee, nos benevoles se retroussent les manches pour nettoyer les rives du Doubs et du lac. Des centaines de kilos de dechets collectes grace a la mobilisation de tous.",
      images: [
        '/photos/PHOTO-2024-11-03-11-12-58.jpg',
        '/photos/PHOTO-2025-11-15-10-26-58.jpg',
      ],
    },
    {
      icon: Fish,
      title: 'Alevinages raisonnes',
      description:
        "Pour soutenir les populations piscicoles, nous procedons a des alevinages cibles en truites fario et ombres, en privilege toujours les souches locales.",
      images: [
        '/photos/PHOTO-2024-11-03-11-12-48.jpg',
        '/photos/PHOTO-2025-11-15-10-26-56.jpg',
      ],
    },
    {
      icon: Wrench,
      title: 'Travaux du local',
      description:
        "Renovation et amenagement de notre local associatif : un lieu de rencontre et de convivialite pour tous les membres.",
      images: [
        '/photos/PHOTO-2025-05-24-12-41-28.jpg',
      ],
    },
  ];

  return (
    <section id="actions" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-6">
            On agit,{' '}
            <em className="italic font-normal">vraiment.</em>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            Proteger nos cours d'eau, c'est agir concretement. Voici nos
            actions sur le terrain.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-10 lg:space-y-16">
          {actions.map((action, idx) => (
            <div
              key={action.title}
              className={`flex flex-col ${
                idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 lg:gap-12 items-center`}
            >
              {/* Images */}
              <div className="w-full lg:w-1/2">
                {action.images.length === 1 ? (
                  <div className="overflow-hidden rounded-2xl aspect-[4/3]">
                    <img
                      src={action.images[0]}
                      alt={action.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {action.images.map((img, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-2xl aspect-[3/4]"
                      >
                        <img
                          src={img}
                          alt={`${action.title} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2">
                <div className="w-12 h-12 rounded-xl bg-green-dark/10 flex items-center justify-center mb-5">
                  <action.icon size={24} className="text-green-dark" />
                </div>
                <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-green-dark mb-4">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
