const { EmbedBuilder } = require("discord.js");
const setActivity = require("../../utils/setActivity");
const getLogChannel = require("../../utils/logging/getLogChannel");
const formatTime = require("../../utils/formatTime");
const getOrdinalSuffix = require("../../utils/getOrdinalSuffix");
const { getEventEmbed } = require("../../../database/embeds/setEmbedData");
const { createEventEmbed } = require("../../utils/embeds/createEventOrGeneratedEmbed");
const setEventTimeOut = require("../../handlers/setEventTimeOut");
const checkLogTypeConfig = require("../../utils/logging/checkLogTypeConfig");
const { getGuildSettings } = require("../../../database/guildSettings/setGuildSettings");

module.exports = async (client, member) => {
  const guildId = member.guild.id;
  try {

    if (member.user.id === client.user.id) return;

    const embedData = await getEventEmbed(guildId, 'welcome');
    if (embedData) {
      const channel = client.channels.cache.get(embedData.channelId);
      const welcome = await createEventEmbed(member, embedData);
      await channel.send({ embeds: [welcome] });
    }

    const logChannel = await getLogChannel(client, guildId, 'joinleave');
    if(!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'joinLeave', option: 'joins'});
    if (!configLogging) return;

    const guildSettings = getGuildSettings(guildId);
    if (guildSettings.joinRole) member.roles.add(guildSettings.joinRole);
    
    const userAge = await formatTime(member.user.createdAt);
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setAuthor({
        name: member.user.globalName,
        iconURL: member.user.avatarURL()
      })
      .setTitle(`Member Joined`)
      .setFields(
        {
          name: 'User name',
          value: `<@${member.id}>`
        },
        {
          name: 'Member count',
          value: `${getOrdinalSuffix(member.guild.memberCount)}`
        },
        {
          name: 'Created',
          value: `${userAge} ago`
        }
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${member.id}`
      });

    await setEventTimeOut('joinleave', member.id, embed, logChannel);
 
    await setActivity(client);
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}