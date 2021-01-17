import fs from 'fs';
import path from 'path';
import ErrorHandler from '../errors/ErrorHandler';

const filePath = path.join(__dirname, '/../');

/**
 * Read data from JSON file
 * @param filename Name of the JSON file with filepath
 * @return data Returns the content of the JSON file or throws an error
 */
export const readJsonFileSync = (filename: string, encoding?: 'utf8') => {
  try {
    const jsonString = fs.readFileSync(filePath + filename, encoding);
    return JSON.parse(jsonString.toString());
  } catch (err) {
    console.log(err);
    throw new ErrorHandler(Number(err.code) || 400, err.message);
  }
};
