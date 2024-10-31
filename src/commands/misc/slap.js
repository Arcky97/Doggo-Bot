const { ApplicationCommandOptionType } = require("discord.js");
const { createSuccessEmbed, createInfoEmbed } = require("../../utils/createReplyEmbed");
const getVowel = require("../../utils/getVowel");
const slapAttempts = {};

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
    const userId = interaction.member.id;
    const target = interaction.options.getMentionable('target');
    const object = interaction.options.getString('object');
    let embed, response;
    const botResponses = [
      "Why in the world would I allow you to slap myself?",
      "No, I still won't do it!",
      "I said no!",
      "No!",
      "No stays no!",
      "I haven't changed my mind. It's still no!",
      "Still not giving up?",
      "You're a thougho one!",
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

    if (target.id !== client.user.id || target.id !== interaction.user.id) {
      const replies = [
        `You slapped <@${target}> with ${getVowel(object)}!`, 
        `You used ${getVowel(object)} to slap <@${target}>!`
      ];
      embed = createSuccessEmbed(interaction, 'A Slap-tastic Hit!', replies[Math.floor(Math.random() * replies.length)]);
    } else {
      slapAttempts[userId] = (slapAttempts[userId] || 0) + 1;
      let arrayToUse = target.id === client.user.id ? botResponses : selfResponses;
      response = arrayToUse[Math.min(slapAttempts[userId] - 1, arrayToUse.length - 1)];
      embed = createInfoEmbed(interaction, response);
    }    
    await interaction.reply({embeds: [embed]});
  }
};