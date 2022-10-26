import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import {
  Box,
  Center,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';

import SignInComponent from '@/components/SignInComponent';

function DrawerComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const renderContent = () => {
    return <SignInComponent />;
  };

  return (
    <Box zIndex={99} position="absolute">
      <Center width="40px" height="100vh">
        <IconButton
          marginLeft="15px"
          backgroundColor="#EEF1FF"
          aria-label="drawer opener"
          icon={<ChevronRightIcon />}
          onClick={onOpen}
        />
      </Center>
      <Drawer
        id="drawer-container"
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        size="md"
      >
        <DrawerContent backgroundColor="#EEF1FF">
          <DrawerCloseButton top="50vh" right="-45px">
            <IconButton
              backgroundColor="#EEF1FF"
              aria-label="drawer closer"
              icon={<ChevronLeftIcon />}
              onClick={onOpen}
            />
          </DrawerCloseButton>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default DrawerComponent;
