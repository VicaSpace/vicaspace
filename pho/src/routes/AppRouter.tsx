import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Pomodoro from '@/components/Pomodoro/Pomodoro';
import Video from '@/components/VideoContainer/Video';
import AboutPage from '@/pages/about';
import HomePage from '@/pages/home';
import NotFound404 from '@/pages/notfound404';
import SpacePage from '@/pages/space';

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
          <Route path="/spaces/:id" element={<SpacePage />} />
          <Route
            path="/pomo"
            element={
              <Pomodoro timestamp={1666794382000} serverTime={Date.now()} />
            }
          />
          <Route
            path="/video"
            element={
              <Video url="https://www.youtube.com/watch?v=cDYzwFEFLvQ" />
            }
          />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
