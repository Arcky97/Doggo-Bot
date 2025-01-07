module.exports = async (channelId, message) => {
  const channel = client.channels.cache.get(channelId);

  if (channel) {
    try {
      await channel.send(message);
    } catch (error) {
      console.error(`Channel with ID '${channelId}' not found!`);
      console.log('-----------------------------------');
    }
  }
}