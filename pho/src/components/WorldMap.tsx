import React from 'react';
import { Map } from 'react-map-gl';

import DrawerComponent from '@/components/DrawerComponent';

const WorldMap: React.FC<{}> = () => {
  return (
    <>
      <DrawerComponent />
      <Map
        initialViewState={{
          longitude: 105.8067,
          latitude: 15.9031,
          zoom: 1,
        }}
        style={{ height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      />
    </>
  );
};

export default WorldMap;
