import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import IndexPage from '@/pages';
import AboutPage from '@/pages/about';
import NotFoundPage from '@/pages/notfound';

/**
 * Handles the routing of SPA
 */
const AppRouter: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
