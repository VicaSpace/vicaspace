import axios from 'axios';

/**
 * Create Axios instance (Auth version)
 * @param accessToken Access Token
 * @returns Axios (Auth version)
 */
export const createAxiosAuth = (accessToken: string) => {
  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return axiosAuth;
};
