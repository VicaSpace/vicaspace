import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import { Box, Drawer, DrawerContent, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import ChatContainer from '@/components/ChatArea/ChatContainer/ChatContainer';
import PopularSpace from '@/components/PopularSpace/PopularSpace';
import Register from '@/components/RegisterContainer/Register';
import SignInComponent from '@/components/SignInContainer/SignInComponent';
import SpaceSpeakerSection from '@/components/SpaceSpeaker/SpaceSpeakerSection';
import { getUserInfoViaAPI } from '@/lib/apis/auth';
import { signIn, signOut } from '@/states/auth/slice';
import { useAppDispatch, useAppSelector } from '@/states/hooks';

import './DrawerComponent.css';

function DrawerComponent() {
  const { pathname } = useLocation();
  const isAllSpacesURL = matchPath(
    {
      path: '/',
    },
    pathname
  );
  const isSpecificSpaceURL = matchPath(
    {
      path: '/spaces/:id',
    },
    pathname
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.authSlice.isAuthenticated
  );

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!isAuthenticated && accessToken) {
      getUserInfoViaAPI(accessToken)
        .then((response) => {
          const user = response.data;
          dispatch(signIn(user));
        })
        .catch((err) => {
          console.log(err);
          dispatch(signOut());
        });
    }
  }, []);

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoginOrRegisterRoute, setIsLoginOrRegisterRoute] = useState(false);

  const renderContent = () => {
    // Protected route
    if (!isAuthenticated) {
      if (!isLoginOrRegisterRoute) setIsLoginOrRegisterRoute(true);
      if (isRegistering) {
        return (
          <Register
            onOpenLogin={() => {
              setIsRegistering(false);
            }}
          />
        );
      } else {
        return (
          <SignInComponent
            onOpenRegister={() => {
              setIsRegistering(true);
            }}
          />
        );
      }
    } else {
      if (isLoginOrRegisterRoute) setIsLoginOrRegisterRoute(false);
    }
    if (isAllSpacesURL) return <PopularSpace isDrawerOpen={isDrawerOpen} />;
    else if (isSpecificSpaceURL)
      return (
        <>
          <SpaceSpeakerSection isDrawerOpen={isDrawerOpen} />
          <ChatContainer isDrawerOpen={isDrawerOpen} />
        </>
      );
  };

  const toggleDrawer = () => {
    const drawer = document.getElementById('chakra-modal-drawer-container');
    setIsDrawerOpen((prev) => {
      return !prev;
    });

    const drawerCssClasses = drawer?.className;

    // First loading
    if (
      !drawerCssClasses?.includes('drawer-open') &&
      !drawerCssClasses?.includes('drawer-close-popular-spaces') &&
      !drawerCssClasses?.includes('drawer-close-inside-space') &&
      !drawerCssClasses?.includes('drawer-close-login-register')
    ) {
      if (isLoginOrRegisterRoute)
        return drawer?.classList.add('drawer-close-login-register');
      else if (isAllSpacesURL)
        return drawer?.classList.add('drawer-close-popular-spaces');
      else if (isSpecificSpaceURL)
        return drawer?.classList.add('drawer-close-inside-space');
    }

    // Toggle
    if (drawerCssClasses?.includes('drawer-open')) {
      if (isLoginOrRegisterRoute)
        return drawer?.classList.replace(
          'drawer-open',
          'drawer-close-login-register'
        );
      else if (isAllSpacesURL)
        return drawer?.classList.replace(
          'drawer-open',
          'drawer-close-popular-spaces'
        );
      else if (isSpecificSpaceURL)
        return drawer?.classList.replace(
          'drawer-open',
          'drawer-close-inside-space'
        );
    } else {
      if (isLoginOrRegisterRoute)
        return drawer?.classList.replace(
          'drawer-close-login-register',
          'drawer-open'
        );
      else if (isAllSpacesURL)
        return drawer?.classList.replace(
          'drawer-close-popular-spaces',
          'drawer-open'
        );
      else if (isSpecificSpaceURL)
        return drawer?.classList.replace(
          'drawer-close-inside-space',
          'drawer-open'
        );
    }
  };

  return (
    <Box top={0} zIndex={99} position="absolute">
      <Drawer
        id="drawer-container"
        isOpen={true}
        closeOnOverlayClick={false}
        placement="left"
        onClose={() => {}}
        size="md"
        variant="interactOutside"
      >
        <DrawerContent
          backgroundColor="#EEF1FF"
          borderRightRadius="12px"
          border="2px solid #B1B2FF"
        >
          <Box position="absolute" top="50vh" left="520px">
            <IconButton
              borderRadius="12px"
              border="2px solid #B1B2FF"
              backgroundColor="#EEF1FF"
              aria-label="drawer btn"
              icon={isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              onClick={toggleDrawer}
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
