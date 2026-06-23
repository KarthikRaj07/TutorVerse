import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import ClassPage from './pages/ClassPage';
import SubjectPage from './pages/SubjectPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/class" element={<ClassPage />} />
        <Route path="/subjects" element={<SubjectPage />} />
        <Route path="/chat/:subject" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}
