import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import WebSocketProvider from '@/modules/ws/WebSocketProvider';
import AppRouter from '@/routes/AppRouter';
import { store } from '@/states/store';
import { theme } from '@/theme';

const App: React.FC<{}> = () => {
  return (
    <>
      <HelmetProvider>
        <Provider store={store}>
          <WebSocketProvider>
            <ChakraProvider theme={theme}>
              <AppRouter />
            </ChakraProvider>
          </WebSocketProvider>
        </Provider>
      </HelmetProvider>
    </>
  );
};

export default App;
