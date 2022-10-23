import { HamburgerIcon } from '@chakra-ui/icons';

import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';

function DrawerComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        top={0}
        left={0}
        marginTop="15px"
        marginLeft="15px"
        backgroundColor="#EEF1FF"
        aria-label="drawer opener"
        icon={<HamburgerIcon />}
        onClick={onOpen}
      />

      <Drawer
        id="drawer-container"
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        size="md"
      >
        <DrawerContent backgroundColor="#EEF1FF">
          <DrawerCloseButton />
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
