import { prisma } from "../db";

export const getAllSpacesInfo = async () => {
  return await prisma.space.findMany({
    where: {
      active: true
    },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
    }
  });
};
