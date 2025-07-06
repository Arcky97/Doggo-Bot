import { setBotStats } from "../../managers/botStatsManager.js";
import { createSuccessEmbed, createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";

export default {
  name: 'ping',
  description: 'Replies with the bot ping!',
  callback: async (interaction) => {
    let embed;

    await interaction.deferReply();
    
    try {
      const reply = await interaction.fetchReply();

      const ping = reply.createdTimestamp - interaction.createdTimestamp;

      embed = createSuccessEmbed({int: interaction, title: 'Pong!', descr: `Client ${ping /10}ms \nWebsocket: ${client.ws.ping /10}ms`, footer: false});
      
      await setBotStats(interaction.guild?.id, 'command', { category: 'misc', command: 'ping' });
    
    } catch (error) {
      console.error('Error with the Ping Command:', error);

      embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Ping Command. Please try again later.'
      });
    }
    interaction.editReply({embeds: [embed]});
  }
};