import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import pinoHttp from 'pino-http';

import router from '@/routes';
import { logger } from '@/utils/logger';

const pinoHttpMiddleware = pinoHttp();

const main = async () => {
  /* Express App setup */
  const app = express();
  app.use(cors());
  app.set('trust proxy', 1);
  app.use(pinoHttpMiddleware);
  app.use(express.json());

  app.use('/api', router);

  app.get('/', (_req, res) => {
    res.send('<h1>Welcome to BanhMi Server.</h1>');
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).send({ error: err.message });
    next();
  });

  /* Server Setup */
  const server = http.createServer(app);

  server.listen(process.env.APP_PORT, () => {
    logger.info(
      `Server listening on ${process.env.APP_HOST}:${process.env.APP_PORT}`
    );
  });
};

export default main;
