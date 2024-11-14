const { ApplicationCommandOptionType } = require("discord.js");
const { createSuccessEmbed } = require("../../utils/embeds/createReplyEmbed");
const attempts = {}
module.exports = {
  name: 'games',
  description: 'Guess the very magic secret number.',
  options: [
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'guessing',
      description: 'Various Guessing games.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'number',
          description: 'Guess the Very Secret and Magic Number.',
          options: [
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'input',
              description: 'You attempt to guess the number.',
              required: true,
              minValue: 1,
              maxValue: 100
            }
          ]
        }
      ]
      
    }
  ],
  callback: async (client, interaction) => {
    const userId = interaction.member.id;
    const userGuess = interaction.options.getInteger('input');

    await interaction.deferReply();

    if (!attempts[userId]) {
      attempts[userId] = {
        magicNumber: Math.floor(Math.random() * 100),
        attempts: 0
      };
    }
    
    const gameData = attempts[userId];
    console.log(gameData);
    gameData.attempts += 1;
    let embed;
    if (userGuess === gameData.magicNumber) {
      embed = createSuccessEmbed({int: interaction, title: 'Secret Number Guessed!', descr: `Congratulations! You guessed the magic number ${gameData.magicNumber} in ${gameData.attempts} attempts.`});
    } else if (userGuess < gameData.magicNumber) {
      embed = createSuccessEmbed({int: interaction, title: 'Try again!', descr: 'Too low! Give it another try.'});
    } else {
      embed = createSuccessEmbed({int: interaction, title: 'Try again!', descr: 'Too high! Give it another try.'});
    }
    interaction.editReply({embeds: [embed]});
  }
}