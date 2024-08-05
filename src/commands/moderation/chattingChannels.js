const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { setChannel } = require('../../../database/setData.js');
const { getChannel } = require('../../../database/selectData.js');
const { deleteChannel } = require('../../../database/deleteData.js');

module.exports = {
  name: 'setup-chat',
  description: 'Setup the channel for chatting with the Bot.',
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: 'channel',
      description: 'The channel for chatting with the Bot.',
      required: true,
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const subcommand = 'botchat';
    const channel = interaction.options.get('channel').value;
    const guildID = interaction.guild.id;
    console.log(getChannel(guildID, subcommand))
    try {
      if (await getChannel(guildID, subcommand) === channel) {
        await deleteChannel(guildID, subcommand, channel);
        await interaction.reply(`The channel for ${subcommand} has been resetted!`);
      } else {
        if (await setChannel(guildID, subcommand, channel) === "inserted") {
          await interaction.reply(`The channel for ${subcommand} has been set to <#${channel}> successfully!`);
        } else {
          await interaction.reply(`The channel for ${subcommand} has been updated to <#${channel}> succesfully!`)
        }
      }
    } catch (error) {
      console.error('Error setting channel:', error);
      await interaction.reply('There was an error setting the channel. Please try again later.');
    }
  }
};