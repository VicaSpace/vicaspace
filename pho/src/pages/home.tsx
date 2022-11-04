import React from 'react';
import { Helmet } from 'react-helmet-async';

import DrawerComponent from '@/components/DrawerComponent';
import WorldMapTile from '@/components/WorldMap/WorldMapTile';

const HomePage: React.FC<{}> = () => {
  return (
    <>
      {/* Meta section */}
      <Helmet>
        <title>VicaSpace - Chill lounge</title>
        <meta name="Let's chill in this McHouse Lounge" content="VicaSpace" />
      </Helmet>
      <DrawerComponent />
      {/* Page Body */}
      <WorldMapTile />
    </>
  );
};

export default HomePage;
