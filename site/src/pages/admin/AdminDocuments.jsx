import { useState } from 'react';
import { Trash2, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import Alert from '../../components/admin/Alert';
import Field, { INPUT_CLASS } from '../../components/admin/Field';

// Doit rester aligné sur la liste acceptée par l'API (server/index.js).
const CATEGORIES = ['Règlement', 'Cartes', 'Comptes rendus'];
const EMPTY = { title: '', category: CATEGORIES[0], filename: '' };

export default function AdminDocuments() {
  const { documents, addDocument, deleteDocument } = useData();
  const { error, setError, busy, run } = useAsyncAction();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setError('');
    setForm(EMPTY);
    setOpen(true);
  };

  const save = async () => {
    const ok = await run(() => addDocument(form));
    if (ok) setOpen(false);
  };

  const remove = (item) => {
    if (!window.confirm(`Retirer « ${item.title} » de la liste ?`)) return;
    run(() => deleteDocument(item.id));
  };

  return (
    <div>
      <PageHeader title="Documents" actionLabel="Ajouter" onAction={openNew} />

      <div className="flex items-start gap-2 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-3 mb-6">
        <Info size={16} className="shrink-0 mt-0.5 text-green-dark" />
        <p>
          Registre interne : cette liste n’est pas publiée sur le site. Elle
          référence les documents de l’association par leur nom de fichier ;
          l’envoi des fichiers eux-mêmes n’est pas encore géré par le site.
        </p>
      </div>

      {!open && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {open && (
        <Modal
          title="Nouveau document"
          onClose={() => setOpen(false)}
          onSubmit={save}
          busy={busy}
        >
          <Field label="Titre" htmlFor="doc-title">
            <input
              id="doc-title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Catégorie" htmlFor="doc-category">
            <select
              id="doc-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={INPUT_CLASS}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nom du fichier" htmlFor="doc-filename">
            <input
              id="doc-filename"
              required
              value={form.filename}
              onChange={(e) => setForm({ ...form, filename: e.target.value })}
              className={INPUT_CLASS}
              placeholder="reglement-interieur-2026.pdf"
            />
          </Field>
          <Alert>{error}</Alert>
        </Modal>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Titre</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">
                  Catégorie
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">
                  Fichier
                </th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {documents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                    Aucun document référencé.
                  </td>
                </tr>
              )}
              {documents.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 md:hidden">{item.filename}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-green-dark/10 text-green-dark text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                    {item.filename}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => remove(item)}
                      aria-label={`Supprimer ${item.title}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
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
