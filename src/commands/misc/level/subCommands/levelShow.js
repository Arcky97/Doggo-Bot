const { AttachmentBuilder } = require("discord.js");
const calculateXpByLevel = require("../../../../utils/levels/calculateXpByLevel");
const { Font, RankCardBuilder } = require("canvacord");
const { createErrorEmbed, createInfoEmbed } = require("../../../../utils/embeds/createReplyEmbed");
const { setBotStats } = require("../../../../../database/BotStats/setBotStats");

module.exports = async (interaction, userLevel, xpSettings, user, guildUsers) => {
  const member = interaction.guild.members.cache.get(user.id);
  let embed;

  if (!userLevel) {
    embed = createInfoEmbed({int: interaction, title: 'Info: No level yet!', descr: `${user ? `${targetUserObj.user.tag} doesn\'t have a level yet.`: 'You don\'t have a level yet.'}`});
    return embed;
  }
  const targetAvatarURL = user.displayAvatarURL({ size: 256 })
  const color = userLevel.color;
  const startLevelXp = calculateXpByLevel(userLevel.level, xpSettings);
  const endLevelXp = calculateXpByLevel(userLevel.level + 1, xpSettings);

  let currentRank = guildUsers.findIndex(lvl => lvl.memberId === user.id) + 1;
  
  Font.loadDefault();
  const rank = new RankCardBuilder()
    .setAvatar(targetAvatarURL)
    .setRank(currentRank)
    .setLevel(userLevel.level)
    .setCurrentXP(userLevel.xp)
    .setRequiredXP(endLevelXp)
    .setStatus(member.presence?.status || 'offline')
    .setUsername(user.globalName)
    .setProgressCalculator((currentXP) => {
      return ((currentXP - startLevelXp) / (endLevelXp - startLevelXp)) * 100;
    })
    .setStyles({
      username: {
        handle: {
          style: {
            fontSize: "50px",
            fontWeight: "bold",
            color: color
          }
        }
      },
      statistics: {
        xp: {
          value: {
            style: {
              fontSize: "40px",
              fontWeight: "bold",
              color: color 
            }
          },
          text: {
            style: {
              fontSize: "30px",
              color: "white",
            }
          }
        },
        level: {
          value: {
            style: {
              fontSize: "40px",
              fontWeight: "bold",
              color: color 
            }
          },
          text: {
            style: {
              fontSize: "30px",
              color: "white"
            }
          }
        },
        rank: {
          value: {
            style: {
              fontSize: "40px",
              fontWeight: "bold",
              color: color 
            }
          },
          text: {
            style: {
              fontSize: "30px",
              color: "white" 
            }
          }
        }
      },
      progressbar: {
        thumb: {
          style: {
            backgroundColor: color
          }
        }
      },
      avatar: {
        image: {
          style: {
            border: `6px solid ${color}`,
          }
        }
      }
    })
    .setTextStyles({
      level: 'Level:',
      xp: 'Exp:',
      rank: 'Rank:' 
    });
    await setBotStats(interaction.guild.id, 'command', { category: 'misc', command: 'level' });
  try {
    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });
  } catch (error) {
    console.error('Error building rank card:', error);
    embed = createErrorEmbed({int: interaction, descr: 'Something went wrong while generating the rank card. \nPlease try again later.'});
    return embed;
  }
}