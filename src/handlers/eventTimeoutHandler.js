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
      const data = embedQueue.get(queueKey);
      if (!data) return;
      const { embeds } = data;
      await channel.send({ embeds });
      embedQueue.delete(queueKey);
    }, 5500);
  } catch (error) {
    console.error('error while setting the event timeout:', error);
  }
}