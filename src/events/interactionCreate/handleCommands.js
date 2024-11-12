const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/commands/getLocalCommands');
const { createInfoEmbed, createWarningEmbed } = require('../../utils/createReplyEmbed');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    let embed;
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        embed = createInfoEmbed({int: interaction, descr: 'Only **Developers** are allowed to run this command.'});
        interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (interaction.guild.id !== testServer) {
        embed = createInfoEmbed({int: interaction, descr: 'This command cannot be ran here.'});
        interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          embed = createWarningEmbed({int: interaction, descr: 'You don\'t have enough permissions'});
          interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          embed = createWarningEmbed({int: interaction, descr: 'I don\'t have enough permissions.'});
          interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}.`);
  }
};
