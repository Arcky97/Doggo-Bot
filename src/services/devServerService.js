import { EmbedBuilder } from "discord.js";

export default async (channelId, message) => {
  const channel = client.channels.cache.get(channelId);

  if (channel) {
    try {
      const embed = new EmbedBuilder()
        .setTitle('Bot Updated')
        .setDescription(message)
        .setColor('Green')
        .setTimestamp()
      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(`Channel with ID '${channelId}' not found!`);
      console.log('-----------------------------------');
    }
  }
}