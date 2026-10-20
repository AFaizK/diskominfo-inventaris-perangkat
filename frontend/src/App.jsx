import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@idds/react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import InventarisList from './components/inventaris/InventarisList';
import InventarisDetail from './components/inventaris/InventarisDetail';
import InventarisForm from './components/inventaris/InventarisForm';
import API from './api/axios';

export default function App() {
  // Cek ketersediaan token saat pertama kali dimuat
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  );

  const handleLogout = useCallback(async () => {
    try {
      await API.post('/logout');
    } catch (err) {
      console.error("Gagal logout di server", err);
    } finally {
      // Hapus token lokal & reset state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  }, []);

  // Halaman terproteksi: belum login -> lempar ke /login
  const protect = (page) =>
    isAuthenticated
      ? <Layout onLogout={handleLogout}>{page}</Layout>
      : <Navigate to="/login" replace />;

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Sudah login -> tidak perlu ke halaman login lagi */}
          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/inventaris" replace />
                : <Login onLoginSuccess={() => setIsAuthenticated(true)} />
            }
          />

          <Route path="/dashboard" element={protect(<Dashboard />)} />

          <Route path="/inventaris" element={protect(<InventarisList />)} />
          <Route path="/inventaris/baru" element={protect(<InventarisForm />)} />
          <Route path="/inventaris/:id" element={protect(<InventarisDetail />)} />
          <Route path="/inventaris/:id/ubah" element={protect(<InventarisForm />)} />

          {/* URL lain diarahkan sesuai status login */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/inventaris' : '/login'} replace />}
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
