import { Space } from '@prisma/client';

import { prisma } from '@/db';
import { getAllSpacesInfo, getSpaceDetails } from '@/services/spaceService';

describe('test space service', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return a list of space info', async () => {
    const mockResponse = [
      {
        id: 1,
        name: 'Ho Chi Minh',
        latitude: 10.762622,
        longitude: 106.660172,
        startTime: new Date(2022, 11, 5),
        members: [
          {
            id: 1,
            username: 'richard',
          },
          {
            id: 2,
            username: 'john',
          },
        ],
        urlVideo: 'https://www.youtube.com/',
        urlSpotify: 'https://www.spotify.com/',
        timezone: 'Asia/HCM',
        pomodoroDuration: 1500,
        shortBreakDuration: 300,
        longBreakDuration: 1800,
      },
      {
        id: 2,
        name: 'Ha Noi',
        latitude: 21.033333,
        longtitude: 105.849998,
        startTime: new Date(2022, 11, 5),
        members: [],
        urlVideo: 'https://www.youtube.com/',
        urlSpotify: 'https://www.spotify.com/',
        timezone: 'Asia/HCM',
        pomodoroDuration: 1500,
        shortBreakDuration: 300,
        longBreakDuration: 1800,
      },
    ];
    jest
      .spyOn(prisma.space, 'findMany')
      .mockResolvedValue(mockResponse as unknown as Space[]);
    const value = await getAllSpacesInfo();
    expect(value).toStrictEqual(
      mockResponse.map((item) => {
        return {
          ...item,
          serverTime: new Date(2020, 3, 1),
        };
      })
    );
  });

  it('should throw error on getting all spaces info', () => {
    jest.spyOn(prisma.space, 'findMany').mockRejectedValue(new Error());
    expect(getAllSpacesInfo).rejects.toThrow();
  });

  it('should return the detail of a space', async () => {
    const mockResponse = {
      id: 2,
      name: 'Ha Noi',
      latitude: 21.033333,
      longitude: 105.849998,
      startTime: '2022-10-10T23:50:21.817Z',
      members: [
        {
          id: 1,
          name: 'richard',
        },
        {
          id: 2,
          name: 'minh',
        },
      ],
      urlVideo: 'https://www.youtube.com/',
      urlSpotify: 'https://www.spotify.com/',
      timezone: 'Asia/HCM',
      pomodoroDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 1800,
    };
    jest
      .spyOn(prisma.space, 'findFirstOrThrow')
      .mockResolvedValue(mockResponse as unknown as Space);
    const value = await getSpaceDetails(2);
    expect(value).toStrictEqual({
      ...mockResponse,
      serverTime: new Date(2020, 3, 1),
    });
  });

  it('should throw error on getting a space detail', () => {
    jest.spyOn(prisma.space, 'findFirstOrThrow').mockRejectedValue(new Error());
    expect(getSpaceDetails(2)).rejects.toThrow();
  });
});
