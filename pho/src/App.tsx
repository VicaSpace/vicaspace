import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import DrawerComponent from '@/components/DrawerComponent';
import WebSocketProvider from '@/modules/ws/WebSocketProvider';
import AppRouter from '@/routes/AppRouter';
import { store } from '@/states/store';

const App: React.FC<{}> = () => {
  return (
    <>
      <HelmetProvider>
        <Provider store={store}>
          <WebSocketProvider>
            <ChakraProvider>
              <AppRouter />
              <DrawerComponent />
            </ChakraProvider>
          </WebSocketProvider>
        </Provider>
      </HelmetProvider>
    </>
  );
};

export default App;
