import dotenv from 'dotenv';
dotenv.config();
import './tasks/databaseCleanUp.js';
import './tasks/memberVerificationCheck.js';
import { Client, IntentsBitField, Partials } from 'discord.js';
import eventHandler from './handlers/eventHandler.js';
import { initDatabase } from './managers/databaseManager.js';
import { checkModerationTasks } from './tasks/moderationTasks.js';
import { startAPI } from './api.js';

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
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.DirectMessages
  ],
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.Channel
  ]
});

async function startBot() {
  try {
    eventHandler();
    await initDatabase();
    await client.login(process.env.CLIENT_TOKEN);
    await checkModerationTasks('scheduled');
    startAPI();
  } catch (error) {
    console.error('Error starting the bot:', error);
  }
}

startBot();

export const botStartTime = Date.now();