import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDateShort } from '../../utils/formatDate';

export default function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', description: '' });

  const openNew = () => {
    setForm({ title: '', date: new Date().toISOString().split('T')[0], description: '' });
    setEditing('new');
  };

  const openEdit = (item) => {
    setForm({ title: item.title, date: item.date, description: item.description });
    setEditing(item);
  };

  const save = () => {
    if (!form.title || !form.date) return;
    if (editing === 'new') {
      addEvent(form);
    } else {
      updateEvent(editing.id, form);
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-green-dark">Evenements</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-green-dark hover:bg-green-medium text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-lg font-semibold text-green-dark">
                {editing === 'new' ? 'Nouvel evenement' : 'Modifier'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer">Annuler</button>
              <button onClick={save} className="px-5 py-2 bg-green-dark hover:bg-green-medium text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Titre</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">Date</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...events].sort((a, b) => new Date(a.date) - new Date(b.date)).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{formatDateShort(item.date)}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{formatDateShort(item.date)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-dark/5 transition-colors cursor-pointer"><Pencil size={15} /></button>
                      <button onClick={() => deleteEvent(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
