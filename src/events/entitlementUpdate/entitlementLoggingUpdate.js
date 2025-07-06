//Premium Access
import { Client, Entitlement, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (oldEntitlement, newEntitlement) => {
  try {
    //await setBotStats(guildId, 'event', { event: 'entitlementUpdate' });
  } catch (error) {
    console.error(error);
  }
}