import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatDate';

export default function LatestNews() {
  const { news } = useData();
  const latest = [...news]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <section id="actualites" className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-4">
              Les dernieres{' '}
              <em className="italic font-normal">actualites.</em>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Ce qui se passe dans la vie de l'association.
            </p>
          </div>
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-semibold text-sm transition-colors shrink-0"
          >
            Toutes les actus <ArrowRight size={16} />
          </Link>
        </div>

        {/* News cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latest.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {item.image && (
                <div className="overflow-hidden aspect-[16/10]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 lg:p-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                  <Calendar size={13} />
                  {formatDate(item.date)}
                </div>
                <h3 className="font-heading text-lg font-semibold text-green-dark mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
