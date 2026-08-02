import { Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/formatDate';

export default function News() {
  const { news } = useData();
  const sorted = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="pt-28 pb-20 lg:pt-36 lg:pb-28 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-4">
            Toutes les{' '}
            <em className="italic font-normal">actualites.</em>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Retrouvez ici toutes les nouvelles de l'association.
          </p>
        </div>

        <div className="space-y-8">
          {sorted.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row"
            >
              {item.image && (
                <div className="md:w-80 lg:w-96 shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-48 md:h-full object-cover" />
                </div>
              )}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                  <Calendar size={13} />
                  {formatDate(item.date)}
                </div>
                <h2 className="font-heading text-xl lg:text-2xl font-semibold text-green-dark mb-3 leading-snug">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
