import { useState } from 'react';
import { Trash2, X, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import Alert from '../../components/admin/Alert';
import Field, { INPUT_CLASS } from '../../components/admin/Field';

const EMPTY = { src: '', alt: '' };

export default function AdminGallery() {
  const { gallery, addPhoto, deletePhoto } = useData();
  const { error, setError, busy, run } = useAsyncAction();
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setError('');
    setForm(EMPTY);
    setOpen(true);
  };

  const save = async () => {
    const ok = await run(() => addPhoto(form));
    if (ok) setOpen(false);
  };

  const remove = (photo) => {
    if (!window.confirm(`Supprimer la photo « ${photo.alt} » ?`)) return;
    run(() => deletePhoto(photo.id));
  };

  return (
    <div>
      <PageHeader title="Galerie photos" actionLabel="Ajouter" onAction={openNew} />

      <div className="flex items-start gap-2 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-3 mb-6">
        <Info size={16} className="shrink-0 mt-0.5 text-green-dark" />
        <p>
          Les photos sont référencées par leur adresse dans le dossier{' '}
          <code className="text-green-dark">/photos</code> du site. L’envoi de
          fichiers depuis cette page n’est pas encore géré.
        </p>
      </div>

      {!open && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {open && (
        <Modal title="Ajouter une photo" onClose={() => setOpen(false)} onSubmit={save} busy={busy}>
          <Field label="Adresse de la photo" htmlFor="photo-src">
            <input
              id="photo-src"
              required
              value={form.src}
              onChange={(e) => setForm({ ...form, src: e.target.value })}
              className={INPUT_CLASS}
              placeholder="/photos/PHOTO-2025-02-01-14-05-07.jpg"
            />
          </Field>
          <Field label="Description (texte alternatif)" htmlFor="photo-alt">
            <input
              id="photo-alt"
              required
              value={form.alt}
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
              className={INPUT_CLASS}
              placeholder="Gorges du Doubs"
            />
          </Field>
          {form.src && (
            <img
              src={form.src}
              alt=""
              className="w-full max-h-48 object-cover rounded-lg bg-gray-100"
            />
          )}
          <Alert>{error}</Alert>
        </Modal>
      )}

      {gallery.length === 0 ? (
        <p className="text-gray-400 bg-white rounded-xl shadow-sm px-5 py-8 text-center">
          Aucune photo dans la galerie.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl aspect-square bg-gray-100"
            >
              <button
                type="button"
                onClick={() => setPreview(photo)}
                className="w-full h-full cursor-pointer"
                aria-label={`Agrandir ${photo.alt}`}
              >
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
              </button>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />
              <button
                onClick={() => remove(photo)}
                aria-label={`Supprimer ${photo.alt}`}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          {/* Fond cliquable : un vrai bouton, hors parcours clavier — la croix
              ci-dessous assure la même action de façon accessible. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setPreview(null)}
            className="absolute inset-0 cursor-default"
          />
          <button
            type="button"
            onClick={() => setPreview(null)}
            aria-label="Fermer l’aperçu"
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white cursor-pointer"
          >
            <X size={28} />
          </button>
          <img
            src={preview.src}
            alt={preview.alt}
            className="relative max-w-full max-h-[85vh] rounded-lg object-contain pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}
