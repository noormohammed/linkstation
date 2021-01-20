import { NextFunction, Request, Response } from 'express';
import { type } from 'os';
import ErrorHandler from '../errors/ErrorHandler';

/**
 * Interface for device points (x, y)
 */
interface DevicePoint {
  x: number;
  y: number;
}

/**
 * Interface for link station points (x, y, r)
 */
interface LinkStationPoint {
  x: number;
  y: number;
  r: number;
}

type AllLinkStationsPoints = LinkStationPoint[];

/**
 * LinkStation Controller for finding the most suitable link station with max power
 */
class LinkStation {
  /**
   * Calculate distance from each of the ls locations
   * @param {object} points Given device's location in points (x, y)
   * @param {object} linkStation Given link station location to calculate distance
   * @returns {number} distance of the device from link station along with reach
   */
  private calculateDistance = (device: DevicePoint, linkStation: LinkStationPoint) => {
    // formula: d = √ (x2 − x1)2 + (y2 − y1)2
    const xPart = Math.abs(device.x - linkStation.x) ** 2;
    const yPart = Math.abs(device.y - linkStation.y) ** 2;
    return Math.sqrt(xPart + yPart);
  };

  /**
   * Calculate link station power
   * @param {object} points Given device's location in points (x, y)
   * @param {object} lsElm Given link station location with reach
   * @returns {number} calculated power of the link station for the given device
   */
  private calculatePower = (device: DevicePoint, linkStation: LinkStationPoint) => {
    const distance = this.calculateDistance(device, linkStation);

    // Check if distance is greater than link station reach
    if (distance > linkStation.r) return 0;

    // calculate power
    // power = (reach - device's distance from linkstation)^2
    return Math.abs(linkStation.r - distance) ** 2;
  };

  /**
   * Find the link station with maximum power from the given list of link stations
   * @param devicePoint device point from request data
   * @param allLinkStationsPoints all link stations points from request data
   * @returns returns an object with link station with maximum power or null if power is <= 0
   */
  private findMaxPowerLinkStation = (devicePoint: DevicePoint, allLinkStationsPoints: AllLinkStationsPoints) => {
    // calculate the power for the given device
    const powerObj = [];
    for (const linkStation of allLinkStationsPoints) {
      powerObj.push(this.calculatePower(devicePoint, linkStation));
    }

    if (!powerObj.length) throw new ErrorHandler(422, 'Cannot calculate power for the given link stations.');

    // find the max power from the powerObj
    const power = Math.max.apply(null, powerObj);

    if (power <= 0) return null;

    return { power, bestLinkStation: allLinkStationsPoints[powerObj.indexOf(power)] };
  };

  /**
   * Validator for DevicePoint
   * @param point given device point that needs to be validated
   */
  //  deepcode ignore no-any: Device points from Request Data could be anything
  private isDevicePoint = (point: any): point is DevicePoint => {
    return point && typeof point.x === 'number' && typeof point.y === 'number';
  };

  /**
   * Validator for LinkStationPoint
   * @param point given link station point that needs to be validated
   */
  //  deepcode ignore no-any: Link Station points from Request Data could be anything
  private isLinkStationPoint = (point: any): point is LinkStationPoint => {
    return point && typeof point.x === 'number' && typeof point.y === 'number' && typeof point.r === 'number';
  };

  /**
   * Validate the incoming request data for device point and link station points
   * @param request request data
   */
  //  deepcode ignore no-any: Request Data is unreliable and could be anything
  private validateRequest = (request: any) => {
    if (typeof request !== 'object' && !Object.keys(request).length) {
      throw new ErrorHandler(404, 'Please provide device point & link station points.');
    }

    if (!request.hasOwnProperty('devicePoint')) {
      throw new ErrorHandler(404, 'Please provide a device point (x, y).');
    }

    // Check if request contains Device location points as defined in DevicePoint
    if (!this.isDevicePoint(request.devicePoint)) {
      throw new ErrorHandler(404, `Invalid device point: ${JSON.stringify(request.devicePoint)}`);
    }

    if (!request.hasOwnProperty('linkStationPoints') || !Object.keys(request.linkStationPoints).length) {
      throw new ErrorHandler(404, 'Please provide link station points (x, y, r)');
    }

    // Check if request contains Link Station locations points as defined in LinkStationPoint
    for (const point of request.linkStationPoints) {
      if (!this.isLinkStationPoint(point)) {
        throw new ErrorHandler(404, `Invalid link station point: ${JSON.stringify(point)}`);
      }
    }
  };

  /**
   * Get most suitable/nearest link station with max power for given device points (x, y)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @return {Object}
   */
  findSuitableLinkStation = (req: Request, res: Response, next: NextFunction) => {
    try {
      this.validateRequest(req.body);

      const devicePoint = req.body.devicePoint;
      const allLinkStationsPoints = req.body.linkStationPoints;

      const result = this.findMaxPowerLinkStation(devicePoint, allLinkStationsPoints);

      if (!result) {
        return res.status(200).json({
          status: 'error',
          message: `No link station within reach for point ${devicePoint.x},${devicePoint.y}`
        });
      }

      /* Only if the value is float or in string format, example: 10.8788, fix the decimal value upto 2 */
      let power = !Number.isInteger(result.power) ? Number(result.power).toFixed(2) : result.power;

      return res.status(200).json({
        status: 'success',
        message: `Best link station for point ${devicePoint.x},${devicePoint.y} is ${result.bestLinkStation.x},${result.bestLinkStation.y} with power ${power}`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export = new LinkStation();
