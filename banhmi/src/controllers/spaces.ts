import { getAllSpacesInfo, getSpaceDetails } from '@/services/spaceService';

export const getAllSpacesInfoHandler = async (_req, res) => {
  const spacesInfo = await getAllSpacesInfo();
  res.send(spacesInfo);
};

export const getSpaceDetailsHandler = async (req, res) => {
  const spaceDetails = await getSpaceDetails(req.params.spaceId);
  res.send(spaceDetails);
}
