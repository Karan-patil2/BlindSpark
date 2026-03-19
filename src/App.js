import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './Intro';
import Login from './Login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"      element={<Intro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
