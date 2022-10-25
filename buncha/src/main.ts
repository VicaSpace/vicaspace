import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import https from 'httpolyglot';
import { ServerOptions } from 'https';
import { createWorker } from 'mediasoup';
import { Router } from 'mediasoup/node/lib/Router';
import { RtpCodecCapability } from 'mediasoup/node/lib/RtpParameters';
import path from 'path';
import pinoHttp from 'pino-http';
import { Server } from 'socket.io';

import { spaceCollection } from '@/data/collections';
import { getAllSpaces } from '@/lib/apis/space';
import { logger } from '@/lib/logger';

const pinoHttpMiddleware = pinoHttp();

const main = async () => {
  /* Express App setup */
  const app = express();
  app.set('trust proxy', 1);
  app.use(pinoHttpMiddleware);
  app.use(express.json());

  // Index handler
  app.get('/', (_req: Request, res: Response) => {
    res.send('<h1>Welcome to BunCha Communication Server.</h1>');
  });

  // Handles global error thrown
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).send({ error: err.message });
    next();
  });

  /* Server Setup */
  const options: ServerOptions = {
    key: readFileSync(path.join(__dirname, '../ssl/key.pem'), 'utf-8'),
    cert: readFileSync(path.join(__dirname, '../ssl/cert.pem'), 'utf-8'),
  };
  const server = https.createServer(options, app);
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // TODO: Add some middleware for socket authentication
  const worker = await createWorker();
  const mediaCodecs: RtpCodecCapability[] = [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
    },
  ];

  // NOTE: Each space has its own router for separate communication
  let spaceIds: number[] = [];
  try {
    const spaces = await getAllSpaces();
    spaceIds = spaces.map((space) => space.id);
  } catch (err) {
    logger.error('Failed to get list of spaces');
    logger.error(err);
  }

  // Populate mediasoup's router for each space id
  const routers = await Promise.all(
    new Array<Promise<Router>>(spaceIds.length).fill(
      worker.createRouter({ mediaCodecs })
    )
  );
  // Associate routers to space collection
  routers.forEach((router, i) => {
    spaceCollection[spaceIds[i]] = {
      router,
    };
  });
  logger.info(`Initialized routers for ${spaceIds.length} spaces 🚀`);

  /* Socket setup */
  io.on('connection', async (socket) => {
    logger.info('A user has connected');
    socket.emit('connect-success', { socketId: socket.id });

    socket.on('disconnect', () => {
      logger.info('User has disconnected');
    });
  });

  server.listen(process.env.APP_PORT, () => {
    logger.info(
      `Communication Server listening on ${process.env.APP_HOST}:${process.env.APP_PORT} ✅`
    );
  });
};

export default main;
