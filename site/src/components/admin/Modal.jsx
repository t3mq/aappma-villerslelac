import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// <dialog> natif plutôt qu'un simple <div> superposé : le navigateur gère
// l'arrière-plan inerte, le piégeage du focus et la touche Échap (onCancel).
export default function Modal({
  title,
  onClose,
  onSubmit,
  submitLabel = 'Enregistrer',
  busy = false,
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl bg-white p-6 backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-lg font-semibold text-green-dark">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Un <form> plutôt que des boutons isolés : la touche Entrée valide. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="space-y-4">{children}</div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={busy}
            className="px-5 py-2 bg-green-dark hover:bg-green-medium text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? 'Enregistrement…' : submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
