import axios from 'axios';

import config from '@/config';

export interface GetSpaceDetailResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  startTime: string;
  serverTime: string;
  members: Array<{
    id: number;
    username: string;
  }>;
  urlVideo: string;
  urlSpotify: string;
}

/**
 * Get Space detail by space's ID
 * @param id ID of Space
 */
export const getSpaceDetail = async (
  id: number
): Promise<GetSpaceDetailResponse> => {
  const res = await axios.get(`${config.endpoint.banhmi}/api/spaces/${id}`);
  return res.data;
};
