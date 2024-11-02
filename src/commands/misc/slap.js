const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { createSuccessEmbed, createInfoEmbed } = require("../../utils/createReplyEmbed");
const getVowel = require("../../utils/getVowel");
const { getUserAttempts, setUserAttempts } = require("../../../database/userStats/setUserStats");
const cooldowns = new Set();

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
    const userId = interaction.member.id;
    const target = interaction.options.getMentionable('target');
    const object = interaction.options.getString('object');
    let embed, response;
    try {
      const botResponses = [
        "Why in the world would I allow you to slap myself?",
        "No, I still won't do it!",
        "I said no!",
        "No!",
        "No stays no!",
        "I haven't changed my mind. It's still no!",
        "Still not giving up?",
        "You're a though one!",
        "Nice try but no thanks!",
        "Why are you still trying?",
        "For the last time: NOOO!",
        "I won't even try stopping you anymore but I still refuse to slap myself!"
      ];
  
      const selfResponses = [
        "Why would you even want to slap yourself?",
        "Please, don't slap yourself!",
        "Why are you still trying?",
        "Well I guess I will allow you to slap yourself then...",
        `You slapped youself with ${getVowel(object)}! \nHappy now?`
      ];
  
      let userSlapAttempts = await getUserAttempts(guildId, userId);

      if (target.id !== client.user.id && target.id !== userId) {
        const replies = [
          `You slapped ${target} with ${getVowel(object)}!`, 
          `You used ${getVowel(object)} to slap ${target}!`
        ];
        embed = createSuccessEmbed({int: interaction, title: 'A Slap-tastic Hit!', descr: replies[Math.floor(Math.random() * replies.length)]});
      } else {
        let slapKey = target.id === client.user.id ? 'client' : 'self';
        userSlapAttempts.slap[slapKey] += 1
        let arrayToUse = slapKey === 'client' ? botResponses : selfResponses;
        response = arrayToUse[Math.min(userSlapAttempts.slap[slapKey] - 1, arrayToUse.length - 1)];
        embed = createInfoEmbed({ int: interaction, descr: response });
      }
      let type;
      if (target.user.bot) {
        type = 'bots';
      } else if (target.permissions.has(PermissionFlagsBits.Administrator)) {
        type = 'admins';
      } else {
        type = 'members';
      }
      userSlapAttempts.slap[type][target.id] = (userSlapAttempts.slap[type][target.id] || 0) + 1;
      await setUserAttempts(guildId, userId, JSON.stringify(userSlapAttempts));  
      await interaction.reply({embeds: [embed]});
      const cooldownKey = `${guildId}_${userId}`;
      if (!cooldowns.has(cooldownKey)) {
        cooldowns.add(cooldownKey);
        setTimeout(async () => {
          cooldowns.delete(cooldownKey);
          // Reset slap attempts if applicable
          if (target.id === client.user.id || target.id === userId) {
            userSlapAttempts.slap[target.id === client.user.id ? 'client' : 'self'] = 0;
            await setUserAttempts(guildId, userId, JSON.stringify(userSlapAttempts));
          }
        }, 30000);
      }
    } catch (error) {
      console.error('Error processing slap command:', error);
    }
  }
};