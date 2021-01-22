# Link Station Backend Application

![GitHub repo size](https://img.shields.io/badge/repo%20size-219kB-blue)
![GitHub contributors](https://img.shields.io/badge/contributors-1-yellow)

This project serves the backend for the Link Station Frontend App which finds the most suitable (with most power) link station for a given device. Currently it has only one api end point /findLinkStationForDevice which finds the link station and is capable of handling errors as well. This project is capable of further extension by adding more end points and maintenance in the long run.

## Getting Started with Link Station Backend App

In the project directory, to install the packages and dependencies you can run:

#### `npm install`

In the project directory, to run the application you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

## Usage

This is a POST request which accepts a device point (x, y) and link station points (x, y) with their reaches (r) as (x, y, r).
For example:
```
const request = {
  devicePoint: {
    x: 15,
    y: 10
  },
  linkStationPoints: [
    {
      x: 0,
      y: 0,
      z: 10
    },
    {
      x: 20,
      y: 20,
      z: 5
    },
    {
      x: 10,
      y: 0,
      z: 12
    }
  ]
};
```
The api can be accessed as following
```
http://localhost:8000/api/v1/linkstation/findLinkStationForDevice
```

## Running the tests
#### `npm test`

Launches the test runner in the interactive watch mode which shall execute the unit tests written for the LinkStation controller.

## Technologies Used
*   NPM
*   JavaScript
*   ExpressJS
*   NodeJS
*   Typescript
*   Jest
*   Supertest
*   ESLint
*   Prettier
*   Git
*   Visual Studio Code
