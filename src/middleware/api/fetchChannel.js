export default (req, res, next) => {
  if (!client) {
    return res.status(500).json({ error: 'Bot is not initialized.'});
  }

  const channel = req.guild.channels.cache.get(req.params.channelId);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found.' });
  }

  req.channel = channel;
  next();
}