import { getUserAttempts, resetUserAttempts } from "../managers/userStatsManager.js";
import firstLetterToUpperCase from "./firstLetterToUpperCase.js";
import getPresentParticle from "./getPresentParticle.js";
import getVowel from "./getVowel.js";

const cooldowns = new Set();

export default async (guildId, memberId, targetId, action, cmdKey, replies, object = null) => {
  const userAttempts = await getUserAttempts(guildId, memberId);
  const attempts = userAttempts[action][cmdKey][targetId];
  const responseArray = replies[Math.min(attempts.temp - 1, replies.length - 1)];
  const response = responseArray[Math.floor(Math.random() * responseArray.length)];

  let title, description; 
  if (response) {
    title = 'But it failed!';
    if (action === 'slap') {
      description = response.replace(/\{(.*?)\}/g, (_, placeholder) => {
        switch (placeholder) {
          case 'object':
            return getVowel(object);
          case 'f-object':
            return firstLetterToUpperCase(getVowel(object));
          case 'object-nv':
            return `${object}`;
          case 'user':
            return `<@${memberId}>`;
          default:
            return `{${placeholder}}`;
        }
      });
    } else {
      description = response;
    }
  } else {
    if (action === 'timeout') action = 'time out';
    title = 'It was a miss!';
    description = `${getPresentParticle(action)} this person is not possible yet, or at least I won\'t give a cool reply when you try...`;
  }

  const cooldownKey = `CCD${guildId + memberId + cmdKey}`;
  if (!cooldowns.has(cooldownKey)) {
    cooldowns.add(cooldownKey);
    setTimeout(async () => {
      cooldowns.delete(cooldownKey);
      // Reset attempts if applicable.
      if (['dev', 'client', 'owner', 'self', 'admin'].includes(cmdKey)) {
        await resetUserAttempts(guildId, memberId, targetId, action.replace(' ', ''), cmdKey);
      }
    }, 30000);
  }
  return { title, description };
}