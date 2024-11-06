const embedQueue = new Map()

module.exports = async (type, id, embed, channel) => {
  
  if (!embedQueue.has(type + id)) {
    embedQueue.set(type + id, { embeds: [embed], timeout: null });
  } else {
    const data = embedQueue.get(type + id);
    data.embeds.push(embed);
    clearTimeout(data.timeout);
  }

  embedQueue.get(type + id).timeout = setTimeout(async () => {
    const { embeds } = embedQueue.get(type + id);
    await channel.send({ embeds });
    embedQueue.delete(type + id);
  }, 5000);
}