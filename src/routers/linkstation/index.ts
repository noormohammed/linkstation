import { NextFunction, Request, Response, Router } from 'express';
import LinkStationController from '../../controllers/LinkStationController';

class LinkStationRouter {
  private _router = Router();
  private _controller = LinkStationController;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    /* this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = this._controller.defaultMethod();
        res.status(200).json(result);
      }
      catch (error) {
        next(error);
      }
    }); */

    /* post API for finding the most suitable linkStation with most power */
    this.router.post('/find', this._controller.bestLinkStation);

  }
}

export = new LinkStationRouter().router;