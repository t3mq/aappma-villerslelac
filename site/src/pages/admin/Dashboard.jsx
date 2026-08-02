import { Newspaper, CalendarDays, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatDateShort } from '../../utils/formatDate';

export default function Dashboard() {
  const { news, events, documents, members } = useData();

  const stats = [
    { label: 'Actualites', value: news.length, icon: Newspaper, to: '/admin/actualites', color: 'bg-green-dark/10 text-green-dark' },
    { label: 'Evenements', value: events.length, icon: CalendarDays, to: '/admin/evenements', color: 'bg-gold/15 text-gold' },
    { label: 'Documents', value: documents.length, icon: FileText, to: '/admin/documents', color: 'bg-green-dark/10 text-green-dark' },
    { label: 'Adherents', value: members.length, icon: Users, to: '/admin/adherents', color: 'bg-gold/15 text-gold' },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-green-dark mb-6">Tableau de bord</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{s.value}</span>
            </div>
            <p className="text-sm text-gray-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-green-dark mb-4">Dernieres actualites</h2>
        <div className="divide-y divide-gray-100">
          {[...news]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
            .map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDateShort(item.date)}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
