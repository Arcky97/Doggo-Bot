module.exports = (req, res, next) => {
  if (!client) {
    return res.status(500).json({ error: 'Bot is not initialized'});
  }

  const guild = client.guilds.cache.get(req.params.guildId);
  if (!guild) {
    return res.status(404).json({ error: 'Server not found.' });
  }

  req.guild = guild;
  next();
}