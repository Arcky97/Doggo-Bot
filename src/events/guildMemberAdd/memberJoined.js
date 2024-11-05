const { EmbedBuilder } = require("discord.js");
const setActivity = require("../../utils/setActivity");
const getLogChannel = require("../../utils/getLogChannel");
const formatTime = require("../../utils/formatTime");
const getOrdinalSuffix = require("../../utils/getOrdinalSuffix");
const { getEventEmbed } = require("../../../database/embeds/setEmbedData");
const { createEventEmbed } = require("../../utils/createEventOrGeneratedEmbed");

const embedQueue = new Map();

module.exports = async (client, member) => {
  try {

    if (member.user.id === client.user.id) return;

    const embedData = await getEventEmbed(member.guild.id, 'welcome');
    if (embedData) {
      const channel = client.channels.cache.get(embedData.channelId);
      const welcome = await createEventEmbed(member, embedData);
      await channel.send({ embeds: [welcome] });
    }

    const channel = await getLogChannel(client, member.guild.id, 'joinleave');
    if(!channel) return;

    /*if (member.guild.id === '925765418545741854') {
      const channelId = client.channels.cache.get('934536340022890517');
      const welcome = new EmbedBuilder()
        .setTitle(`Welcome to the ${member.guild.name} Server!`)
        .setDescription(`Hey <@${member.id}>, make sure to read and agree to the <#934547510825979914>!\n
          After you've done that you'll have access to more Channels to talk in.\n
          Check out <#926214632849432596> to get some fancy roles and <#941761135827353650> for a nice color for your name.\n
          We have now ${member.guild.memberCount} Members!`)
        .setTimestamp()
        .setFooter({
          text: 'The Admin Team'
        })
      await channelId.send({ embeds: [welcome] })
    }*/
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
          value: `${await getOrdinalSuffix(member.guild.memberCount)}`
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

    if (!embedQueue.has(member.id)) {
      embedQueue.set(member.id, { embeds: [embed], timeout: null });
    } else {
      const memberData = embedQueue.get(member.id);
      memberData.embeds.push(embed);
      clearTimeout(memberData.timeout);
    }

    embedQueue.get(member.id).timeout = setTimeout(async () => {
      const { embeds } = embedQueue.get(member.id);
      await channel.send({ embeds });
      embedQueue.delete(member.id);
    }, 5000);
 
    console.log(`${member.user.username} joined ${member.guild.name}!`);
    await setActivity(client);
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}