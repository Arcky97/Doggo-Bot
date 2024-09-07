const { EmbedBuilder } = require("discord.js");
const setActivity = require("../../utils/setActivity");
const { selectData } = require("../../../database/controlData/selectData");
const moment = require("moment");

module.exports = async (client, member) => {
  try {
    console.log(`${member.user.username} left ${member.guild.name}!`);
    const joinLeaveLogChannelId = await selectData('GuildSettings', { guildId: member.guild.id });
    
    if (!joinLeaveLogChannelId || !joinLeaveLogChannelId.joinLeaveLogging) return;
    
    const logChannel = client.channels.cache.get(joinLeaveLogChannelId.joinLeaveLogging);
    
    if (!logChannel) return;

    //const fetchedMember = await client.members.fetch(member.id);
    const joinedAt = moment(member.joinedAt).format("MMMM Do YYYY, h:mm:ss a");
    const leftAt = moment().format("MMMM Do YYYY, h:mm:ss a");
    const timeSpent = moment.duration(moment().diff(member.joinedAt)).humanize();
    //const roles = fetchedMember.roles.cache
    //  .filter(role => role.name !== '@everyone')
    //  .map(role => role.id)
    //  .join(', ') || 'No roles';
    const roles = 'No roles';

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setAuthor({
        name: member.user.globalName,
        iconURL: member.user.avatarURL()
      })
      .setTitle(`Member Left`)
      .addFields(
        {
          name: 'User name:',
          value: `<@${member.id}>`
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
          value: `${roles}`
        }
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${member.id}`
      });

    await logChannel.send({ embeds: [embed] });  
    await setActivity(client)
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}