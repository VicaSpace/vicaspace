import { prisma } from "@/db";

export const getAllSpacesInfo = async () => {
  const spacesInfo = await prisma.space.findMany({
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
  return spacesInfo;
};
