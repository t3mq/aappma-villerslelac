import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronRight,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderInput,
  FolderPlus,
  Info,
  Pencil,
  Trash2,
  Upload,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { documentsApi } from '../../api';
import { formatDateShort } from '../../utils/formatDate';
import Modal from '../../components/admin/Modal';
import Alert from '../../components/admin/Alert';
import Field, { INPUT_CLASS } from '../../components/admin/Field';

// Doivent rester alignés sur FILE_TYPES et MAX_FILE_SIZE_MB (server/index.js) :
// vérifier ici évite d'envoyer 25 Mo pour se les voir refuser ensuite.
const ACCEPTED_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp',
  'rtf', 'txt', 'csv', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'zip',
];
const MAX_FILE_SIZE_MB = 25;
// Un champ String Prisma devient un VARCHAR(191) sous MySQL.
const MAX_NAME_LENGTH = 191;
// Formats que le navigateur sait afficher lui-même dans un onglet.
const PREVIEWABLE = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt'];
const DRAG_TYPE = 'application/x-aappma-item';

const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });

const PRIMARY_BUTTON =
  'flex items-center gap-2 px-4 py-2 bg-green-dark hover:bg-green-medium text-white text-sm font-medium rounded-lg transition-colors cursor-pointer';
const SECONDARY_BUTTON =
  'flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-green-dark text-green-dark text-sm font-medium rounded-lg transition-colors cursor-pointer';
const ICON_BUTTON =
  'p-1.5 rounded-lg text-gray-400 hover:text-green-dark hover:bg-gray-100 transition-colors cursor-pointer';

