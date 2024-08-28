require('dotenv').config();
const { Client, IntentsBitField, } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const database = require('./../database/db.js');
const { levelXpRequirements } = require('./utils/levelXpRequirements.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent
  ]
});

async function startBot() {
  try {
    eventHandler(client);
    await database.initDatabase();
    //await levelXpRequirements();
    await client.login(process.env.CLIENT_TOKEN);
  } catch (error) {
    console.error('Error starting the bot:', error);
  }
}

startBot();