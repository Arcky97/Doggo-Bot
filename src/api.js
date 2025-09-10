import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import cors from 'cors';
import verifyAPIAccess from './middleware/api/verifyAPIAccess.js';
import fetchGuild from './middleware/api/fetchGuild.js';
import fetchChannel from './middleware/api/fetchChannel.js';
import fetchMessage from './middleware/api/fetchMessage.js';
import { selectData } from './services/database/selectData.js';
import { EmbedBuilder } from 'discord.js';
import { updateData } from './services/database/updateData.js';
import { createEmbed } from './services/embeds/createDynamicEmbed.js'
import { checkClientPermissions } from './middleware/permissions/checkPermissions.js';

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

app.post('/api/discord/:guildId/:embedId/send-embed', verifyAPIAccess, fetchGuild, async (req, res) => {
  try {
    console.log('API Send or Update Embed Request received.');

    const { guildId: guild, embedId } = req.params;

    const [embedRow] = await Promise.all([
        selectData("GeneratedEmbeds", { guildId: guild, id: parseInt(embedId) }),
      ]);

    if (!embedRow) return res.status(404).json({ error: "Embed not found" });

    const { id, guildId, channelId, messageId, ...options } = embedRow;

    if (!channelId) return res.status(400).json({ error: "No channelId set for this embed" });

    const guildObj = await client.guilds.fetch(guildId);
    const channelObj = await guildObj.channels.fetch(channelId);

    if (!channelObj || !channelObj.isTextBased()) {
      return res.status(200).json({ message: "The selected channel is not valid!" });
    }

    const botPerms = await checkClientPermissions(channelObj, []);
    if (!botPerms.hasAll) {
      return res.status(200).json({ message: `Missing permissions to send embed to selected channel! Required: ${botPerms.array.join(', ')}.`});
    }

    const parsedOptions = {
      ...options,
      author: JSON.parse(options.author),
      fields: JSON.parse(options.fields),
      footer: JSON.parse(options.footer),
    };

    const embed = await createEmbed(null, parsedOptions);
    let sentMessage;
    let message;
    if (messageId) {
      try {
        const existingMessage = await channelObj.messages.fetch(messageId);
        sentMessage = await existingMessage.edit({ embeds: [embed] });
        message = "Embed Updated Successfully.";
      } catch (error) {
        console.warn("Message not found, sending a new one instead");
        sentMessage = await channelObj.send({ embeds: [embed] });
        message = "Embed was sent again because it was either deleted or the destination channel was changed.";
      }
    } else {
      sentMessage = await channelObj.send({ embeds: [embed] });
      message = "Message Sent Successfully";
    }

    await updateData("GeneratedEmbeds", { guildId, id }, { messageId: sentMessage.id });

    console.log("API Send or Update Embed Response sent!");
    return res.status(200).json({ success: true, messageId: sentMessage.id, message });
  } catch(error) {
    console.error("Error handling send-embed:", error);
    return res.status(500).json({ error: "Internal Server Error", message: "Embed was not sent!" });
  }
})

export function startAPI() {
  const PORT = process.env.API_PORT || 3001;
  app.listen(PORT, () => {
    console.log('-----------------------------------');
    console.log(`API Server running on port ${PORT}`);
    console.log('-----------------------------------');
  });
}