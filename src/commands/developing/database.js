const { ApplicationCommandOptionType } = require("discord.js");

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

          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'edit',
          description: 'Edit a Table in the Database.',
          options: [

          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'remove',
          description: 'Remove a Table from the Database.',
          options: [

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
              name: 'type',
              description: 'The Data Type.',
              choices: [
                {
                  name: 'varchar',
                  value: 'CHAR'
                },
                {
                  name: 'boolean',
                  value: 'BOOLEAN'
                },
                {
                  name: 'int',
                  value: 'INT'
                },
                {
                  name: 'bigint',
                  value: 'BIGIN'
                },
                {
                  name: 'timestamp',
                  value: 'TIMESTAMP'
                },
                {
                  name: 'json',
                  value: 'JSON'
                }
              ],
              required: true 
            },
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'primary',
              description: 'Wether this column is a Primary Key?',
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: 'length',
              description: 'If you chose \'varchar\' as the type, give the size here.',
              minValue: 1,
              maxValue: 65535
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'default',
              description: 'Add the Default Value.',
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
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'free',
          description: 'For any missing actions, add them here so they\'ll be executed.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'table',
              description: 'The Table name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'input',
              description: 'Your Free input to be executed',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'column',
              description: 'The Column name'
            }
          ]
        }
      ]
    }
  ],
  devOnly: true,
  callback: async (client, interaction) => {

  }
}