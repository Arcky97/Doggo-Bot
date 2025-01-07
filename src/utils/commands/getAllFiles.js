const fs = require('fs');
const path = require('path');

module.exports = (directory, foldersOnly = false, parentFolder = null) => {
  let fileNames = [];
  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        fileNames.push(filePath);
      } else {
        fileNames.push(
          ...module.exports(filePath, foldersOnly, file.name)
        );
      }
    } else if (file.isFile()) {
      if (!parentFolder || file.name === `${parentFolder}.js`) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
};