import config from '@/config';
import { createAxiosAuth } from '@/lib/axios-auth';

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
  socketId: string,
  accessToken: string
): Promise<GetUserBySocketIdResponse | null> => {
  const axiosAuth = createAxiosAuth(accessToken);
  const res = await axiosAuth.get(
    `${config.endpoint.banhmiApi}/users?socketId=${socketId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data: GetUserBySocketIdResponse[] = res.data;
  if (data.length === 0) return null;
  return data[0];
};
