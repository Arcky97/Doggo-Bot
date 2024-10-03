const { ApplicationCommandOptionType, AttachmentBuilder, calculateUserDefaultAvatarIndex, ApplicationCommandOptionWithChoicesMixin } = require("discord.js");
const { getAllUsersLevel, getUserLevel, addUserColor } = require("../../../database/levelSystem/setLevelSystem");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { Font, RankCardBuilder } = require("canvacord");
const ntc = require('ntc');

ntc
module.exports = {
  name: 'level',
  description: 'Various commands for the Level System',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'show',
      description: "Show your or another user's current level",
      options: [
        {
          type: ApplicationCommandOptionType.Mentionable,
          name: 'user',
          description: 'The user of who you want to show the level.'
        }
      ] 
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'color',
      description: 'Change the color of your rank card.',
      options : [
        {
          type: ApplicationCommandOptionType.String,
          name: 'color',
          description: 'Input color (color name (for ex. Orange), hex color (for ex. #f97316) or random)',
          required: true,
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'leaderboard',
      description: 'Show the leaderboard for this Server.',
    }
  ],
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const subCommand = interaction.options.getSubcommand();
    
    if (subCommand === 'show') {
      const mentionUserId = interaction.options.get('user')?.value;
      const targetUserId = mentionUserId || interaction.member.id;
      const targetUserObj = await interaction.guild.members.fetch(targetUserId);
  
      const userLevel = await getUserLevel(interaction.guild.id, targetUserId);
  
      if (!userLevel && subCommand === 'show') {
        interaction.editReply(
          mentionUserId ? `${targetUserObj.user.tag} doesn't have a level yet.` : "You don't have a level yet" 
        );
        return;
      }
  
      const guildUsers = await getAllUsersLevel(interaction.guild.id);
  
      guildUsers.sort((a, b) => {
        if (a.level === b.level) {
          return b.xp - a.xp;
        } else {
          return b.level - a.level;
        }
      });
  
      const targetAvatarURL = targetUserObj.user.displayAvatarURL({ size: 256 })
      const color = userLevel.color;
      const startLevelXp = calculateLevelXp(userLevel.level - 1)
      const endLevelXp = calculateLevelXp(userLevel.level)

      let currentRank = guildUsers.findIndex(lvl => lvl.memberId === targetUserId) + 1;
      
      Font.loadDefault();
      const rank = new RankCardBuilder()
        .setAvatar(targetAvatarURL)
        .setRank(currentRank)
        .setLevel(userLevel.level)
        .setCurrentXP(userLevel.xp)
        .setRequiredXP(endLevelXp)
        .setStatus(targetUserObj.presence?.status || 'offline')
        .setUsername(targetUserObj.user.globalName)
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
      try {
        const data = await rank.build();
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({ files: [attachment] });
      } catch (error) {
        console.error("Error building rank card:", error);
        interaction.editReply("There was an error generating the rank card.");
      }
    } else if (subCommand === 'color') {
      const userLevel = await getUserLevel(interaction.guild.id, interaction.member.id);
      if (userLevel) {
        const colorChoice = interaction.options.get('color').value;
        let hexColor;
  
        if (colorChoice.toLowerCase() === 'random') {
          hexColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
          interaction.editReply(`Your random color is ${hexColor}`);
        } else if (colorChoice.startsWith('#', 0)) {
          const hexPattern = /^#([A-Fa-f0-9]{6})$/;
  
          if (hexPattern.test(colorChoice)) {
            hexColor = colorChoice
            interaction.editReply(`Your given color is ${colorChoice}`);
          } else {
            interaction.editReply(`The provided hex color "${colorChoice}" is not valid.`);
          }        
        } else {
          const colorMatch = ntc.names.find(([hex, name]) => name.toLowerCase() === colorChoice.toLowerCase());
          if (colorMatch) {
            hexColor = "#" + colorMatch[0];
            await interaction.editReply(`Your given color name is ${colorMatch[1]} with hex #${colorMatch[0]}`)
          } else {
            await interaction.editReply(`The color name "${colorChoice}" was not found.`);
          }
        }
        if (hexColor) {
          try {
            await addUserColor(interaction.guild.id, interaction.member.id, hexColor);
          } catch (error) {
            console.log('Error inserting color.', error);
          }
        }
      } else {
        await interaction.editReply("You don't have a level yet so you can't set a color just yet.");
      }
    } else if (subCommand === 'leaderboard') {
      await interaction.editReply("Sorry but the leaderboard isn't finished yet. Try again another time or ask <@835094939724808232> to hurry up and finish it!");
    }
  }
}