require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'hey',
    description: 'Replies with hey!'
  },
  {
    name: 'ping',
    description: 'Pong!'
  },
  {
    name: 'add',
    description: 'Adds two numbers.',
    options: [
      {
        name: 'first-number',
        description: 'The first number.',
        type: ApplicationCommandOptionType.Number,
        choices: [
          {
            name: 'one',
            value: 1
          },
          {
            name: 'two',
            value: 2
          },
          {
            name: 'three',
            value: 3
          }
        ],
        required: true
      },
      {
        name: 'second-number',
        description: 'The second number.',
        type: ApplicationCommandOptionType.Number,
        choices: [
          {
            name: 'one',
            value: 1
          },
          {
            name: 'two',
            value: 2
          },
          {
            name: 'three',
            value: 3
          }
        ],
        required: true
      }
    ]
  },
  {
    name: 'embed',
    description: 'Sends an Embed!'
  },
  {
    name: 'buttonroles',
    description: 'Set up a message with roles that are being given by a button.',
    options: [
      {
        name: 'channel',
        description: "The message's Channel",
        type: ApplicationCommandOptionType.Channel,
        required: true
      },
      {
        name: 'role-1',
        description: 'The first role.',
        type: ApplicationCommandOptionType.Role,
        required: true
      },
      {
        name: 'role-2',
        description: 'The second role',
        type: ApplicationCommandOptionType.Role,
      },
      {
        name: 'role-3',
        description: 'The third role',
        type: ApplicationCommandOptionType.Role
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
})();