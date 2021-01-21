import { Router } from 'express';
import LinkStationController from '../../controllers/LinkStation';

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
    /* post API for finding the most suitable linkStation with most power */
    this.router.post('/findLinkStationForDevice', this._controller.findSuitableLinkStation);
  }
}

export = new LinkStationRouter().router;
