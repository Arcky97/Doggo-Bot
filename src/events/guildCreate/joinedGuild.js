const { Client, Guild, EmbedBuilder } = require('discord.js');
const setActivity = require('../../utils/setActivity');
const { setLevelSettings } = require('../../../database/levelSystem/setLevelSettings');
const { resetDeletionDate } = require('../../handlers/dataBaseCleanUp');
const sendMessageToDevServer = require('../../utils/sendMessageToDevServer');

module.exports = async (client, guild) => {
  try {
    console.log(`✅ Joined a new guild: ${guild.name} (${guild.id}).`);
    setLevelSettings({ id: guild.id });
    const result = await resetDeletionDate(guild.id);
    if (result) {
      console.log(`Data for guild ${guild.id} is no longer marked for deletion.`);
    } else {
      console.log(`No Data marked for deletion found for guild ${guild.id}`);
    }
    await setActivity(client);

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Joined a New Server')
      .setDescription(`Hooray! ${client.name} has joined a new Server`)
      .setFields(
        {
          name: 'Name',
          value: guild.name 
        },
        {
          name: 'Owner',
          value: `<@${guild.owner.id}` 
        },
        {
          name: 'Server Age',
          value: guild.createdTimestamp
        },
        {
          name: 'Members',
          value: guild.memberCount
        }
      )
      .setFooter({ text: `Server ID: ${guild.id}`})
      .setTimestamp()
    
    const channelId = '1314702619196784743';
    await sendMessageToDevServer(client, channelId, { embeds: [embed] });
  } catch (error) {
    console.error(`❌ Failed to join the guild: ${guild.name} (${guild.id}).`, error);
  }
};