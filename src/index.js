require('dotenv').config();
const { Client, IntentsBitField, } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const database = require('./../database/db.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent
  ]
});

eventHandler(client);

client.login(process.env.CLIENT_TOKEN);