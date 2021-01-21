import request from 'supertest';

const server = require('../app');

const apiAddress = '/api/v1/linkstation/findLinkStationForDevice';

describe('Test /findSuitableLinkStation For Any/Empty "request-data" Should Throw an Error with Message', () => {
  /**
   * Test the api with empty / without any request-data
   */
  it('Request with empty/without request-data', async () => {
    const result = await request(server).post(apiAddress).send();

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Please provide device point & link station points.');
  });

  /**
   * Test the api by passing only a string as request-data
   */
  it('Request with a string request-data', async () => {
    const result = await request(server).post(apiAddress).send('hello');

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Please provide a device point (x, y).');
  });

  /**
   * Test the api by passing only an array as request-data
   */
  it('Request with an array of any data in request-data', async () => {
    const result = await request(server).post(apiAddress).send(['hello']);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Please provide a device point (x, y).');
  });

  /**
   * Test the api with any random request-data object
   */
  it('Request with any random request-data object', async () => {
    const requestData = {
      x: 0,
      y: 0,
      r: 1
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Please provide a device point (x, y).');
  });
});

describe('Test /findSuitableLinkStation For request-data "devicePoint" Should Throw an Error with Message', () => {
  /**
   * Test the api with request-data devicePoint as empty array []
   */
  it('Request with request-data devicePoint as empty array []', async () => {
    const requestData = {
      devicePoint: []
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Invalid device point: []');
  });

  /**
   * Test the api with request-data devicePoint as empty string ''
   */
  it('Request with request-data devicePoint as empty string ""', async () => {
    const requestData = {
      devicePoint: ''
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Invalid device point: ""');
  });

  /**
   * Test the api with request-data devicePoint as any random number
   */
  it('Request with request-data devicePoint as any random number', async () => {
    const requestData = {
      devicePoint: 12
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Invalid device point: 12');
  });

  /**
   * Test the api with request-data devicePoint with only x point
   */
  it('Request with request-data devicePoint with only x point', async () => {
    const requestData = {
      devicePoint: {
        x: 5
      }
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toMatch(/Invalid device point/);
  });

  /**
   * Test the api with request-data devicePoint with only y point
   */
  it('Request with request-data devicePoint with only y point', async () => {
    const requestData = {
      devicePoint: {
        y: 8
      }
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toMatch(/Invalid device point/);
  });

  /**
   * Test the api with request-data devicePoint with x, y points as strings
   */
  it('Request with request-data devicePoint with x, y points as strings/NaN', async () => {
    const requestData = {
      devicePoint: {
        x: '35',
        y: NaN
      }
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toMatch(/Invalid device point/);
  });
});

describe('Test /findSuitableLinkStation For request-data "linkStationPoints" Should Throw an Error with Message', () => {
  /**
   * Test the api with request-data linkStationPoints as empty array []
   */
  it('Request with request-data linkStationPoints as empty array []', async () => {
    const requestData = {
      devicePoint: {
        x: 10,
        y: 15
      }
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Please provide link station points (x, y, r)');
  });

  /**
   * Test the api with request-data linkStationPoints as empty string ''
   */
  it('Request with request-data linkStationPoints as empty string ""', async () => {
    const requestData = {
      devicePoint: {
        x: 10,
        y: 15
      },
      linkStationPoints: ''
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Please provide link station points (x, y, r)');
  });

  /**
   * Test the api with request-data linkStationPoints as any random number
   */
  it('Request with request-data linkStationPoints as any random number', async () => {
    const requestData = {
      devicePoint: {
        x: 10,
        y: 15
      },
      linkStationPoints: 33
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('Please provide link station points (x, y, r)');
  });

  /**
   * Test the api with request-data linkStationPoints with only x point
   */
  it('Request with request-data linkStationPoints with only x point', async () => {
    const requestData = {
      devicePoint: {
        x: 10,
        y: 15
      },
      linkStationPoints: ['x']
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toMatch(/Invalid link station point/);
  });

  /**
   * Test the api with request-data linkStationPoints with only y point
   */
  it('Request with request-data linkStationPoints with only y point', async () => {
    const requestData = {
      devicePoint: {
        x: 10,
        y: 15
      },
      linkStationPoints: [
        {
          y: 1
        }
      ]
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toMatch(/Invalid link station point/);
  });

  /**
   * Test the api with request-data linkStationPoints with only x, y point
   */
  it('Request with request-data linkStationPoints with only x, y point', async () => {
    const requestData = {
      devicePoint: {
        x: 10,
        y: 15
      },
      linkStationPoints: [
        {
          x: 0,
          y: 1
        }
      ]
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toMatch(/Invalid link station point/);
  });

  /**
   * Test the api with request-data linkStationPoints with x, y, r points as strings
   */
  it('Request with request-data linkStationPoints with x, y, r points as strings/NaN', async () => {
    const requestData = {
      devicePoint: {
        x: 100,
        y: 100
      },
      linkStationPoints: [
        {
          x: '35',
          y: 'hello world',
          r: NaN
        }
      ]
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toMatch(/Invalid link station point/);
  });

  /**
   * Test the api with request-data linkStationPoints with x, y, r points passed directly
   */
  it('Request with request-data linkStationPoints with x, y, r points passed directly', async () => {
    const requestData = {
      devicePoint: {
        x: 100,
        y: 100
      },
      linkStationPoints: {
        x: 5,
        y: 10,
        r: 15
      }
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(404);
    expect(result.body.message).toMatch(/Invalid link station point/);
  });
});

describe('Test /findSuitableLinkStation For With Proper request-data Should Execute Successfully', () => {
  /**
   * Test the api with proper request-data
   */
  it('Request with proper request-data: "Best link station" response', async () => {
    const requestData = {
      devicePoint: {
        x: 15,
        y: 10
      },
      linkStationPoints: [
        {
          x: 0,
          y: 0,
          r: 10
        },
        {
          x: 20,
          y: 20,
          r: 5
        },
        {
          x: 10,
          y: 0,
          r: 12
        }
      ]
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(200);
    expect(result.body.message).toEqual('Best link station for point 15,10 is 10,0 with power 0.67');
  });

  /**
   * Test the api with proper request-data
   */
  it('Request with proper request-data: "No link station within reach" response', async () => {
    const requestData = {
      devicePoint: {
        x: 10,
        y: 15
      },
      linkStationPoints: [
        {
          x: 0,
          y: 0,
          r: 10
        },
        {
          x: 20,
          y: 20,
          r: 5
        },
        {
          x: 10,
          y: 0,
          r: 12
        }
      ]
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(200);
    expect(result.body.message).toEqual('No link station within reach for point 10,15');
  });

  /**
   * Test the api with proper request-data but negative values for devicePoint
   */
  it('Request with negative values for devicePoint: "No link station within reach" response', async () => {
    const requestData = {
      devicePoint: {
        x: -5,
        y: -10
      },
      linkStationPoints: [
        {
          x: 0,
          y: 0,
          r: 10
        },
        {
          x: 20,
          y: 20,
          r: 5
        },
        {
          x: 10,
          y: 0,
          r: 12
        }
      ]
    };
    const result = await request(server).post(apiAddress).send(requestData);

    expect(result.status).toBe(200);
    expect(result.body.message).toEqual('No link station within reach for point -5,-10');
  });
});
