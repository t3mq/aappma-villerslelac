import { useState } from 'react';
import { Pencil, Trash2, Check, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import Alert from '../../components/admin/Alert';
import Field, { INPUT_CLASS } from '../../components/admin/Field';

// Doit rester aligné sur la liste acceptée par l'API (server/index.js).
const ROLES = ['Président', 'Trésorier', 'Secrétaire', 'Membre'];
const EMPTY = { name: '', email: '', role: 'Membre', cotisation: false };

export default function AdminMembers() {
  const { members, addMember, updateMember, deleteMember } = useData();
  const { error, setError, busy, run } = useAsyncAction();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setError('');
    setForm(EMPTY);
    setEditing('new');
  };

  const openEdit = (item) => {
    setError('');
    setForm({
      name: item.name,
      email: item.email,
      role: item.role,
      cotisation: item.cotisation,
    });
    setEditing(item);
  };

  const save = async () => {
    const ok = await run(() =>
      editing === 'new' ? addMember(form) : updateMember(editing.id, form)
    );
    if (ok) setEditing(null);
  };

  const remove = (item) => {
    if (!window.confirm(`Supprimer définitivement l’adhérent « ${item.name} » ?`)) return;
    run(() => deleteMember(item.id));
  };

  return (
    <div>
      <PageHeader title="Adhérents" actionLabel="Ajouter" onAction={openNew} />

      {!editing && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {editing && (
        <Modal
          title={editing === 'new' ? 'Nouvel adhérent' : 'Modifier l’adhérent'}
          onClose={() => setEditing(null)}
          onSubmit={save}
          busy={busy}
        >
          <Field label="Nom complet" htmlFor="member-name">
            <input
              id="member-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="E-mail" htmlFor="member-email">
            <input
              id="member-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Rôle" htmlFor="member-role">
            <select
              id="member-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={INPUT_CLASS}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="member-cotisation"
              checked={form.cotisation}
              onChange={(e) => setForm({ ...form, cotisation: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="member-cotisation" className="text-sm text-gray-700">
              Cotisation à jour
            </label>
          </div>
          <Alert>{error}</Alert>
        </Modal>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Nom</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">
                  E-mail
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">
                  Rôle
                </th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Cotisation</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    Aucun adhérent enregistré.
                  </td>
                </tr>
              )}
              {members.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{item.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{item.email}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-green-dark/10 text-green-dark text-xs font-medium">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {item.cotisation ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <Check size={14} /> À jour
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                        <AlertCircle size={14} /> En retard
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        aria-label={`Modifier ${item.name}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-dark/5 transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => remove(item)}
                        aria-label={`Supprimer ${item.name}`}
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
