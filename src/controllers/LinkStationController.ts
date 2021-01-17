import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../errors/ErrorHandler';

class LinkStationController {
  defaultMethod = () => {
    throw new ErrorHandler(501, 'Unmplemented method');
  }

  /**
   * Get most suitable link station with most power for given device points (x, y)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @return {Object}
   */
  bestLinkStation = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
      if (Object.keys(req.body).length) {
        return res.status(200).json(req.body);
      } else {
        throw new ErrorHandler(422, 'No/insufficient data for device points');
      }
    } catch(error) {
      next(error);
    }
  };
}

export = new LinkStationController();