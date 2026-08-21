export default function Team() {
  return (
    <section id="equipe" className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-6">
            Derrière l’association,{' '}
            <span className="block">
              des <em className="italic font-normal">passionnés.</em>
            </span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            Notre AAPPMA, c’est avant tout une bande de passionnés bénévoles
            qui consacrent leur temps libre à la protection et à la mise en
            valeur de nos cours d’eau.
          </p>
        </div>

        {/* Grille de photos */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Grande photo */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
            <img
              src="/photos/PHOTO-2025-05-24-12-41-28.jpg"
              alt="Membres de l’association"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6">
              <p className="font-heading text-xl text-white font-semibold">
                Des moments de partage
              </p>
              <p className="text-white/75 text-sm mt-1">
                Assemblées, sorties, repas : l’esprit associatif au quotidien
              </p>
            </div>
          </div>

          {/* Deux photos superposées */}
          <div className="grid gap-6 lg:gap-8">
            <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
              <img
                src="/photos/PHOTO-2024-11-03-12-00-17.jpg"
                alt="Membres de l’association en extérieur"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="font-heading text-lg text-white font-semibold">
                  Sorties conviviales
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
              <img
                src="/photos/PHOTO-2025-10-09-23-20-36.jpg"
                alt="Repas entre membres"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="font-heading text-lg text-white font-semibold">
                  Repas de l’association
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
