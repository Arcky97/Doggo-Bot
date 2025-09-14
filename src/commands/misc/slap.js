import { ApplicationCommandOptionType } from "discord.js";
import { createSuccessEmbed, createInfoEmbed, createErrorEmbed, createNotDMEmbed } from "../../services/embeds/createReplyEmbed.js";
import getVowel from "../../utils/getVowel.js";
import { setUserCommandStats, updateUserAttempts } from "../../managers/userStatsManager.js";
import getUserClass from "../../utils/getUserClass.js";
import getCmdReplyKey from "../../utils/getCmdReplyKey.js";
import getCommandReply from "../../utils/getCommandReply.js";
import { setBotStats } from "../../managers/botStatsManager.js";
import { findJsonFile } from '../../managers/jsonDataManager.js';

const commandReplies = findJsonFile('commandReplies.json', 'data');

export default {
  name: 'slap',
  description: 'Slap a person with an object',
  options: [
    {
      type: ApplicationCommandOptionType.Mentionable,
      name: 'target',
      description: 'Choose your target.',
      required: true 
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'object',
      description: 'Choose the object.',
      required: true 
    }
  ],
  callback: async (interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({
      embeds: [createNotDMEmbed(interaction)]
    });

    let embed;
    const guildId = interaction.guild.id;
    const user = interaction.member;
    const userId = user.id;
    const cmd = { category: 'misc', command: 'slap' };
    const target = interaction.options.getMentionable('target');
    const object = interaction.options.getString('object');
    
    try {
      const [userClass, targetClass] = getUserClass([{ member: user }, { member: target }]);
      
      let replies = commandReplies['slap']?.[targetClass]?.[userClass];
      const slapKey = getCmdReplyKey(targetClass, user.id, target.id);

      await updateUserAttempts(guildId, userId, target.id, 'slap', slapKey, replies?.length > 1);

      if (!replies) {
        replies = [
          `${user} slapped ${target} with ${getVowel(object)}!`, 
          `${user} used ${getVowel(object)} to slap ${target}!`
        ];
        embed = createSuccessEmbed({
          int: interaction, 
          title: 'A Slap-tastic Hit!', 
          descr: replies[Math.floor(Math.random() * replies.length)], 
          footer: false
        });
      } else {
        const response = await getCommandReply(guildId, userId, target.id, 'slap', slapKey, replies, object);
        embed = createInfoEmbed({ 
          int: interaction, 
          title: response.title,
          descr: response.description
        });
      } 
      
      await setBotStats(guildId, 'command', cmd);
      await setUserCommandStats(guildId, userId, cmd);
    } catch (error) {
      console.error('Error with the Slap Command:', error);

      embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Slap Command. Please try again later.'
      });
    }
    interaction.editReply({embeds: [embed]});
  }
};