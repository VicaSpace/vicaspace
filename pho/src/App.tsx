import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import DrawerComponent from '@/components/DrawerComponent';
import Pomodoro from '@/components/Pomodoro/Pomodoro';
import WebSocketProvider from '@/modules/ws/WebSocketProvider';
import AboutPage from '@/pages/about';
import ErrorPage from '@/pages/error';
import IndexPage from '@/pages/home';
import { store } from '@/states/store';

/// Routes config
const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
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
]);

const App: React.FC<{}> = () => {
  return (
    <>
      <HelmetProvider>
        <Provider store={store}>
          <WebSocketProvider>
            <ChakraProvider>
              <RouterProvider router={router} />
              <DrawerComponent />
            </ChakraProvider>
          </WebSocketProvider>
        </Provider>
      </HelmetProvider>
    </>
  );
};

export default App;
