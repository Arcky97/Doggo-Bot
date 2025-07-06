import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import getAllFiles from "../handlers/commands/getAllFiles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default () => {
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);
    
    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
    
    client.on(eventName, async (...arg) => {
      for (const eventFile of eventFiles) {
        const eventModule = await import(pathToFileURL(eventFile).href);
        const eventFunction = eventModule.default;
        await eventFunction(...arg);
      }
    });
  }
};