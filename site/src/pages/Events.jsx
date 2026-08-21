import { CalendarDays } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatDateFull } from '../utils/formatDate';

// Les dates d'événement sont des jours entiers (minuit) : on compare au début
// de la journée courante, sinon un événement du jour basculerait dans « Passés »
// dès la première minute.
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function EventCard({ event, isPast }) {
  const d = new Date(event.date);
  const day = d.toLocaleDateString('fr-FR', { day: 'numeric' });
  const month = d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();

  return (
    <div
      className={`flex gap-5 lg:gap-6 bg-white rounded-2xl p-5 lg:p-6 shadow-sm ${
        isPast ? 'opacity-60' : ''
      }`}
    >
      <div className="shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-green-dark flex flex-col items-center justify-center text-white">
        <span className="text-xl lg:text-2xl font-bold leading-none">{day}</span>
        <span className="text-[10px] lg:text-xs font-medium tracking-wider mt-0.5">{month}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-lg font-semibold text-green-dark mb-1 leading-snug">
          {event.title}
        </h3>
        <p className="text-gray-400 text-xs mb-2 first-letter:uppercase">
          {formatDateFull(event.date)}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}

export default function Events() {
  const { events } = useData();
  const today = startOfToday();
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcoming = sorted.filter((e) => new Date(e.date) >= today);
  const past = sorted.filter((e) => new Date(e.date) < today);

  return (
    <main className="pt-28 pb-20 lg:pt-36 lg:pb-28 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-4">
            Calendrier des{' '}
            <em className="italic font-normal">événements.</em>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Concours, sorties, assemblées… ne manquez rien.
          </p>
        </div>

        {sorted.length === 0 && (
          <p className="text-gray-500">Aucun événement programmé pour le moment.</p>
        )}

        {upcoming.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays size={18} className="text-gold" />
              <h2 className="font-heading text-xl font-semibold text-green-dark">À venir</h2>
            </div>
            <div className="space-y-4">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} isPast={false} />
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays size={18} className="text-gray-400" />
              <h2 className="font-heading text-xl font-semibold text-gray-400">Passés</h2>
            </div>
            <div className="space-y-4">
              {past.map((e) => (
                <EventCard key={e.id} event={e} isPast />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
