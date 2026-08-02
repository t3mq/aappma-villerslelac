import { useState } from 'react';
import { Plus, Trash2, X, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AdminDocuments() {
  const { documents, addDocument, deleteDocument } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', filename: '' });

  const categories = ['Reglement', 'Cartes', 'Comptes-rendus'];

  const openNew = () => {
    setForm({ title: '', category: categories[0], filename: '' });
    setEditing('new');
  };

  const save = () => {
    if (!form.title || !form.filename) return;
    addDocument(form);
    setEditing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-green-dark">Documents</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-green-dark hover:bg-green-medium text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-lg font-semibold text-green-dark">Nouveau document</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-green-dark/30 transition-colors cursor-pointer">
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Cliquer pour uploader un fichier</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG (max 10 Mo)</p>
                </div>
                <input value={form.filename} onChange={(e) => setForm({ ...form, filename: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark/30 mt-2" placeholder="Nom du fichier (ex: reglement.pdf)" />
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
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">Categorie</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Fichier</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {documents.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5"><p className="font-medium text-gray-800">{item.title}</p></td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-green-dark/10 text-green-dark text-xs font-medium">{item.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{item.filename}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => deleteDocument(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"><Trash2 size={15} /></button>
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
