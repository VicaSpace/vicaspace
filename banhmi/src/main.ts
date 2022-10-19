import 'dotenv/config';
import express from 'express';
import http from 'http';
import pinoHttp from 'pino-http';
import { Server } from 'socket.io';

import { logger } from '@/utils/logger';

import router from './routes';

import createError from 'http-errors';

const pinoHttpMiddleware = pinoHttp();

const main = async () => {
  /* Server Setup */
  const app = express();
  // TODO: Create HTTPS server instead of HTTP
  app.use(pinoHttpMiddleware);
  app.use(express.json());

  app.use('/api', router);

  app.get('/', (_req, res) => {
    res.send('<h1>Welcome to the WebRTC Demo App.</h1>');
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ error: err});
  });

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  /* Socket setup */
  io.on('connection', async (socket) => {
    logger.info('A user has connected');
    socket.emit('connect-success', { socketId: socket.id });

    socket.on('disconnect', () => {
      logger.info('User has disconnected');
    });

    socket.on('ping', () => {
      logger.info('Server has been ping!');
      socket.emit('pong');
    });
  });

  server.listen(process.env.APP_PORT, () => {
    logger.info(
      `Server listening on ${process.env.APP_HOST}:${process.env.APP_PORT}`
    );
  });
};

export default main;
