import { getAllSpacesInfo } from '../services/spaceService';

export const getAllSpacesInfoHandler = async (_req, res, next) => {
  try {
    const spacesInfo = await getAllSpacesInfo();
    res.send(spacesInfo);
  } catch (error) {
    next(error);
  }
};
