import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AboutPage from '@/pages/About';
import HomePage from '@/pages/Home';
import NotFound404 from '@/pages/NotFound404';
import SpacePage from '@/pages/Space';

/**
 * Handles the routing of SPA
 */
const AppRouter: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/spaces/:spaceId/voice" element={<SpacePage />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
