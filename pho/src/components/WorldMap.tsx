import React, { useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

import DrawerComponent from '@/components/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import {
  SpaceLocation,
  SpaceState,
  fetchAllSpaces,
} from '@/states/spaces/slice';

const WorldMap: React.FC<{}> = () => {
  const spaceState: SpaceState = useAppSelector((state) => state.spacesSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchAllSpaces());
  }, []);

  return (
    <>
      <DrawerComponent />
      <ReactMapGL
        initialViewState={{
          longitude: 105.8067,
          latitude: 15.9031,
          zoom: 1,
        }}
        style={{ height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      >
        {spaceState.data?.map((space: SpaceLocation) => (
          <Marker
            key={space.name}
            latitude={space.latitude}
            longitude={space.longitude}
          ></Marker>
        ))}
      </ReactMapGL>
    </>
  );
};

export default WorldMap;
