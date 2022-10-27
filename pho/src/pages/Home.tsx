import React from 'react';
import { Helmet } from 'react-helmet-async';

import WorldMap from '@/components/WorldMap';

const HomePage: React.FC<{}> = () => {
  return (
    <>
      {/* Meta section */}
      <Helmet>
        <title>VicaSpace - Chill lounge</title>
        <meta name="Let's chill in this VicaSpace Lounge" content="VicaSpace" />
      </Helmet>
      <WorldMap />
    </>
  );
};

export default HomePage;
