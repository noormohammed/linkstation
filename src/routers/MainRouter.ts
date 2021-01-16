import { NextFunction, Router } from 'express';
import * as bodyParser from 'body-parser';
import LinkStationRouter from './linkstation';
import ErrorHandler from '../errors/ErrorHandler';

class MainRouter {
  private _router = Router();
  private _subrouterLS = LinkStationRouter;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    /* Parse the request body */
    this._router.use(bodyParser.json());
    this._router.use(bodyParser.urlencoded({ extended: true }));

    /* Some rules for our API's */
    this._router.use((req, res, next) => {
      //  deepcode ignore TooPermissiveCorsHeader: This is only for dev/testing purpose
      res.header('Access-Control-Allow-Origin', '*'); // Change this for production
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, GET');
        return res.status(200).json({});
      }

      next();
    });
  
    this._router.use('/linkstation', this._subrouterLS);

    this._router.use((req, res) => {
      throw new ErrorHandler(404, 'Not Found');
    });
  }
}

export = new MainRouter().router;