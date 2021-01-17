import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../errors/ErrorHandler';
import { readJsonFileSync } from '../helpers/Helpers';

/**
 * LinkStation Controller for finding the most suitable link station with max power
 */
class LinkStation {
  private linkStationLocations;

  /**
   * LinkStation Constructor
   */
  constructor() {
    this.linkStationLocations = this.getLinkStationsLocations();
  }

  /**
   * Calculate distance from each of the ls locations
   * @param {object} points Given device's location in points (x, y)
   * @param {object} lsElm Given link station location to calculate distance
   * @returns {number} distance of the device from link station along with reach
   */
  private calcDistance = (points: { x: number; y: number }, lsElm: { x: number; y: number }) => {
    if (typeof points === 'object' && typeof lsElm === 'object') {
      const xPart = Math.pow(Math.abs(points.x - lsElm.x), 2);
      const yPart = Math.pow(Math.abs(points.y - lsElm.y), 2);
      /* let xPart = Math.pow(Math.abs(lsElm.x - points.x), 2);
      let yPart = Math.pow(Math.abs(lsElm.y - points.y), 2); */

      return Math.sqrt(xPart + yPart);
    } else {
      return 0;
    }
  };

  /**
   * Calculate link station power
   * @param {object} points Given device's location in points (x, y)
   * @param {object} lsElm Given link station location with reach
   * @returns {number} calculated power of the link station for the given device
   */
  private calcPower = (points: { x: number; y: number }, lsElm: { x: number; y: number; r: number }) => {
    if (typeof points == 'object' && typeof lsElm == 'object') {
      let distance = this.calcDistance(points, { x: lsElm.x, y: lsElm.y });

      // Check if distance is greater than reach
      if (distance > lsElm.r) {
        return 0;
      } else {
        // calculate the power
        // power = (reach - device's distance from linkstation)^2
        return Math.pow(Math.abs(lsElm.r - distance), 2);
      }
    } else {
      return 0;
    }
  };

  /**
   * Get the given link station locations from the JSON file
   */
  private getLinkStationsLocations = () => {
    // read the location of the link stations from given json
    return readJsonFileSync('linkstations_locations.json');
  };

  /**
   * Get most suitable/nearest link station with max power for given device points (x, y)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @return {Object}
   */
  findSuitableLinkStation = (req: Request, res: Response, next: NextFunction) => {
    const points = req.body;
    let result = false;
    try {
      if (Object.keys(req.body).length && points.hasOwnProperty('x') && points.hasOwnProperty('y')) {
        if (this.linkStationLocations.hasOwnProperty('locations')) {
          let lsLocations = this.linkStationLocations['locations'];

          // calculate the power for the given device
          let powerObj = [];
          for (const location in lsLocations) {
            if (Object.prototype.hasOwnProperty.call(lsLocations, location)) {
              const element = lsLocations[location];
              /* [x, y, r] => points (x, y) and have reach (r) */
              powerObj.push(this.calcPower(points, element));
            }
          }

          // find the max power from the powerObj
          if (powerObj.length) {
            const power = Math.max.apply(null, powerObj);
            if (power > 0) {
              let bestLS = lsLocations[powerObj.indexOf(power)];

              return res.status(200).json({
                message: `Best link station for point ${points.x},${points.y} is ${bestLS.x},${bestLS.y} with power ${power}`
              });
            }
          }
        }
      } else {
        throw new ErrorHandler(422, 'No/insufficient data for device points');
      }

      return res.status(404).json({
        message: `No link station within reach for point ${points.x},${points.y}`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export = new LinkStation();
