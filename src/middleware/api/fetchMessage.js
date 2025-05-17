module.exports = (req, res, next) => {
  if (!client) {
    return res.status(500).json({ error: 'Bot is not initialized.' });
  }

  const message = req.channel.messages.fetch(req.params.messageId);
  if (!message) {
    return res.status(404).json({ error: 'Message not found.' });
  }

  req.message = message;
  next();
}