import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';
import { BuilderPage } from './pages/BuilderPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
