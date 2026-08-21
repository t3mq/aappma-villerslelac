import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { formatDateShort } from '../../utils/formatDate';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import Alert from '../../components/admin/Alert';
import Field, { INPUT_CLASS } from '../../components/admin/Field';

const EMPTY = { title: '', date: '', description: '' };

export default function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const { error, setError, busy, run } = useAsyncAction();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const openNew = () => {
    setError('');
    setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) });
    setEditing('new');
  };

  const openEdit = (item) => {
    setError('');
    setForm({ title: item.title, date: item.date, description: item.description });
    setEditing(item);
  };

  const save = async () => {
    const ok = await run(() =>
      editing === 'new' ? addEvent(form) : updateEvent(editing.id, form)
    );
    if (ok) setEditing(null);
  };

  const remove = (item) => {
    if (!window.confirm(`Supprimer définitivement l’événement « ${item.title} » ?`)) return;
    run(() => deleteEvent(item.id));
  };

  return (
    <div>
      <PageHeader title="Événements" actionLabel="Ajouter" onAction={openNew} />

      {!editing && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {editing && (
        <Modal
          title={editing === 'new' ? 'Nouvel événement' : 'Modifier l’événement'}
          onClose={() => setEditing(null)}
          onSubmit={save}
          busy={busy}
        >
          <Field label="Titre" htmlFor="event-title">
            <input
              id="event-title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Date" htmlFor="event-date">
            <input
              id="event-date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Description" htmlFor="event-description">
            <textarea
              id="event-description"
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${INPUT_CLASS} resize-none`}
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
                    Aucun événement programmé.
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
