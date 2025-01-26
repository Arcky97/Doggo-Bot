const { devs, testServer } = require('../../../config.json');
const { getPremiumById } = require('../../../database/PremiumUsersAndGuilds/setPremiumUsersAndGuilds');
const getLocalCommands = require('../../utils/commands/getLocalCommands');
const { createInfoEmbed, createWarningEmbed, createErrorEmbed } = require('../../utils/embeds/createReplyEmbed');

module.exports = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  const commandObject = localCommands.find(
    (cmd) => cmd.name === interaction.commandName
  );

  const cmdName = commandObject.name;
  //const subCmdGroup = interaction.options?.getSubcommandGroup();
  //const subCmd = interaction.options?.getSubcommand();
  let embed;
  try {
    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        embed = createInfoEmbed({int: interaction, descr: 'Only **Developers** are allowed to run this command.'});
        interaction.reply({
          embeds: [embed],
          ephemeral: true
        });
        return;
      }
    }

    if (commandObject.premiumOnly) {
      let isPremium = await getPremiumById(interaction.user.id);
      if (!isPremium) {
        embed = createInfoEmbed({
          int: interaction,
          title: 'Premium Command Only',
          descr: `Sorry ${interaction.user} but this command is a Premium Only Command.`
        });
        interaction.reply({
          embeds: [embed],
          ephemeral: true
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

    await commandObject.callback(interaction);
  } catch (error) {
    console.log(`There was an error running the '${cmdName}' command: ${error}.`);
    embed = createErrorEmbed({
      int: interaction, 
      descr: `Something went wrong while running this Command. Please try again later.`
    });
    interaction.editReply({ embeds: [embed] });
  }
};
