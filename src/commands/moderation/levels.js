const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const { insertData } = require("../../../database/controlData/insertData");
const { exportToJson } = require("../../../database/controlData/visualDatabase/exportToJson");

module.exports = {
  name: 'levels',
  description: 'Contains various commands used for the Level System.',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'xp-multiplier',
      description: 'Set the global XP multiplier for the Level System',
      options: [
        {
          type: ApplicationCommandOptionType.Number,
          name: 'multiplier',
          description: 'The Global XP Multiplier.',
          required: true 
        }
      ]
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();
    const multi = interaction.options.get('multiplier').value;
    const guildId = interaction.guild.id;
    try {
      await insertData('LevelSettings', { guildId: guildId, levelMultiplier: multi })
      interaction.reply(`The Global Multiplier was set to ${multi}!`)
      exportToJson('LevelSettings')
    } catch (error) {
      console.error('Error setting Global Multiplier:', error);
      interaction.reply('There was an error setting the Global Multiplier!');
    }
  }
}