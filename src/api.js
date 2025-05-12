require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const verifyAPIAccess = require('./middleware/api/verifyAPIAccess');
const fetchGuild = require('./middleware/api/fetchGuild');

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/api/server-data', async (req, res) => {
  console.log('API Server Data request received');
  if (req.query.token !== process.env.API_TOKEN) return res.status(403).json({ error: 'Access Denied!'});

  const guildId = req.query.guildId;
  if (!client) return res.status(500).json({ error: 'Bot not initialized' });

  const guild = client.guilds.cache.get(guildId);
  if (!guild) return res.status(404).json({ error: 'Server not found' });

  const roles = client
  await guild.fetch();
  res.json({
    id: guild.id,
    name: guild.name
  });
});

app.get('/api/discord/:guildId/channels', verifyAPIAccess, fetchGuild, (req, res) => {
  console.log('API Channel Request received.');

  const channels = req.guild.channels.cache.map(channel => ({
    id: channel.id,
    name: channel.name,
    type: channel.type
  }));
  res.json({ channels });
});

app.get('/api/discord/:guildId/members', (req, res) => {
  console.log('API Member Request received.');
  
  const members = req.guild.users.cache.map(user => ({
    id: user.id,
    name: user.globalName,
  }));
  res.json({ members });
});

app.get('/api/discord/:guildId/roles', (req, res) => {
  console.log('API Roles Request received.');
  
});

app.get('/api/discord/:guildId/:channelId/message', (req, res) => {
  console.log('API Message Request received.');
});

app.get('/api/discord/:guildId/:channelId/:messageId/reactions', (req, res) => {
  console.log('API Message Reaction Request received.');
});



function startAPI() {
  const PORT = process.env.API_PORT || 3001;
  app.listen(PORT, () => {
    console.log('-----------------------------------');
    console.log(`API Sever running on port ${PORT}`);
    console.log('-----------------------------------');
  });
}

module.exports = { startAPI };