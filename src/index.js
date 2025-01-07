require('dotenv').config();
require('./handlers/dataBaseCleanUp');
const { Client, IntentsBitField, Partials } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const database = require('./../database/db.js');
const { checkModerationTasks } = require('./handlers/moderationTasks.js');

global.client = new Client({
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
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildInvites
  ],
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ]
});

async function startBot() {
  try {
    eventHandler();
    await database.initDatabase();
    await client.login(process.env.CLIENT_TOKEN);
    await checkModerationTasks('scheduled');
  } catch (error) {
    console.error('Error starting the bot:', error);
  }
}

startBot();

const botStartTime = Date.now();

module.exports = { botStartTime };