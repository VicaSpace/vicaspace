import { getAllSpacesInfo } from '@/services/spaceService';

export const getAllSpacesInfoHandler = async (_req, res, next) => {
  const spacesInfo = await getAllSpacesInfo();
  res.send(spacesInfo);
};
