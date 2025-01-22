const { ApplicationCommandOptionType, PermissionFlagsBits, MembershipScreeningFieldType } = require("discord.js");
const { createSuccessEmbed, createInfoEmbed } = require("../../utils/embeds/createReplyEmbed");
const getVowel = require("../../utils/getVowel");
const { getUserAttempts, resetUserAttempts, updateUserAttempts } = require("../../../database/userStats/setUserStats");
const getUserClass = require("../../utils/getUserClass");
const cooldowns = new Set();
const commandReplies = require('../../../data/commandReplies.json');
const firstLetterToUpperCase = require("../../utils/firstLetterToUpperCase");
const getCmdReplyKey = require("../../utils/getCmdReplyKey");
const getCommandReply = require("../../utils/getCommandReply");

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
    const guildId = interaction.guild.id;
    const user = interaction.member;
    const userId = interaction.member.id;
    const target = interaction.options.getMentionable('target');
    const object = interaction.options.getString('object');
    let embed;
    try {
      const [userClass, targetClass] = getUserClass([{ member: user }, { member: target }]);
      
      let replies = commandReplies['slap']?.[targetClass]?.[userClass];
      const slapKey = getCmdReplyKey(targetClass, user.id, target.id);

      await updateUserAttempts(guildId, userId, target.id, 'slap', slapKey, replies?.length > 1);

      if (!replies) {
        replies = [
          `You slapped ${target} with ${getVowel(object)}!`, 
          `You used ${getVowel(object)} to slap ${target}!`
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
      
      await interaction.reply({embeds: [embed]});

    } catch (error) {
      console.error('Error processing slap command:', error);
    }
  }
};