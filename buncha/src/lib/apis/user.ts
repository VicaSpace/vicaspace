import axios from 'axios';

import config from '@/config';

export interface GetUserBySocketIdResponse {
  id: number;
  username: string;
  spaceId: number;
  socketId: string;
  updatedAt: string;
}

/**
 * Get User by socket ID
 * @param socketId Socket ID
 * @returns User
 */
export const getUserBySocketId = async (
  socketId: string
): Promise<GetUserBySocketIdResponse | null> => {
  const res = await axios.get(
    `${config.endpoint.banhmiApi}/users?socketId=${socketId}`
  );
  const data: GetUserBySocketIdResponse[] = res.data;
  if (data.length === 0) return null;
  return data[0];
};
