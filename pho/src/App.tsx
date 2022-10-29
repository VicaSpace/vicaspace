import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Pomodoro from '@/components/Pomodoro/Pomodoro';
import Video from '@/components/VideoContainer/Video';
import WebSocketProvider from '@/modules/ws/WebSocketProvider';
import AboutPage from '@/pages/about';
import ErrorPage from '@/pages/error';
import HomePage from '@/pages/home';
import { store } from '@/states/store';

/// Routes config
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/pomo',
    element: <Pomodoro timestamp={1666794382000} serverTime={Date.now()} />,
  },
  {
    path: '/video',
    element: <Video url="https://www.youtube.com/watch?v=cDYzwFEFLvQ" />,
  },
]);

const App: React.FC<{}> = () => {
  return (
    <>
      <HelmetProvider>
        <Provider store={store}>
          <WebSocketProvider>
            <ChakraProvider>
              <RouterProvider router={router} />
            </ChakraProvider>
          </WebSocketProvider>
        </Provider>
      </HelmetProvider>
    </>
  );
};

export default App;
