const { AttachmentBuilder } = require("discord.js");
const getXpFromLevel = require("../../../../managers/levels/getXpFromLevel");
const { Font, RankCardBuilder } = require("canvacord");
const { createErrorEmbed, createInfoEmbed } = require("../../../../services/embeds/createReplyEmbed");
const { setBotStats } = require("../../../../managers/botStatsManager");

module.exports = async (interaction, userLevel, xpSettings, user, guildUsers, globalUsers) => {
  const member = interaction.guild.members.cache.get(user.id);
  let embed;

  if (!userLevel) {
    embed = createInfoEmbed({int: interaction, title: 'Info: No level yet!', descr: `${user ? `${targetUserObj.user.tag} doesn\'t have a level yet.`: 'You don\'t have a level yet.'}`});
    return embed;
  }
  const targetAvatarURL = user.displayAvatarURL({ size: 256 })
  const color = userLevel.color;
  const startLevelXp = getXpFromLevel(userLevel.level, xpSettings);
  const endLevelXp = getXpFromLevel(userLevel.level + 1, xpSettings);

  let currentRank = guildUsers.findIndex(lvl => lvl.memberId === user.id) + 1;
  let globalRank = globalUsers.findIndex(lvl => lvl.userId === user.id) + 1;

  Font.loadDefault();
  const rank = new RankCardBuilder()
    .setAvatar(targetAvatarURL)
    .setRank(currentRank)
    .setGlobalRank(globalRank)
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
            color: color,
            marginTop: "-25px",
            left: "40px"
          }
        }
      },
      statistics: {
        container: {
          style: {
            bottom: "45px",
            left: "40px",
          }
        },
        level: {
          value: {
            style: {
              fontSize: "40px",
              fontWeight: "bold",
              color: color,
              textAlign: "left"
            }
          },
          text: {
            style: {
              fontSize: "30px",
              color: "white",
              textAlign: "left"
            }
          }
        },
        xp: {
          container: {
            style: {
              left: "110px"
            }
          },
          value: {
            style: {
              fontSize: "40px",
              fontWeight: "bold",
              color: color,
              textAlign: "left"
            }
          },
          text: {
            style: {
              fontSize: "30px",
              color: "white",
              textAlign: "left"
            }
          }
        },
        rank: {
          container: {
            style: {
              top: "60px",
              right: "340px"
            }
          },
          value: {
            style: {
              fontSize: "40px",
              fontWeight: "bold",
              color: color,
              textAlign: "left"
            }
          },
          text: {
            style: {
              fontSize: "30px",
              color: "white",
              textAlign: "left"
            }
          }
        },
        global: {
          container: {
            style: {
              top: "60px",
              right: "245px"
            }
          },
          value: {
            style: {
              fontSize: "40px",
              fontWeight: "bold",
              color: color,
              textAlign: "left"
            }
          },
          text: {
            style: {
              fontSize: "30px",
              color: "white",
              textAlign: "left"
            }
          }
        }
      },
      progressbar: {
        container: {
          style: {
            top: "140px",
            right: "240px"
          }
        },
        thumb: {
          style: {
            backgroundColor: color
          }
        }
      },
      avatar: {
        image: {
          style: {
            border: `6px solid ${color}`
          }
        }
      }
    })
    .setTextStyles({
      level: 'Level:',
      xp: 'Exp:',
      rank: 'Rank:',
      global: 'Global:'
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