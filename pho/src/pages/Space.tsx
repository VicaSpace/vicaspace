import { Heading } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Page for Voice From Space. DEMO ONLY! Might be removed
 * or replaced in the future merge.
 */
const SpacePage: React.FC<{}> = () => {
  const { spaceId } = useParams();

  /**
   * Let's just assume that when you're on this page, you'll
   * first navigate through the URL to this space. However,
   * for UX, should enable a button for User to click to join.
   */

  useEffect(() => {
    //
  }, []);

  return (
    <div>
      <Heading>Space #{spaceId}</Heading>
    </div>
  );
};

export default SpacePage;
