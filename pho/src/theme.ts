// 1. Import `extendTheme`
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    heading: `'Inconsolata', monospace`,
    body: `'Inconsolata', monospace`,
  },
  components: {
    Drawer: {
      variants: {
        interactOutside: {
          parts: ['dialog, dialogContainer'],
          dialog: {
            pointerEvents: 'auto',
          },
          dialogContainer: {
            pointerEvents: 'none',
          },
        },
      },
    },
  },
});
