import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL ?? '';
/**
 * Get Space detail by space's ID
 * @param id ID of Space
 */
export const getSpaceDetail = async (id: number) => {
  const res = await axios.get(`${URL}/api/spaces/${id}`);
  return res.data.salt;
};
