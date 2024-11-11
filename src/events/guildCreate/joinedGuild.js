const { Client, Guild, EmbedBuilder } = require('discord.js');
const setActivity = require('../../utils/setActivity');
const { setLevelSettings } = require('../../../database/levelSystem/setLevelSettings');
const { resetDeletionDate } = require('../../handlers/dataBaseCleanUp');

module.exports = async (client, guild) => {
  try {
    console.log(`✅ Joined a new guild: ${guild.name} (${guild.id}).`);
    setLevelSettings({ id: guild.id });
    await resetDeletionDate(guild.id);
    console.log(`Data for guild ${guild.id} is no longer marked for deletion.`);
    await setActivity(client);

    const botMember = await guild.members.fetchMe();

    let targetChannel = guild.systemChannel;

    if (!targetChannel || !targetChannel.permissionsFor(botMember).has('SendMessages')) {
      targetChannel = guild.channels.cache.find(channel => 
        channel.type === 'GUILD_TEXT' &&
        channel.name.toLowerCase().includes('general') &&
        channel.permissionsFor(botMember).has('SendMessages')
      );
    }

    if (!targetChannel) {
      targetChannel = guild.channels.cache.find(channel =>
        channel.type === 'GUILD_TEXT' && 
        channel.permissionsFor(botMember).has('SendMessages')
      );
    }

    if (targetChannel) {
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Thank you for adding me!')
        .setDescription(`Hey Member${(guild.memberCount - 1) > 1 ? 's' : ''} of ${guild.name}\n` +
                        `Thanks a lot for adding me to this server.\n`+
                        `Currently I'm still in development but most of my commands are fully operational.\n`+
                        `If you encounter any issues, you might want to contact my masters (developers) through Discord. (See the link in my bio)\n`+
                        `Keep an eye on the documentation for more information about what I can and I can't do (yet): https://arckytech.gitbook.io/doggo-bot/doggo-bot-by-arckytech/documentation`+
                        `Thanks again for adding me!`)
        .setFooter({
          text: 'The Doggo Bot Dev Team'
        })
        .setTimestamp();
      targetChannel.send({ embeds: [embed] });
      
    } else {
      console.log(`❌ Could not find a channel to send a welcome message in ${guild.name} with ID: ${guild.id}`);
    }
  } catch (error) {
    console.error(`❌ Failed to join the guild: ${guild.name} (${guild.id}).`, error);
  }
};