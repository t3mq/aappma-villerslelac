import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AdminMembers() {
  const { members, fetchMembers, addMember, updateMember, deleteMember } = useData();

  useEffect(() => { fetchMembers(); }, [fetchMembers]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Membre', cotisation: false });

  const openNew = () => {
    setForm({ name: '', email: '', role: 'Membre', cotisation: false });
    setEditing('new');
  };

  const openEdit = (item) => {
    setForm({ name: item.name, email: item.email, role: item.role, cotisation: item.cotisation });
    setEditing(item);
  };

  const save = () => {
    if (!form.name || !form.email) return;
    if (editing === 'new') {
      addMember(form);
    } else {
      updateMember(editing.id, form);
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-green-dark">Adherents</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-green-dark hover:bg-green-medium text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-lg font-semibold text-green-dark">
                {editing === 'new' ? 'Nouvel adherent' : 'Modifier'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30">
                  {['President', 'Tresorier', 'Secretaire', 'Membre'].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cotisation" checked={form.cotisation} onChange={(e) => setForm({ ...form, cotisation: e.target.checked })} className="rounded border-gray-300" />
                <label htmlFor="cotisation" className="text-sm text-gray-700">Cotisation a jour</label>
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
                <th className="text-left px-5 py-3 font-medium text-gray-500">Nom</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Role</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Cotisation</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{item.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{item.email}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-green-dark/10 text-green-dark text-xs font-medium">{item.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {item.cotisation ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium"><Check size={14} /> A jour</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium"><AlertCircle size={14} /> En retard</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-dark/5 transition-colors cursor-pointer"><Pencil size={15} /></button>
                      <button onClick={() => deleteMember(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"><Trash2 size={15} /></button>
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
