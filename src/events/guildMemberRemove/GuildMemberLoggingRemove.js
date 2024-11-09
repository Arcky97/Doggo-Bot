const { EmbedBuilder } = require("discord.js");
const setActivity = require("../../utils/setActivity");
const moment = require("moment");
const getLogChannel = require("../../utils/getLogChannel");
const getMemberRoles = require("../../utils/getMemberRoles");
const formatTime = require("../../utils/formatTime");
const { getLevelSettings } = require("../../../database/levelSystem/setLevelSettings");
const { resetLevelSystem } = require("../../../database/levelSystem/setLevelSystem");
const { getEventEmbed } = require("../../../database/embeds/setEmbedData");
const { createEventEmbed } = require("../../utils/createEventOrGeneratedEmbed");
const setEventTimeOut = require("../../handlers/setEventTimeOut");

module.exports = async (client, member) => {
  try {
    
    if(member.user.id === client.user.id) return;
    
    const embedData = await getEventEmbed(member.guild.id, 'leave');
    if (embedData) {
      const channel = client.channels.cache.get(embedData.channelId);
      const leave = await createEventEmbed(member, embedData);
      await channel.send({ embeds: [leave] });
    }

    const logChannel = await getLogChannel(client, member.guild.id, 'joinleave');
    if(!logChannel) return;

    const levelSettings = getLevelSettings(member.guild.id);
    if (levelSettings.clearOnLeave === 1) await resetLevelSystem(member.guild.id, member);
    
    const joinedAt = moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a');
    const leftAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    const timeSpent = await formatTime(member.joinedAt);
    const roles = getMemberRoles(member);
    let roleMentions;
    if (roles.length !== 0) {
      roleMentions = roles.map(roleId => `<@&${roleId}>`);
    } else {
      roleMentions = 'No roles';
    }
    
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setAuthor({
        name: member.user.globalName,
        iconURL: member.user.avatarURL()
      })
      .setTitle(`Member Left`)
      .setFields(
        {
          name: 'User name',
          value: `<@${member.user.id}>`
        },
        {
          name: 'Joined At',
          value: `${joinedAt}`
        },
        {
          name: 'Left At',
          value: `${leftAt}`
        },
        {
          name: 'Time Spent',
          value: `${timeSpent}`
        },
        {
          name: 'roles',
          value: `${roleMentions}`
        }
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${member.id}`
      });

    await setEventTimeOut('joinleave', member.id, embed, logChannel);

    console.log(`${member.user.username} left ${member.guild.name}!`);
    await setActivity(client);
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}