/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Library from './pages/Library';
import Search from './pages/Search';
import History from './pages/History';
import Profile from './pages/Profile';
import ComicDetail from './pages/ComicDetail';
import Reader from './pages/Reader';
import Login from './pages/Login';
import Downloads from './pages/Downloads';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Library />} />
              <Route path="search" element={<Search />} />
              <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="profile" element={<Profile />} />
              <Route path="downloads" element={<Downloads />} />
              <Route path="comic/:id" element={<ComicDetail />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route path="/read/:comicId/:chapterId" element={<Reader />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

