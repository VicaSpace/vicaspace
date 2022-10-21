import { getAllSpacesInfo, getSpaceDetails } from '@/services/spaceService';

export const getAllSpacesInfoHandler = async (_req, res) => {
  const spacesInfo = await getAllSpacesInfo();
  res.status(200).json(spacesInfo);
};

export const getSpaceDetailsHandler = async (req, res) => {
  const spaceDetails = await getSpaceDetails(req.params.spaceId);
  res.status(200).json(spaceDetails);
}
