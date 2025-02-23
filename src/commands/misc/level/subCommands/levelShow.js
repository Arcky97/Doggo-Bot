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
      container: {
        style: {
          top: "140px",
        }
      },
      username: {
        handle: {
          style: {
            fontSize: "50px",
            fontWeight: "bold",
            color: color,
            left: "40px"
          }
        }
      },
      statistics: {
        level: {
          container: {
            style: {
              bottom: "70px", 
              left: "40px"
            }
          },
          value: {
            style: {
              fontSize: "35px",
              fontWeight: "bold",
              color: color,
            }
          },
          text: {
            style: {
              fontSize: "25px",
              color: "white",
            }
          }
        },
        xp: {
          container: {
            style: {
              bottom: "165px",
              left: "280px"
            }
          },
          value: {
            style: {
              fontSize: "35px",
              fontWeight: "bold",
              color: color
            }
          },
          text: {
            style: {
              fontSize: "25px",
              color: "white"
            }
          }
        },
        rank: {
          container: {
            style: {
              bottom: "206px",
              left: "40px"
            }
          },
          value: {
            style: {
              fontSize: "35px",
              fontWeight: "bold",
              color: color,
            }
          },
          text: {
            style: {
              fontSize: "25px",
              color: "white",
            }
          }
        },
        global: {
          container: {
            style: {
              bottom: "297px",
              left: "280px"
            }
          },
          value: {
            style: {
              fontSize: "35px",
              fontWeight: "bold",
              color: color,
            }
          },
          text: {
            style: {
              fontSize: "25px",
              color: "white",
            }
          }
        }
      },
      progressbar: {
        container: {
          style: {
            top: "138px",
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
            border: `6px solid ${color}`,
            bottom: "13px"
          }
        },
        status: {
          style: {
            bottom: "13px"
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