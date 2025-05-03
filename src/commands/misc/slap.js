const { ApplicationCommandOptionType } = require("discord.js");
const { createSuccessEmbed, createInfoEmbed, createErrorEmbed, createNotDMEmbed } = require("../../services/embeds/createReplyEmbed");
const getVowel = require("../../utils/getVowel");
const { updateUserAttempts } = require("../../managers/userStatsManager");
const getUserClass = require("../../utils/getUserClass");
const commandReplies = require('../../../data/commandReplies.json');
const getCmdReplyKey = require("../../utils/getCmdReplyKey");
const getCommandReply = require("../../utils/getCommandReply");
const { setBotStats } = require("../../managers/botStatsManager");

module.exports = {
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
    const userId = interaction.member.id;
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
      
      await setBotStats(interaction.guild.id, 'command', { category: 'misc', command: 'slap' });
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