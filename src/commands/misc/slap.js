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
      let userAttempts = await getUserAttempts(guildId, userId);
      let slapKey;
      if (targetClass === 'default') {
        slapKey = 'members'; 
      } else if (userId === target.id) {
        slapKey = 'self';
      } else {
        slapKey = targetClass;
      }

      let attempts; 

      if (!replies) {
        replies = [
          `You slapped ${target} with ${getVowel(object)}!`, 
          `You used ${getVowel(object)} to slap ${target}!`
        ];
        if (!userAttempts.slap[slapKey][target.id]) {
          userAttempts.slap[slapKey][target.id] = { total: 1 };
        } else {
          userAttempts.slap[slapKey][target.id].total += 1;
        }
        embed = createSuccessEmbed({
          int: interaction, 
          title: 'A Slap-tastic Hit!', 
          descr: replies[Math.floor(Math.random() * replies.length)], 
          footer: false
        });
      } else {

        if (!userAttempts.slap[slapKey][target.id]) {
          userAttempts.slap[slapKey][target.id] = { temp: 1, total: 0 };
          attempts = userAttempts.slap[slapKey][target.id];
        } else {
          attempts = userAttempts.slap[slapKey][target.id];
          attempts.temp += 1;
        }
        response = replies[Math.min(attempts.temp - 1, replies.length - 1)];
        embed = createInfoEmbed({ 
          int: interaction, 
          descr: response.replace('{object}', getVowel(object))
        });
      }

      await setUserAttempts(guildId, userId, JSON.stringify(userAttempts));  
      
      await interaction.reply({embeds: [embed]});

      const cooldownKey = `SCD${guildId + userId + slapKey}`;

      if (!cooldowns.has(cooldownKey)) {
        cooldowns.add(cooldownKey);
        setTimeout(async () => {
          cooldowns.delete(cooldownKey);
          // Reset slap attempts if applicable
          if (["dev", "client", "owner", "self", "admin"].includes(slapKey)) {
            userAttempts = await getUserAttempts(guildId, userId);
            userAttempts.slap[slapKey][target.id].total += userAttempts.slap[slapKey][target.id].temp;
            userAttempts.slap[slapKey][target.id].temp = 0;

            await setUserAttempts(guildId, userId, JSON.stringify(userAttempts));
          }
        }, 30000);
      }
    } catch (error) {
      console.error('Error processing slap command:', error);
    }
  }
};