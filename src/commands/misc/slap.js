const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { createSuccessEmbed, createInfoEmbed } = require("../../utils/embeds/createReplyEmbed");
const getVowel = require("../../utils/getVowel");
const { getUserAttempts, setUserAttempts } = require("../../../database/userStats/setUserStats");
const getUserClass = require("../../utils/getUserClass");
const cooldowns = new Set();
const commandReplies = require('../../../data/commandReplies.json');

module.exports = {
  name: 'slap',
  description: 'Slap a person with an object',
  options: [
    {
      name: 'target',
      description: 'Choose your target.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true 
    },
    {
      name: 'object',
      description: 'Choose the object.',
      type: ApplicationCommandOptionType.String,
      required: true 
    }
  ],
  callback: async (client, interaction) => {
    const guildId = interaction.guild.id;
    const user = interaction.member;
    const userId = interaction.member.id;
    const target = interaction.options.getMentionable('target');
    const object = interaction.options.getString('object');
    let embed, response;
    try {
      const [userClass, targetClass] = getUserClass(client, [user, target]);
      
      let replies = commandReplies['slap']?.[targetClass]?.[userClass];
      let userSlapAttempts = await getUserAttempts(guildId, userId);
      let slapKey;
      if (targetClass === 'bot') {
        slapKey = target.id === client.user.id ? 'client' : 'bots';
      } else if (targetClass === 'default') {
        slapKey = target.id === userId ? 'self' : 'members'; 
      } else {
        slapKey = targetClass;
      }

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
        userSlapAttempts.slap[slapKey][target.id] = (userSlapAttempts.slap[slapKey][target.id] || 0) + 1;
      } else {
        userSlapAttempts.slap[slapKey] += 1;
        response = replies[Math.min(userSlapAttempts.slap[slapKey] - 1, replies.length - 1)];
        embed = createInfoEmbed({ 
          int: interaction, 
          descr: response.replace('{object}', getVowel(object))
        });
      }

      await setUserAttempts(guildId, userId, JSON.stringify(userSlapAttempts));  
      
      await interaction.reply({embeds: [embed]});

      const cooldownKey = `SCD${guildId + userId + slapKey}`;

      if (!cooldowns.has(cooldownKey)) {
        cooldowns.add(cooldownKey);
        setTimeout(async () => {
          cooldowns.delete(cooldownKey);
          // Reset slap attempts if applicable
          if (["dev", "client", "owner", "self"].includes(slapKey)) {
            userSlapAttempts.slap[slapKey] = 0;
            await setUserAttempts(guildId, userId, JSON.stringify(userSlapAttempts));
          }
        }, 30000);
      }
    } catch (error) {
      console.error('Error processing slap command:', error);
    }
  }
};