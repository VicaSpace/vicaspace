import { Request, Response } from 'express';

import { getSpaceTime } from '@/services/clocktime';

async function getServerTime(req: Request, res: Response) {
  res.status(200).json({
    serverTime: Date.now(),
  });
}

async function getSpaceClocktime(req: Request, res: Response) {
  try {
    const space = await getSpaceTime(parseInt(req.params.spaceId));
    res.status(200).json({
      spaceId: space.id,
      startTime: space.startTime,
      serverTime: Date.now(),
    });
  } catch {
    res.status(404).json({
      error: 'Space not found',
    });
  }
}

export { getSpaceClocktime, getServerTime };
