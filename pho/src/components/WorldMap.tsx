import React, { useEffect } from 'react';
import { Map } from 'react-map-gl';

import DrawerComponent from '@/components/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { fetchAllSpaces } from '@/states/spaces/slice';

const WorldMap: React.FC<{}> = () => {
  const spaces = useAppSelector((state) => state.spacesSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchAllSpaces());
  }, []);

  console.log(spaces);

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
