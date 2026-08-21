import { TreePine, Fish, Shield, Users, MapPin, Droplets } from 'lucide-react';

const REASONS = [
  {
    icon: TreePine,
    title: 'Cadre naturel préservé',
    description:
      'Gorges sauvages, forêts denses et falaises calcaires : un décor à couper le souffle.',
  },
  {
    icon: Fish,
    title: 'Poissons sauvages',
    description:
      'Truites fario, ombres communs, brochets… une biodiversité piscicole remarquable.',
  },
  {
    icon: Droplets,
    title: 'Qualité de l’eau',
    description:
      'Des eaux cristallines de première catégorie, régulièrement surveillées et protégées.',
  },
  {
    icon: Shield,
    title: 'Gestion raisonnée',
    description:
      'Pas de déversement : on mise sur la reproduction naturelle et la protection des habitats.',
  },
  {
    icon: Users,
    title: 'Convivialité',
    description:
      'Une association à taille humaine, où chaque membre compte et participe.',
  },
  {
    icon: MapPin,
    title: 'Parcours variés',
    description:
      'Rivière, ruisseau, lac : trois ambiances différentes à quelques kilomètres.',
  },
];

export default function WhyHere() {
  return (
    <section id="pourquoi" className="py-20 lg:py-28 bg-green-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-tight mb-6">
            Pourquoi pêcher <em className="italic font-normal">ici&nbsp;?</em>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Six bonnes raisons de rejoindre notre AAPPMA et de découvrir
            les gorges du Doubs.
          </p>
        </div>

        {/* Grille */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-5">
                <r.icon size={24} className="text-gold" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-3">
                {r.title}
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
