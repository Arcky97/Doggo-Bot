const { EmbedBuilder } = require("@discordjs/builders");
const setActivity = require("../../utils/setActivity");

module.exports = async (client, member) => {
  try {
    const channel = client.channels.cache.get('934536340022890517');
    const embed = new EmbedBuilder()
      .setTitle(`Welcome to the ${member.guild.name} Server!`)
      .setDescription(`Hey <@${member.id}>, make sure to read and agree to the <#934547510825979914>!\n
        After you've done that you'll have access to more Channels to talk in.\n
        Check out <#926214632849432596> to get some fancy roles and <#941761135827353650> for a nice color for your name.\n
        We have now ${member.guild.memberCount} Members!`)
      .setTimestamp()
      .setFooter({
        text: 'The Admin Team'
      })
    await channel.send({ embeds: [embed] })
    console.log(`${member.user.username} joined ${member.guild.name}!`);
    await setActivity(client);
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}