import { AlertCircle, Calendar, Ruler, Ban } from 'lucide-react';

const RULES = [
  {
    icon: Calendar,
    title: 'Périodes d’ouverture',
    items: [
      '1re catégorie (truites) : du 2e samedi de mars au 3e dimanche de septembre',
      '2e catégorie (lac) : du 1er janvier au 31 décembre',
      'Brochet : du 1er mai au dernier dimanche de janvier',
    ],
  },
  {
    icon: Ruler,
    title: 'Tailles minimales de capture',
    items: [
      'Truite fario : 30 cm',
      'Ombre commun : 30 cm',
      'Brochet : 60 cm',
      'Sandre : 50 cm',
    ],
  },
  {
    icon: AlertCircle,
    title: 'Quotas journaliers',
    items: [
      'Truites : 4 prises par jour et par pêcheur',
      'Brochets : 2 prises par jour',
      'Écrevisses : pêche interdite',
    ],
  },
  {
    icon: Ban,
    title: 'Interdictions et bonnes pratiques',
    items: [
      'No-kill recommandé sur les parcours mouche',
      'Hameçons sans ardillon obligatoires sur certains secteurs',
      'Respect des réserves de pêche',
      'Ramassez vos déchets',
    ],
  },
];

export default function Rules() {
  return (
    <section id="regles" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-6">
            La règle,{' '}
            <em className="italic font-normal">simplement.</em>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            Des règles claires pour une pêche responsable. Respecter la
            réglementation, c’est garantir l’avenir de nos cours d’eau.
          </p>
        </div>

        {/* Grille des règles */}
        <div className="grid sm:grid-cols-2 gap-8">
          {RULES.map((rule) => (
            <div key={rule.title} className="bg-cream rounded-2xl p-7 lg:p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-green-dark/10 flex items-center justify-center shrink-0">
                  <rule.icon size={22} className="text-green-dark" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-green-dark">
                  {rule.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {rule.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