function extensionOf(name) {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

function formatSize(bytes) {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} ko`;
  return `${(bytes / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo`;
}

function iconFor(filename) {
  const ext = extensionOf(filename);
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return FileImage;
  if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) return FileSpreadsheet;
  if (['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt'].includes(ext)) return FileText;
  return File;
}

// Même règle que le serveur : un nom renommé sans extension la récupère.
function downloadName(doc) {
  const ext = extensionOf(doc.filename);
  return !ext || extensionOf(doc.title) === ext ? doc.title : `${doc.title}.${ext}`;
}

function saveBlobUrl(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}

const nameOf = (item) => (item.kind === 'folder' ? item.name : item.title);

export default function AdminDocuments() {
  const {
    documents, uploadDocuments, updateDocument, deleteDocument,
    folders, createFolder, updateFolder, deleteFolder,
  } = useData();
  const { error, setError, busy, run } = useAsyncAction();
  const [searchParams, setSearchParams] = useSearchParams();
  // { type: 'folder' } | { type: 'rename', item } | { type: 'move', item }
  const [dialog, setDialog] = useState(null);
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [dropTarget, setDropTarget] = useState(null);
  const [uploading, setUploading] = useState(false);
  const dragged = useRef(null);
  const fileInput = useRef(null);
  const nameInput = useRef(null);

  const folderById = useMemo(() => new Map(folders.map((f) => [f.id, f])), [folders]);

  // Dossier courant dans l'URL (?dossier=12) : le bouton Précédent du
  // navigateur remonte l'arborescence. Un dossier inconnu ramène à la racine.
  const requested = Number(searchParams.get('dossier'));
  const currentId = folderById.has(requested) ? requested : null;

  const openFolder = (id) => {
    setError('');
    setSearchParams(id === null ? {} : { dossier: String(id) });
  };

  const ancestorsOf = (folder) => {
    const trail = [];
    for (let f = folder; f; f = folderById.get(f.parentId)) trail.unshift(f);
    return trail;
  };
  const breadcrumb = [{ id: null, name: 'Documents' }, ...ancestorsOf(folderById.get(currentId))];

  const subfolders = folders
    .filter((f) => f.parentId === currentId)
    .sort((a, b) => collator.compare(a.name, b.name));
  const files = documents
    .filter((d) => (d.folderId ?? null) === currentId)
    .sort((a, b) => collator.compare(a.title, b.title));

  const countIn = (id) =>
    folders.filter((f) => f.parentId === id).length +
    documents.filter((d) => d.folderId === id).length;

  // Un dossier ne peut aller ni dans lui-même ni dans l'un de ses descendants.
  const canMove = (item, destId) => {
    if (item.kind === 'document') return (item.folderId ?? null) !== destId;
    if (item.parentId === destId) return false;
    return !ancestorsOf(folderById.get(destId)).some((f) => f.id === item.id);
  };

  const moveRequest = (item, destId) =>
    item.kind === 'document'
      ? updateDocument(item.id, { folderId: destId })
      : updateFolder(item.id, { parentId: destId });

  const upload = async (fileList, folderId) => {
    // Copie immédiate : la FileList d'un <input> est vidée juste après l'appel.
    const selected = [...fileList];
    if (selected.length === 0) return;
    const rejected = selected.find((f) => !ACCEPTED_EXTENSIONS.includes(extensionOf(f.name)));
    if (rejected) {
      setError(`Type de fichier non accepté : « ${rejected.name} ». Les dossiers de l’ordinateur ne peuvent pas être déposés tels quels.`);
      return;
    }
    const tooBig = selected.find((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (tooBig) {
      setError(`« ${tooBig.name} » dépasse la taille maximale de ${MAX_FILE_SIZE_MB} Mo.`);
      return;
    }
    setUploading(true);
    await run(() => uploadDocuments(selected, folderId));
    setUploading(false);
  };

  // ── Glisser-déposer ──
  // Une ligne de la liste se déplace sur un dossier (ligne ou fil d'Ariane) ;
  // des fichiers venant de l'ordinateur s'envoient dans le dossier visé, ou
  // dans le dossier courant s'ils sont lâchés ailleurs dans la liste.
  const dragProps = (item) => ({
    draggable: true,
    onDragStart: (e) => {
      dragged.current = item;
      e.dataTransfer.effectAllowed = 'move';
      // Firefox ne démarre aucun glissement sans donnée associée.
      e.dataTransfer.setData(DRAG_TYPE, `${item.kind}:${item.id}`);
    },
    onDragEnd: () => {
      dragged.current = null;
      setDropTarget(null);
    },
  });

  const dropProps = (key, destId) => ({
    onDragOver: (e) => {
      const isFiles = e.dataTransfer.types.includes('Files');
      if (!isFiles && !(dragged.current && canMove(dragged.current, destId))) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = isFiles ? 'copy' : 'move';
      setDropTarget(key);
    },
    onDragLeave: (e) => {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      setDropTarget((current) => (current === key ? null : current));
    },
    onDrop: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDropTarget(null);
      const item = dragged.current;
      dragged.current = null;
      if (e.dataTransfer.files.length > 0) upload(e.dataTransfer.files, destId);
      else if (item) run(() => moveRequest(item, destId));
    },
  });

  // ── Fenêtres de création, renommage et déplacement ──
  const openDialog = (next) => {
    setError('');
    setName(next.item ? nameOf(next.item) : '');
    setDestination('');
    setDialog(next);
  };

  // Les effets du parent passent après ceux de Modal : le <dialog> est déjà
  // ouvert, le focus peut aller directement au champ.
  useEffect(() => {
    if (dialog && dialog.type !== 'move') nameInput.current?.focus();
  }, [dialog]);

  // Au renommage d'un fichier, seul le nom est présélectionné, pas l'extension.
  const selectName = (e) => {
    const input = e.target;
    const dot = dialog?.item?.kind === 'document' ? input.value.lastIndexOf('.') : -1;
    input.setSelectionRange(0, dot > 0 ? dot : input.value.length);
  };

  const destinations =
    dialog?.type === 'move'
      ? [
          { id: null, label: 'Documents' },
          ...folders
            .map((f) => ({
              id: f.id,
              label: ['Documents', ...ancestorsOf(f).map((a) => a.name)].join(' / '),
            }))
            .sort((a, b) => collator.compare(a.label, b.label)),
        ].filter((d) => canMove(dialog.item, d.id))
      : [];

  const submitDialog = async () => {
    if (dialog.type === 'move' && !destination) return;
    const ok = await run(async () => {
      if (dialog.type === 'folder') {
        await createFolder({ name, parentId: currentId });
      } else if (dialog.type === 'rename') {
        const { item } = dialog;
        await (item.kind === 'document'
          ? updateDocument(item.id, { title: name })
          : updateFolder(item.id, { name }));
      } else {
        await moveRequest(dialog.item, destination === 'root' ? null : Number(destination));
      }
    });
    if (ok) setDialog(null);
  };

  const dialogTitle = {
    folder: 'Nouveau dossier',
    rename: 'Renommer',
    move: 'Déplacer',
  }[dialog?.type];

  // ── Actions sur les éléments ──
  const remove = (item) => {
    const label = item.kind === 'folder' ? `le dossier « ${item.name} »` : `« ${item.title} »`;
    if (!window.confirm(`Supprimer définitivement ${label} ?`)) return;
    run(() => (item.kind === 'folder' ? deleteFolder(item.id) : deleteDocument(item.id)));
  };

  const download = (doc) =>
    run(async () => {
      const url = URL.createObjectURL(await documentsApi.download(doc.id));
      saveBlobUrl(url, downloadName(doc));
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    });

  // L'onglet est ouvert avant d'attendre le fichier : ouvert après, le
  // navigateur le bloquerait comme une fenêtre surgissante.
  const preview = (doc) => {
    const tab = window.open('', '_blank');
    run(async () => {
      try {
        const url = URL.createObjectURL(await documentsApi.download(doc.id));
        if (tab) tab.location.href = url;
        else saveBlobUrl(url, downloadName(doc));
        setTimeout(() => URL.revokeObjectURL(url), 5 * 60_000);
      } catch (err) {
        tab?.close();
        throw err;
      }
    });
  };

  const openDocument = (doc) =>
    PREVIEWABLE.includes(extensionOf(doc.filename)) ? preview(doc) : download(doc);

  const rowClass = (key) =>
    `transition-colors ${dropTarget === key ? 'bg-green-dark/10' : 'hover:bg-gray-50/50'}`;

  const rowActions = (item) => (
    <div className="flex justify-end gap-1">
      {item.kind === 'document' && item.storageKey && (
        <button onClick={() => download(item)} aria-label={`Télécharger ${item.title}`} title="Télécharger" className={ICON_BUTTON}>
          <Download size={15} />
        </button>
      )}
      <button onClick={() => openDialog({ type: 'rename', item })} aria-label={`Renommer ${nameOf(item)}`} title="Renommer" className={ICON_BUTTON}>
        <Pencil size={15} />
      </button>
      <button onClick={() => openDialog({ type: 'move', item })} aria-label={`Déplacer ${nameOf(item)}`} title="Déplacer" className={ICON_BUTTON}>
        <FolderInput size={15} />
      </button>
      <button
        onClick={() => remove(item)}
        aria-label={`Supprimer ${nameOf(item)}`}
        title="Supprimer"
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  const isEmpty = subfolders.length === 0 && files.length === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl font-semibold text-green-dark">Documents</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => openDialog({ type: 'folder' })} className={SECONDARY_BUTTON}>
            <FolderPlus size={16} /> Nouveau dossier
          </button>
          <button onClick={() => fileInput.current?.click()} disabled={uploading} className={`${PRIMARY_BUTTON} disabled:opacity-60`}>
            <Upload size={16} /> Importer
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            accept={ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
            onChange={(e) => {
              upload(e.target.files, currentId);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div className="flex items-start gap-2 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-3 mb-6">
        <Info size={16} className="shrink-0 mt-0.5 text-green-dark" />
        <p>
          Espace privé, jamais publié sur le site. Glissez des fichiers depuis votre
          ordinateur pour les ajouter ({MAX_FILE_SIZE_MB} Mo maximum chacun). Pour
          ranger un fichier ou un dossier, faites-le glisser sur un dossier ou sur le
          chemin ci-dessous, ou utilisez le bouton <FolderInput size={14} className="inline -mt-0.5" />.
        </p>
      </div>

      <nav aria-label="Emplacement" className="flex flex-wrap items-center gap-1 text-sm mb-3">
        {breadcrumb.map((f, i) => {
          const key = `crumb-${f.id ?? 'root'}`;
          const isCurrent = i === breadcrumb.length - 1;
          return (
            <Fragment key={key}>
              {i > 0 && <ChevronRight size={14} className="text-gray-300" />}
              <button
                type="button"
                onClick={() => openFolder(f.id)}
                aria-current={isCurrent ? 'location' : undefined}
                {...dropProps(key, f.id)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  dropTarget === key ? 'bg-green-dark/10 ring-2 ring-green-dark/40' : ''
                } ${isCurrent ? 'font-semibold text-green-dark' : 'text-gray-500 hover:text-green-dark hover:bg-gray-100'}`}
              >
                {f.name}
              </button>
            </Fragment>
          );
        })}
      </nav>

      {!dialog && error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}
      {uploading && (
        <output className="block mb-4 text-sm text-green-dark">Envoi en cours…</output>
      )}

      <div
        {...dropProps('current', currentId)}
        className={`bg-white rounded-xl shadow-sm overflow-hidden ring-2 transition-shadow ${
          dropTarget === 'current' ? 'ring-green-dark/40' : 'ring-transparent'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Nom</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">Taille</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Ajouté le</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isEmpty && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-400">
                    <Upload size={28} className="mx-auto mb-3 text-gray-300" />
                    Ce dossier est vide. Glissez-y des fichiers depuis votre ordinateur
                    ou utilisez « Importer ».
                  </td>
                </tr>
              )}

              {subfolders.map((f) => {
                const item = { kind: 'folder', ...f };
                const key = `folder-${f.id}`;
                const count = countIn(f.id);
                return (
                  <tr key={key} {...dragProps(item)} {...dropProps(key, f.id)} className={rowClass(key)}>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openFolder(f.id)}
                        className="flex items-center gap-3 font-medium text-gray-800 hover:text-green-dark text-left cursor-pointer"
                      >
                        <Folder size={18} className="shrink-0 text-gold" fill="currentColor" fillOpacity={0.25} />
                        {f.name}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">
                      {count === 0 ? 'Vide' : `${count} élément${count > 1 ? 's' : ''}`}
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{formatDateShort(f.createdAt)}</td>
                    <td className="px-5 py-3">{rowActions(item)}</td>
                  </tr>
                );
              })}

              {files.map((d) => {
                const item = { kind: 'document', ...d };
                const Icon = iconFor(d.filename);
                return (
                  <tr key={`document-${d.id}`} {...dragProps(item)} className={rowClass(null)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="shrink-0 text-green-dark" />
                        {d.storageKey ? (
                          <button
                            onClick={() => openDocument(d)}
                            className="font-medium text-gray-800 hover:text-green-dark hover:underline text-left break-all cursor-pointer"
                          >
                            {d.title}
                          </button>
                        ) : (
                          <span className="font-medium text-gray-800 break-all">
                            {d.title}
                            {/* Entrées de l'ancien registre, sans fichier réel. */}
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 text-xs font-normal">
                              fichier absent
                            </span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{formatSize(d.size)}</td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{formatDateShort(d.createdAt)}</td>
                    <td className="px-5 py-3">{rowActions(item)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {dialog && (
        <Modal
          title={dialogTitle}
          submitLabel={dialog.type === 'folder' ? 'Créer' : dialog.type === 'move' ? 'Déplacer' : 'Renommer'}
          onClose={() => setDialog(null)}
          onSubmit={submitDialog}
          busy={busy}
        >
          {dialog.type === 'move' ? (
            destinations.length > 0 ? (
              <Field label={`Déplacer « ${nameOf(dialog.item)} » vers`} htmlFor="doc-destination">
                <select
                  id="doc-destination"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="" disabled>
                    Choisir un dossier…
                  </option>
                  {destinations.map((d) => (
                    <option key={d.id ?? 'root'} value={d.id ?? 'root'}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </Field>
            ) : (
              <p className="text-sm text-gray-500">
                Aucun autre dossier disponible. Créez d’abord un dossier de destination.
              </p>
            )
          ) : (
            <Field label="Nom" htmlFor="doc-name">
              <input
                ref={nameInput}
                id="doc-name"
                required
                maxLength={MAX_NAME_LENGTH}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={selectName}
                className={INPUT_CLASS}
              />
            </Field>
          )}
          <Alert>{error}</Alert>
        </Modal>
      )}
    </div>
  );
}
