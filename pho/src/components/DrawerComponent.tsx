import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import {
  Box,
  Center,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import SignInComponent from '@/components/SignInContainer/SignInComponent';
import SpaceSpeakerSection from '@/components/SpaceSpeaker/SpaceSpeakerSection';
import { getUserInfoViaAPI } from '@/lib/apis/auth';
import { signIn, signOut } from '@/states/auth/slice';
import { useAppDispatch, useAppSelector } from '@/states/hooks';

function DrawerComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.authSlice.isAuthenticated
  );

  const { id: spaceId } = useAppSelector(
    (state) => state.spaceDetailSlice.data
  );

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!isAuthenticated && accessToken) {
      getUserInfoViaAPI(accessToken)
        .then((response) => {
          const { id } = response.data;
          dispatch(signIn(id.toString()));
        })
        .catch((err) => {
          console.log(err);
          dispatch(signOut());
        });
    }
  }, []);

  const renderContent = () => {
    // Protected route
    if (!isAuthenticated) {
      return <SignInComponent />;
    }
    // Space ID is allocated or not
    if (spaceId) {
      return <SpaceSpeakerSection />;
    }
    return !isAuthenticated && <SignInComponent />;
  };

  return (
    <Box top={0} zIndex={99} position="absolute">
      <Center width="40px" height="100vh">
        <IconButton
          marginLeft="15px"
          backgroundColor="#EEF1FF"
          aria-label="drawer opener"
          icon={<ChevronRightIcon />}
          onClick={onOpen}
        />
      </Center>
      {/* Drawer Container */}
      <Drawer
        id="drawer-container"
        isOpen={isOpen}
        closeOnOverlayClick={false}
        placement="left"
        onClose={onClose}
        size="md"
      >
        <DrawerContent backgroundColor="#EEF1FF">
          <Box position="absolute" top="50vh" left="520px">
            <IconButton
              backgroundColor="#EEF1FF"
              aria-label="drawer closer"
              icon={<ChevronLeftIcon />}
              onClick={onClose}
            />
          </Box>
          {/* Drawer's Content */}
          {renderContent()}
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default DrawerComponent;
