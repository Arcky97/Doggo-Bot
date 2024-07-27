const { ApplicationCommandOptionType } = require("discord.js");

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
    const vowel = ['a', 'e', 'i', 'o', 'u'];
    const target = interaction.options.get('target').value;
    const object = interaction.options.get('object').value;
    const firstLetter = object.charAt(0).toLowerCase();
    const article = (vowel.includes(firstLetter) ? 'an' : 'a');
    const replies = [
      `You slapped <@${target}> with ${article} ${object}!`, 
      `You used ${article} ${object} to slap <@${target}>!`
    ];
    await interaction.reply(replies[Math.floor(Math.random() * replies.length)]);
  }
};