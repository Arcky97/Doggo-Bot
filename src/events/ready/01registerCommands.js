import areCommandsDifferent from '../../handlers/commands/areCommandsDifferent.js';
import getApplicationCommands from '../../handlers/commands/getApplicationCommands.js';
import getLocalCommands from '../../handlers/commands/getLocalCommands.js';
import validateCommandProperties from '../../handlers/commands/validateCommandProperties.js';

export default async (guild) => {
  try {
    const localCommands = await getLocalCommands();
    const applicationCommands = await getApplicationCommands(guild.id);
    console.log(
      `Checking ${localCommands.length} Commands`
    );

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      if (!validateCommandProperties(localCommand)) {
        console.log(
          `👎Skipping editing command "${name}" as it has invalid option properties.`
        );
        continue;
      }

      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );
      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);

          console.log(`🗑 Deleted command "${name}".`);
          continue;
        }
        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
  
          console.log(`🔁 Edited command "${name}".`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `⏩ Skipping registering command "${name}" as it's set to delete.`
          );
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`👍 Registered command "${name}."`);
      }
    }
    console.log('-----------------------------------');
  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
};