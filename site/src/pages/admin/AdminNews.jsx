import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { formatDateShort } from '../../utils/formatDate';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import Alert from '../../components/admin/Alert';
import Field, { INPUT_CLASS } from '../../components/admin/Field';

const EMPTY = { title: '', date: '', excerpt: '', content: '', image: '' };

export default function AdminNews() {
  const { news, addNews, updateNews, deleteNews } = useData();
  const { error, setError, busy, run } = useAsyncAction();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const sorted = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

  const openNew = () => {
    setError('');
    setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) });
    setEditing('new');
  };

  const openEdit = (item) => {
    setError('');
    setForm({
      title: item.title,
      date: item.date,
      excerpt: item.excerpt,
      content: item.content,
      image: item.image || '',
    });
    setEditing(item);
  };

  const save = async () => {
    const ok = await run(() =>
      editing === 'new' ? addNews(form) : updateNews(editing.id, form)
    );
    if (ok) setEditing(null);
  };

  const remove = (item) => {
    if (!window.confirm(`Supprimer définitivement l’actualité « ${item.title} » ?`)) return;
    run(() => deleteNews(item.id));
  };

  return (
    <div>
      <PageHeader title="Actualités" actionLabel="Ajouter" onAction={openNew} />

      {!editing && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {editing && (
        <Modal
          title={editing === 'new' ? 'Nouvelle actualité' : 'Modifier l’actualité'}
          onClose={() => setEditing(null)}
          onSubmit={save}
          busy={busy}
        >
          <Field label="Titre" htmlFor="news-title">
            <input
              id="news-title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Date" htmlFor="news-date">
            <input
              id="news-date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Extrait (affiché sur l’accueil)" htmlFor="news-excerpt">
            <textarea
              id="news-excerpt"
              rows={2}
              required
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={`${INPUT_CLASS} resize-none`}
            />
          </Field>
          <Field label="Contenu" htmlFor="news-content">
            <textarea
              id="news-content"
              rows={4}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={`${INPUT_CLASS} resize-none`}
            />
          </Field>
          <Field label="Adresse de l’image (facultatif)" htmlFor="news-image">
            <input
              id="news-image"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className={INPUT_CLASS}
              placeholder="/photos/…"
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
                  Date
                </th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-gray-400">
                    Aucune actualité pour le moment.
                  </td>
                </tr>
              )}
              {sorted.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 sm:hidden">
                      {formatDateShort(item.date)}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">
                    {formatDateShort(item.date)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        aria-label={`Modifier ${item.title}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-dark/5 transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => remove(item)}
                        aria-label={`Supprimer ${item.title}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
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
