require('dotenv').config();
const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent
  ]
});

const roles = [
  {
    id: '939956933341892699',
    label: 'Red'
  },
  {
    id: '939957044205748314',
    label: 'Green'
  },
  {
    id: '939957124962844752',
    label: 'Blue'
  }
]

client.on('ready', async (c) => {
  try {
    const channel = await client.channels.cache.get('934542823724818452')
    if (!channel) return;

    const row = new ActionRowBuilder();

    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary)
      );
    });
    await channel.send ( {
      content: 'Claim or remove a role below.',
      components: [row]
    });
    process.exit();

  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.CLIENT_TOKEN);