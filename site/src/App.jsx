import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import News from './pages/News';
import Events from './pages/Events';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminEvents from './pages/admin/AdminEvents';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminMembers from './pages/admin/AdminMembers';
import AdminGallery from './pages/admin/AdminGallery';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/actualites" element={<News />} />
              <Route path="/evenements" element={<Events />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Administration */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/actualites" element={<AdminNews />} />
              <Route path="/admin/evenements" element={<AdminEvents />} />
              <Route path="/admin/documents" element={<AdminDocuments />} />
              <Route path="/admin/adherents" element={<AdminMembers />} />
              <Route path="/admin/galerie" element={<AdminGallery />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
