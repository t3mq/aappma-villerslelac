import { CalendarDays } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatDateFull } from '../utils/formatDate';

export default function Events() {
  const { events } = useData();
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const now = new Date();

  const upcoming = sorted.filter((e) => new Date(e.date) >= now);
  const past = sorted.filter((e) => new Date(e.date) < now);

  const getDateParts = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString('fr-FR', { day: 'numeric' }),
      month: d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
      full: formatDateFull(dateStr),
    };
  };

  const EventCard = ({ event }) => {
    const date = getDateParts(event.date);
    const isPast = new Date(event.date) < now;

    return (
      <div className={`flex gap-5 lg:gap-6 bg-white rounded-2xl p-5 lg:p-6 shadow-sm ${isPast ? 'opacity-60' : ''}`}>
        <div className="shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-green-dark flex flex-col items-center justify-center text-white">
          <span className="text-xl lg:text-2xl font-bold leading-none">{date.day}</span>
          <span className="text-[10px] lg:text-xs font-medium tracking-wider mt-0.5">{date.month}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-semibold text-green-dark mb-1 leading-snug">{event.title}</h3>
          <p className="text-gray-400 text-xs mb-2 capitalize">{date.full}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
        </div>
      </div>
    );
  };

  return (
    <main className="pt-28 pb-20 lg:pt-36 lg:pb-28 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-green-dark font-semibold leading-tight mb-4">
            Calendrier des{' '}
            <em className="italic font-normal">evenements.</em>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Concours, sorties, assemblees... ne manquez rien.
          </p>
        </div>

        {upcoming.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays size={18} className="text-gold" />
              <h2 className="font-heading text-xl font-semibold text-green-dark">A venir</h2>
            </div>
            <div className="space-y-4">
              {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays size={18} className="text-gray-400" />
              <h2 className="font-heading text-xl font-semibold text-gray-400">Passes</h2>
            </div>
            <div className="space-y-4">
              {past.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
