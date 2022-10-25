import axios from 'axios';

import config from '@/config';

/**
 * Fetch list of spaces from BanhMi API service
 * @returns List of spaces
 */
export const getAllSpaces = async () => {
  const res = await axios.get(`${config.apiUrl.banhmi}/spaces`);
  return res.data;
};
