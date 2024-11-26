require('dotenv').config();
require('./handlers/dataBaseCleanUp');
const { Client, IntentsBitField, Partials } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const database = require('./../database/db.js');
const { showDatabaseCount } = require('./handlers/DatabaseCount.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildEmojisAndStickers,
  ],
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.User
  ]
});

async function startBot() {
  try {
    eventHandler(client);
    await database.initDatabase();
    await client.login(process.env.CLIENT_TOKEN);
    showDatabaseCount();
  } catch (error) {
    console.error('Error starting the bot:', error);
  }
}

startBot();