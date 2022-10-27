import axios from 'axios';

import config from '@/config';
import { GetAllSpacesResponse } from '@/lib/types/apis/space';

/**
 * Fetch list of spaces from BanhMi API service
 * @returns List of spaces
 */
export const getAllSpaces = async (): Promise<GetAllSpacesResponse> => {
  const res = await axios.get(`${config.endpoint.banhmiApi}/spaces`);
  return res.data;
};
