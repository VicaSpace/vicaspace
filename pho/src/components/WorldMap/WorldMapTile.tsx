import React, { useEffect } from 'react';
import ReactMapGL from 'react-map-gl';

import DrawerComponent from '@/components/DrawerComponent';
import CustomMarker from '@/components/WorldMap/CustomMarker/CustomMarker';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import {
  SpaceLocation,
  SpaceState,
  fetchAllSpaces,
} from '@/states/spaces/slice';

const WorldMapTile: React.FC<{}> = () => {
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
          zoom: 3.5,
        }}
        style={{ height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        renderWorldCopies={false}
      >
        {spaceState.data?.map((space: SpaceLocation) => (
          <CustomMarker key={space.id} space={space} />
        ))}
      </ReactMapGL>
    </>
  );
};

export default WorldMapTile;
