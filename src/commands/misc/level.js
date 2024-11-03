const { ApplicationCommandOptionType, AttachmentBuilder, EmbedBuilder, GuildWidgetStyle } = require("discord.js");
const { getAllUsersLevel, getUserLevel, addUserColor } = require("../../../database/levelSystem/setLevelSystem");
const calculateXpByLevel = require("../../utils/levels/calculateXpByLevel");
const { Font, RankCardBuilder } = require("canvacord");
const getOrConvertColor = require("../../utils/getOrConvertColor");
const { createErrorEmbed, createInfoEmbed } = require("../../utils/createReplyEmbed");
const { getLevelSettings, getXpSettings } = require("../../../database/levelSystem/setLevelSettings");

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
    const mentionUserId = interaction.options.get('user')?.value;
    const targetUserId = mentionUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);
    const userLevel = await getUserLevel(interaction.guild.id, targetUserId);
    const guildUsers = await getAllUsersLevel(interaction.guild.id);
    const xpSettings = await getXpSettings(interaction.guild.id);
    guildUsers.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let embed; 

    if (subCommand === 'show') {
  
      if (!userLevel && subCommand === 'show') {
        embed = createInfoEmbed({int: interaction, title: 'Info: No level yet!', descr: `${mentionUserId ? `${targetUserObj.user.tag} doesn\'t have a level yet.`: 'You don\'t have a level yet.'}`});
        if (embed) interaction.editReply({embeds: [embed]});
        return;
      }
      const targetAvatarURL = targetUserObj.user.displayAvatarURL({ size: 256 })
      const color = userLevel.color;
      const startLevelXp = calculateXpByLevel(userLevel.level - 1, xpSettings);
      const endLevelXp = calculateXpByLevel(userLevel.level, xpSettings);

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
        console.error('Error building rank card:', error);
        embed = createErrorEmbed(interaction, 'Something went wrong while generating the rank card. \nPlease try again later.');
        interaction.editReply({ embeds: [embed] });
      }
    } else if (subCommand === 'color') {
      if (userLevel) {
        const colorChoice = interaction.options.get('color').value;
        let { hexColor, message } = await getOrConvertColor(colorChoice, true);
        if (hexColor) {
          const thumbnailUrl = `https://singlecolorimage.com/get/${hexColor.replace('#','')}/64x64`
          embed = new EmbedBuilder()
            .setColor(hexColor)
            .setTitle('New Rank Card Color')
            .setDescription(message)
            .setThumbnail(thumbnailUrl)
            .setTimestamp()
          try {
            await addUserColor(interaction.guild.id, interaction.member.id, hexColor);
          } catch (error) {
            console.log('Error inserting color.', error);
            embed = createErrorEmbed(interaction, 'Something went wrong while setting you color. \nPlease try again later.');
            if (embed) interaction.editReply({embeds: [embed]});
          }
        } else {
          embed = createErrorEmbed(interaction, message);
        }
        interaction.editReply({ embeds: [embed] });
      } else {
        embed = createInfoEmbed({int: interaction, title: 'Info: No level Yet!', descr: 'You don\'t have a level yet so you can\'t set a color just yet.'});
        if (embed) interaction.editReply({embeds: [embed]});
      }
    } else if (subCommand === 'leaderboard') {
      if (guildUsers.length > 0) {
        embed = new EmbedBuilder()
          .setColor('Green')
          .setTitle(`${interaction.guild.name}'s Leaderboard.`)
          .setTimestamp()
          .setThumbnail(interaction.guild.iconURL())
        let rank = 1;
        let descrition = '';
        for (const user of guildUsers) {
          descrition += `\n\n**#${rank}**: <@${user.memberId}>` +
                        `\n   **Lv.** \`${user.level}\`` +
                        `\n   **Xp:** \`${user.xp}/${calculateXpByLevel(user.level, xpSettings)}\`` 
          rank ++;
        }
        embed.setDescription(descrition);
      } else {
        embed = createInfoEmbed({int: interaction, descr: 'Sorry but no one in this server has a level yet.'});
      }
      if (embed) interaction.editReply({embeds: [embed]});
    }
  }
}