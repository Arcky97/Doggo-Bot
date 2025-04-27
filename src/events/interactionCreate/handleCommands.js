const { devs, testServer } = require('../../../config.json');
const { getPremiumById } = require('../../managers/premiumManager');
const getLocalCommands = require('../../handlers/commands/getLocalCommands');
const { createInfoEmbed, createWarningEmbed, createErrorEmbed } = require('../../services/embeds/createReplyEmbed');

module.exports = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();
  const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);
  if (!commandObject) return;

  const cmdName = commandObject.name;
  let embed;

  try {
    // Dev-only check
    if (commandObject.devOnly && !devs.includes(interaction.member?.id)) {
      embed = createInfoEmbed({
        int: interaction,
        descr: 'Only **Developers** are allowed to run this command.'
      });

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      }

      return;
    }

    // Premium-only check
    if (commandObject.premiumOnly) {
      const isPremium = await getPremiumById(interaction.user.id);
      if (!isPremium) {
        embed = createInfoEmbed({
          int: interaction,
          title: 'Premium Command Only',
          descr: `Sorry ${interaction.user} but this command is a Premium Only Command.`
        });

        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await interaction.followUp({ embeds: [embed], ephemeral: true });
        }

        return;
      }
    }

    // Test server-only check
    if (commandObject.testOnly && interaction.guild.id !== testServer) {
      embed = createInfoEmbed({
        int: interaction,
        descr: 'This command cannot be ran here.'
      });

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      }

      return;
    }

    // User permissions check
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          embed = createWarningEmbed({
            int: interaction,
            descr: 'You don\'t have enough permissions.'
          });

          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
          } else {
            await interaction.followUp({ embeds: [embed], ephemeral: true });
          }

          return;
        }
      }
    }

    // Bot permissions check
    if (commandObject.botPermissions?.length) {
      const bot = interaction.guild.members.me;

      for (const permission of commandObject.botPermissions) {
        if (!bot.permissions.has(permission)) {
          embed = createWarningEmbed({
            int: interaction,
            descr: 'I don\'t have enough permissions.'
          });

          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
          } else {
            await interaction.followUp({ embeds: [embed], ephemeral: true });
          }

          return;
        }
      }
    }

    await commandObject.callback(interaction);

  } catch (error) {
    console.error(`There was an error running the '${cmdName}' command:`, error);

    // Handle known interaction expiry error
    if (error.code === 10062) {
      console.warn('Interaction expired or already acknowledged (10062).');
      return;
    }

    embed = createErrorEmbed({
      int: interaction,
      descr: `Something went wrong while running this Command. Please try again later.`
    });

    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      }
    } catch (innerErr) {
      console.error('Failed to send error reply:', innerErr);
    }
  }
};
