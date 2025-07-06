import { PermissionsBitField } from "discord.js";
import { findJsonFile } from '../../managers/jsonDataManager.js';

const categorizedPermissions = findJsonFile('loggingPermissions.json', 'data');

export default (oldOverwrite, newOverwrite) => {
  const changes = {};

  for (const [category, permissions] of Object.entries(categorizedPermissions)) {
    changes[category] = [];
    permissions.forEach(permissionObj => {
      const [flag, description] = Object.entries(permissionObj)[0];
      const permission = PermissionsBitField.Flags[flag];

      if (permission) {
        const wasAllowed = oldOverwrite?.allow.has(permission);
        const wasDenied = oldOverwrite?.deny.has(permission);
        const isNowAllowed = newOverwrite?.allow.has(permission);
        const isNowDenied = newOverwrite?.deny.has(permission);
    
        if (!oldOverwrite && isNowAllowed) {
          changes[category].push(`- **${description}:** ✅`);
        } else if (!oldOverwrite && isNowDenied) {
          changes[category].push(`- **${description}:** ❌`);
        } else if (wasAllowed && !isNowAllowed && !isNowDenied) {
          changes[category].push(`- **${description}:** ✅  =>  ⬜`);
        } else if (wasDenied && !isNowAllowed && !isNowDenied) {
          changes[category].push(`- **${description}:** ❌  =>  ⬜`);
        } else if (!wasAllowed && isNowAllowed) {
          changes[category].push(`- **${description}:** ⬜  =>  ✅`);
        } else if (!wasDenied && isNowDenied) {
          changes[category].push(`- **${description}:** ⬜  =>  ❌`);
        } else if (wasAllowed && isNowDenied) {
          changes[category].push(`- **${description}:** ✅  =>  ❌`);
        } else if (wasDenied && isNowAllowed) {
          changes[category].push(`- **${description}:** ❌  =>  ✅`);
        }
      }
    });
  }
  return changes;
}