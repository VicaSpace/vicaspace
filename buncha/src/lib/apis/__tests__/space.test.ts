import mockAxios from 'jest-mock-axios';

import config from '@/config';
import { getAllSpaces } from '@/lib/apis/space';

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe('test getAllSpaces', () => {
  it('should return list of spaces from BanhMi API', async () => {
    const spaces = [
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
        longitude: 105.849998,
      },
    ];

    mockAxios.get.mockResolvedValueOnce({ data: spaces });
    const result = await getAllSpaces();

    // then
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${config.endpoint.banhmiApi}/spaces`
    );
    expect(result).toEqual(spaces);
  });

  it('should throw error when call made to API failed', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    expect(getAllSpaces()).rejects.toThrow();
    expect(getAllSpaces()).rejects.toMatchObject({
      message: 'Network Error',
    });
  });
});
