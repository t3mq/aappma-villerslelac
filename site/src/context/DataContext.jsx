import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { newsApi, eventsApi, documentsApi, membersApi, photosApi } from '../api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [members, setMembers] = useState([]);
  const [gallery, setGallery] = useState([]);

  // ── Fetch public data on mount ──
  useEffect(() => {
    newsApi.getAll().then(setNews).catch(console.error);
    eventsApi.getAll().then(setEvents).catch(console.error);
    documentsApi.getAll().then(setDocuments).catch(console.error);
    photosApi.getAll().then(setGallery).catch(console.error);
  }, []);

  // ── Fetch members (requires auth, called from admin pages) ──
  const fetchMembers = useCallback(() => {
    membersApi.getAll().then(setMembers).catch(console.error);
  }, []);

  // ── News CRUD ──
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

  // ── Events CRUD ──
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

  // ── Documents CRUD ──
  const addDocument = async (item) => {
    const created = await documentsApi.create(item);
    setDocuments((prev) => [created, ...prev]);
  };
  const deleteDocument = async (id) => {
    await documentsApi.delete(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // ── Members CRUD ──
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

  // ── Gallery CRUD ──
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
        documents, addDocument, deleteDocument,
        members, fetchMembers, addMember, updateMember, deleteMember,
        gallery, addPhoto, deletePhoto,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
