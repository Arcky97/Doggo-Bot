const { EmbedBuilder } = require("discord.js");
const setActivity = require("../../utils/setActivity");
const moment = require("moment");
const getLogChannel = require("../../utils/getLogChannel");
const getMemberRoles = require("../../utils/getMemberRoles");
const formatTime = require("../../utils/formatTime");

module.exports = async (client, member) => {
  try {
    
    if(member.user.id === client.user.id) return;
    
    const channel = await getLogChannel(client, member.guild.id, 'joinleave');
    if(!channel) return;

    const joinedAt = moment(member.joinedAt).format("MMMM Do YYYY, h:mm:ss a");
    const leftAt = moment().format("MMMM Do YYYY, h:mm:ss a");
    const timeSpent = await formatTime(member.joinedAt);
    //const timeSpent = moment.duration(moment().diff(member.joinedAt)).humanize();
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

    await channel.send({ embeds: [embed] });  
    await setActivity(client)
    console.log(`${member.user.username} left ${member.guild.name}!`);
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}