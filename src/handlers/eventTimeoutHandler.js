const embedQueue = new Map()

export default async (type, id, embed, channel) => {
  try {
    console.log(`Event Timeout Handler: ${type}`);
    const queueKey = type + id
    if (!embedQueue.has(queueKey)) {
      embedQueue.set(queueKey, { embeds: [embed], timeout: null });
    } else {
      const data = embedQueue.get(queueKey);
      data.embeds.push(embed);
      clearTimeout(data.timeout);
    }

    embedQueue.get(queueKey).timeout = setTimeout(async () => {
      console.log(`Event Timeout Handler: ${type}`);
      try {
        const data = embedQueue.get(queueKey);
        if (!data) return;
        const { embeds } = data;
        if (!client.channels.cache.get(channel.id)) return;
        await channel.send({ embeds });
        embedQueue.delete(queueKey);
      } catch (error) {
        console.error("Crashed for no reason!");
      }

    }, 5500);
  } catch (error) {
    console.error('error while setting the event timeout:', error);
  }
}