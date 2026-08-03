import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export default function Contact() {
  const infos = [
    {
      icon: MapPin,
      label: 'Adresse',
      value: 'Local AAPPMA, Villers-le-Lac, 25130',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'sebastiendrozgrey@gmail.com',
      href: 'mailto:sebastiendrozgrey@gmail.com',
    },
    {
      icon: Phone,
      label: 'Telephone',
      value: '06 33 07 10 36',
    }
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: info */}
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-6">
              Nous{' '}
              <em className="italic font-normal">trouver.</em>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-lg">
              Une question, une envie de rejoindre l'association ou simplement
              besoin d'un conseil pour votre prochaine sortie ? Contactez-nous.
            </p>

            <div className="space-y-6">
              {infos.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-green-dark/10 flex items-center justify-center shrink-0">
                    <info.icon size={20} className="text-green-dark" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-green-dark font-medium hover:text-green-medium transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-green-dark font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="https://www.cartedepeche.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3.5 bg-gold hover:bg-gold-light text-green-dark font-semibold rounded-lg text-base transition-colors"
              >
                Prendre ma carte de peche
              </a>
            </div>
          </div>

          {/* Right: photo */}
          <div className="overflow-hidden rounded-2xl aspect-[4/3]">
            <img
              src="/photos/PHOTO-2025-02-01-14-01-52.jpg"
              alt="Les gorges du Doubs"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
