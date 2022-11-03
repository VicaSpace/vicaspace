import axios from 'axios';
import process from 'process';

const URL = process.env.REACT_APP_BACKEND_URL ?? '';

export const signInViaAPI = async (
  username: string,
  hashedPassword: string
) => {
  const res = await axios.post(`${URL}/api/auth/login`, {
    username,
    hashedPassword,
  });
  return res.data;
};

export const getSaltViaAPI = async (username: string) => {
  const res = await axios.get(`${URL}/api/auth/users/${username}/salt`);
  return res.data.salt;
};

export const getUserInfoViaAPI = async (accessToken: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const res = await axios.get(`${URL}/api/auth/info`, config);
  return res;
};

export const getRegisterSaltViaAPI = async () => {
  const res = await axios.get(`${URL}/api/auth/salt`);
  return res.data.salt;
};

export const registerViaAPI = async (
  username: string,
  salt: string,
  hashedPassword: string
) => {
  const res = await axios.post(`${URL}/api/auth/register`, {
    username,
    salt,
    hashedPassword,
  });
  return res.data;
};
