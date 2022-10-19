import { Space } from '@prisma/client';

import { prisma } from '../../db';
import { getAllSpacesInfo } from '../spaceService';

describe('test space service', () => {
  it('should return a list of space info', async () => {
    const expected = [
      {
        id: 1,
        name: 'Ho Chi Minh',
        latitude: 10.762622,
        longitude: 106.660172,
      },
      {
        id: 2,
        name: 'Ha Noi',
        latitude: 21.033333,
        longtitude: 105.849998,
      },
    ];
    jest.spyOn(prisma.space, 'findMany').mockResolvedValue(expected as Space[]);
    const value = await getAllSpacesInfo();
    expect(value).toBe(expected);
  });
});
