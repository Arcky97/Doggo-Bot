import fs from 'fs';
import path from 'path';

const getAllFiles = (directory, foldersOnly = false, parentFolder = null) => {
  let fileNames = [];
  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        fileNames.push(filePath);
      } else {
        fileNames.push(...getAllFiles(filePath, foldersOnly, file.name));
      }
    } else if (file.isFile()) {
      if (!parentFolder || file.name === `${parentFolder}.js`) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
};

export default getAllFiles;