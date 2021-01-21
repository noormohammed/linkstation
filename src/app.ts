import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import MainRouter from './routers/MainRouter';
import ErrorHandler from './errors/ErrorHandler';

// load the environment variables from the .env file
dotenv.config({
  path: '.env'
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
  app = express();
  router = MainRouter;
}

// initialize server app
const server = new Server();

// make server app handle any route starting with '/api'
server.app.use('/api/v1', server.router);

// make server app handle any error
server.app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    statusCode: err.statusCode,
    message: err.message
  });
});

let myServer;

// make server listen on some port
((port = process.env.APP_PORT || 5000) => {
  myServer = server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();

module.exports = myServer;
