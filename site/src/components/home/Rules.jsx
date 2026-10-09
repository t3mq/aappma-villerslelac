import { AlertCircle, Calendar, Ruler, Ban } from 'lucide-react';

const RULES = [
  {
    icon: Calendar,
    title: 'Périodes d’ouverture',
    items: [
      '1re catégorie : de la 2e semaine de mars au 3e dimanche de septembre',
      '2e catégorie (eaux françaises uniquement, du lac de Chaillexon au pont de Sobey) : du 1er samedi de juin au 31 janvier',
      '2e catégorie (eaux franco-suisses, du lac de Chaillexon au barrage du Châtelot) : du 16 juin au 28 février',
      'Truite : du 1er mars au dernier dimanche de septembre',
      'Ombre commun : ouverture le 16 mai',
      'Brochet : du 1er mai au dernier dimanche de janvier',
    ],
  },
  {
    icon: Ruler,
    title: 'Tailles de capture',
    items: [
      'Truite : prélèvement de 30 à 35 cm',
      'Truite : remise à l’eau obligatoire de 36 à 55 cm',
      'Truite : prélèvement possible dès 56 cm',
      'Ombre commun : 35 cm',
      'Brochet : 60 cm',
      'Sandre : 50 cm',
    ],
  },
  {
    icon: AlertCircle,
    title: 'Quotas journaliers',
    items: [
      'Truites : 4 maximum',
      'Ombres communs : 2 maximum, dès l’ouverture',
      'Brochets : 3 maximum',
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
