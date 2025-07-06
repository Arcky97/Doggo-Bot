import fs from 'fs';
import path from 'path';

export function findJsonFile(file, dir = '') {
  const findPath = path.join(process.cwd(), dir, file);
  return JSON.parse(fs.readFileSync(findPath, 'utf-8'));
}