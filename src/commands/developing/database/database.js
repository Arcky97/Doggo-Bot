const { ApplicationCommandOptionType } = require("discord.js");
const { query } = require("../../../../database/db");
const { createSuccessEmbed, createErrorEmbed, createWarningEmbed, createInfoEmbed } = require("../../../utils/embeds/createReplyEmbed");
const exportToJson = require("../../../handlers/exportToJson");

module.exports = {
  name: 'database',
  description: 'Add, Remove or Edit Tables and Columns in the Database with a command.',
  options: [
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'table',
      description: 'Add, Remove or Edit a Table in the Database.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'add',
          description: 'Add a Table to the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'columns',
              description: 'Add 1 or more columns with their datatype and contraints to the Table.',
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'rename',
          description: 'Rename a Table in the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The current Table name.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'rename',
              description: 'The new Table name.',
              required: true 
            }
          ] 
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'clear',
          description: 'Clear the Data inside a Table from the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'remove',
          description: 'Remove a Table from the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'column',
      description: 'Add, Remove or Edit a Column from a Table in the Database.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'add',
          description: 'Add a Column to a Table in the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'column',
              description: 'The Column name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'input',
              description: 'The Data Type and contraint.',
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'modify',
          description: 'Modify the Data type, size or constraints of an existing Column of a Table in the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'column',
              description: 'The Column name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'input',
              description: 'The new Data Type, Size or Contraint.',
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'rename',
          description: 'Change the name of an existing Column of a Table in the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'column',
              description: 'The current Column name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'rename',
              description: 'The new Column name.',
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'default',
          description: 'Add, Change or Remove the default value for a Column of a Table in the Database',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'column',
              description: 'The Column name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'type',
              description: 'The Column Type.',
              required: true  
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'default',
              description: 'The Default Value.',
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'order',
          description: 'Change the Position of a column in a Table in the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'column',
              description: 'The Column name.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'type',
              description: 'The Data Type of the Column.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'after',
              description: 'The Column to place the wanted Column after.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'default',
              description: 'The Default value if applicable.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'remove',
          description: 'Remove a column from a table in the Database.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'column',
              description: 'The Column name.',
              required: true
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'export',
      description: 'Export The Entire Database or a Table to a JSON file.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'table',
          description: 'The Table Name to Export.',
          required: true
        }
      ]
    }
  ],
  devOnly: true,
  callback: async (interaction) => {
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();

    const table = interaction.options.getString('table');
    await interaction.deferReply();

    let embed, insertQuery, title, description;
    let params = [];
    try {
      if (interaction.user.id !== '763287145615982592') {
        switch(subCmdGroup) {
          case 'table':
            switch(subCmd) {
              case 'add':
                const columns = interaction.options.getString('columns');
                insertQuery = `CREATE TABLE \`${table}\` (${columns});`;
                title = 'Table Created!';
                description = `The Table '${table}' has been Created and Added to the Database.`;
                break;
              case 'rename':
                const rename = interaction.options.getString('rename');
                insertQuery = `ALTER TABLE ${table} RENAME TO ${rename};`;
                title = 'Table Renamed';
                description = `The Table '${table}' has been Renamed to '${rename}' in the Database.`;
                break;
              case 'clear':
                insertQuery = `TRUNCATE TABLE \`${table}\`;`;
                title = 'Table Data Cleared';
                description = `The Data in the '${table}' has been cleared in the Database.`;
                break;
              case 'remove':
                insertQuery = `DROP TABLE \`${table}\``;
                title = 'Table Removed';
                description = `The Table '${table}' has been removed from the Database.`;
                break;
            }
            break;
          case 'column':
            const column = interaction.options.getString('column');
            const input = interaction.options.getString('input');
            const rename = interaction.options.getString('rename');
            const value = interaction.options.getString('default');
            const type = interaction.options.getString('type');
            const after = interaction.options.getString('after');
            switch(subCmd) {
              case 'add':
                insertQuery = `ALTER TABLE \`${table}\` ADD \`${column}\` ${input};`;
                title = 'Column Added';
                description = `The Column '${column}' has been added to the '${table}' Table in the Database.`;
                break;
              case 'modify':
                insertQuery = `ALTER TABLE \`${table}\` MODIFY \`${column}\` ${input};`;
                title = 'Column Modified';
                description = `The Column '${column}' has been modified in the '${table}' Table in the Database.`;
                break;
              case 'rename':
                insertQuery = `ALTER TABLE \`${table}\` RENAME COLUMN \`${column}\` TO \`${rename}\`;`;
                title = 'Column Renamed';
                description = `The Column '${column}' has been renamed to '${rename}' in the '${table}' Table in the Database.`;
                break;
              case 'default':
                insertQuery = `ALTER TABLE \`${table}\` MODIFY \`${column}\` ${type} DEFAULT '${value}';`;
                title = 'Column Default Added';
                description = `The Default value for '${column}' has been set to '${value}' in the '${table}' Table in the Database.`;
                break;
              case 'order':
                insertQuery = `ALTER TABLE \`${table}\` MODIFY COLUMN \`${column}\` ${type} AFTER \`${after}\`;`;
                title = 'Column Order Changed';
                description = `The Column '${column}' is now placed after the '${after}' Column in the '${table}' Table in the Database.`;
                break;
              case 'remove':
                insertQuery = `ALTER TABLE \`${table}\` DROP COLUMN \`${column}\`;`;
                title = 'Column Removed';
                description = `The '${column}' has been removed from the '${table}' Table in the Database.`;
                break;
            }
            break;
          default:
            const result = await exportToJson(table, null, true);
            if (result) {
              const { buffer, fileName } = result;
              embed = createSuccessEmbed({
                int: interaction,
                title: `${table} Table Exported`,
                descr: `The ${table} Table has been exported to a JSON file.`
              });
              return interaction.editReply({ embeds: [embed], files: [{ attachment: buffer, name: fileName }] });
            } else {
              embed = createInfoEmbed({
                int: interaction,
                title: 'Table does not Exist',
                descr: `The ${table} Table does not exist in the Database.`
              });
              return interaction.editReply({ embeds: [embed] });
            }
        }
        embed = createSuccessEmbed({
          int: interaction,
          title: title,
          descr: description 
        });
        await query(insertQuery, params)
      } else {
        embed = createWarningEmbed({
          int: interaction,
          title: 'Bad Zeta!',
          descr: `No ${interaction.user}! Don't use this command!`
        });
      }
    } catch (error) {
      console.error(`Error executing the ${subCmdGroup} ${subCmd} command.`, error);
      embed = createErrorEmbed({
        int: interaction, 
        descr: `There was an error with the \`database ${subCmdGroup} ${subCmd}\` command: \`${error.message.split('\n')[0]}\`.`
      })
    }
    interaction.editReply({ embeds: [embed] });
  }
}