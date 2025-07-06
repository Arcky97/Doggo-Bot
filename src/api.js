import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import cors from 'cors';
import verifyAPIAccess from './middleware/api/verifyAPIAccess.js';
import fetchGuild from './middleware/api/fetchGuild.js';
import fetchChannel from './middleware/api/fetchChannel.js';
import fetchMessage from './middleware/api/fetchMessage.js';

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/api/discord/:guildId/channels', verifyAPIAccess, fetchGuild, (req, res) => {
  console.log('API Channel Request received.');

  const channels = req.guild.channels.cache.map(channel => ({
    id: channel.id,
    name: channel.name,
    type: channel.type,
    parentId: channel.parentId
  }));
  res.json(channels);
  console.log('API Channel Response sent!');
});

app.get('/api/discord/:guildId/members', verifyAPIAccess, fetchGuild, (req, res) => {
  console.log('API Member Request received.');

  const members = req.guild.members.cache.map(member => {
    const user = member.user;
    return {
      id: member.id,
      bot: user.bot,
      avatar: user.avatar || member.avatar,
      defaultAvatarUrl: user.defaultAvatarUrl,
      globalName: user.globalName || null,
      username: user.username || null,
      nickname: member.nickname || null 
    };
  });
  
  res.json(members);
  console.log('API Member Response sent!');
});

app.get('/api/discord/:guildId/roles', verifyAPIAccess, fetchGuild, (req, res) => {
  console.log('API Roles Request received.');
  
  const roles = req.guild.roles.cache.map(role => ({
    id: role.id,
    name: role.name,
    color: role.color,
    hexColor: role.hexColor
  }));
  res.json(roles);
  console.log('API Role Response sent!');
});

app.get('/api/discord/:guildId/:channelId/:messageId/reactions', verifyAPIAccess, fetchGuild, fetchChannel, fetchMessage, (req, res) => {
  console.log('API Message Reaction Request received.');

  const reactions = req.message.reactions.cache.map(reaction => ({
    id: reaction.id,
    name: reaction.name,
    reaction: reaction.reaction
  }));
  res.json(reactions);
  console.log('API Message Reaction Response sent!')
});

export function startAPI() {
  const PORT = process.env.API_PORT || 3001;
  app.listen(PORT, () => {
    console.log('-----------------------------------');
    console.log(`API Sever running on port ${PORT}`);
    console.log('-----------------------------------');
  });
}