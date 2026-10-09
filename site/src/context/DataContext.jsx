import { createContext, useContext, useState, useEffect } from 'react';
import { newsApi, eventsApi, documentsApi, foldersApi, membersApi, photosApi } from '../api';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { authed } = useAuth();

  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [members, setMembers] = useState([]);
  const [gallery, setGallery] = useState([]);

  // ── Données publiques, chargées au démarrage ──
  useEffect(() => {
    newsApi.getAll().then(setNews).catch(console.error);
    eventsApi.getAll().then(setEvents).catch(console.error);
    photosApi.getAll().then(setGallery).catch(console.error);
  }, []);

  // ── Données réservées à l'administration ──
  // Documents et adhérents ne sont jamais exposés aux visiteurs : ils ne sont
  // chargés qu'une fois connecté, ce qui alimente aussi les compteurs du
  // tableau de bord sans avoir à visiter chaque page au préalable.
  useEffect(() => {
    if (!authed) {
      setDocuments([]);
      setFolders([]);
      setMembers([]);
      return;
    }
    documentsApi.getAll().then(setDocuments).catch(console.error);
    foldersApi.getAll().then(setFolders).catch(console.error);
    membersApi.getAll().then(setMembers).catch(console.error);
  }, [authed]);

  // ── Actualités ──
  const addNews = async (item) => {
    const created = await newsApi.create(item);
    setNews((prev) => [created, ...prev]);
  };
  const updateNews = async (id, item) => {
    const updated = await newsApi.update(id, item);
    setNews((prev) => prev.map((n) => (n.id === id ? updated : n)));
  };
  const deleteNews = async (id) => {
    await newsApi.delete(id);
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  // ── Événements ──
  const addEvent = async (item) => {
    const created = await eventsApi.create(item);
    setEvents((prev) => [...prev, created]);
  };
  const updateEvent = async (id, item) => {
    const updated = await eventsApi.update(id, item);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };
  const deleteEvent = async (id) => {
    await eventsApi.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // ── Espace documents ──
  const uploadDocuments = async (files, folderId) => {
    const created = await documentsApi.upload(files, folderId);
    setDocuments((prev) => [...created, ...prev]);
  };
  // `changes` : { title } pour renommer, { folderId } pour déplacer.
  const updateDocument = async (id, changes) => {
    const updated = await documentsApi.update(id, changes);
    setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };
  const deleteDocument = async (id) => {
    await documentsApi.delete(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const createFolder = async (item) => {
    const created = await foldersApi.create(item);
    setFolders((prev) => [...prev, created]);
  };
  // `changes` : { name } pour renommer, { parentId } pour déplacer.
  const updateFolder = async (id, changes) => {
    const updated = await foldersApi.update(id, changes);
    setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };
  const deleteFolder = async (id) => {
    await foldersApi.delete(id);
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  // ── Adhérents ──
  const addMember = async (item) => {
    const created = await membersApi.create(item);
    setMembers((prev) => [...prev, created]);
  };
  const updateMember = async (id, item) => {
    const updated = await membersApi.update(id, item);
    setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };
  const deleteMember = async (id) => {
    await membersApi.delete(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // ── Galerie ──
  const addPhoto = async (item) => {
    const created = await photosApi.create(item);
    setGallery((prev) => [created, ...prev]);
  };
  const deletePhoto = async (id) => {
    await photosApi.delete(id);
    setGallery((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        news, addNews, updateNews, deleteNews,
        events, addEvent, updateEvent, deleteEvent,
        documents, uploadDocuments, updateDocument, deleteDocument,
        folders, createFolder, updateFolder, deleteFolder,
        members, addMember, updateMember, deleteMember,
        gallery, addPhoto, deletePhoto,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit être utilisé dans un DataProvider.');
  return ctx;
}
