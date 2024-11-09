const embedQueue = new Map()

module.exports = async (type, id, embed, channel) => {
  const queueKey = type + id
  if (!embedQueue.has(queueKey)) {
    embedQueue.set(queueKey, { embeds: [embed], timeout: null });
  } else {
    const data = embedQueue.get(queueKey);
    data.embeds.push(embed);
    clearTimeout(data.timeout);
  }

  embedQueue.get(queueKey).timeout = setTimeout(async () => {
    const data = embedQueue.get(queueKey);
    if (!data) return;
    const { embeds } = data;
    await channel.send({ embeds });
    embedQueue.delete(queueKey);
  }, 5000);
}