import { ApplicationCommandOptionType } from "discord.js";

export default {
  name: 'todo',
  description: "Manage the ToDo's for deving this bot.",
  deleted: true,
  devOnly: true,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'add',
      description: 'Add a new Task to the ToDo list.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'task',
          description: 'The name of the Task.',
          required: true
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'description',
          description: 'The description of the Task.',
          required: true
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'group',
          description: 'The Group Name this Task belongs to. (separate with ";" for nested groups)',
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'update',
      description: 'Update the Name and/or description of a task.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'task',
          description: 'Update the Name of a Task.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'id',
              description: 'The ID of the task to edit.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'new',
              description: 'The new Name of the Task.',
              required: true 
            }
          ]          
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'description',
          description: 'Update the Description of a Task.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'id',
              description: 'The ID of the task to edit.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'new',
              description: 'The new Description of the Task.',
              required: true
            }
          ]
        }
      ] 
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'complete',
      description: 'Mark a Task as complete in the ToDo list.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'task',
          description: 'The Name or ID of the Task to mark as completed.',
          required: true 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'remove',
      description: 'Remove a Task from the ToDo list.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'task',
          description: 'The Name or ID of the Task to remove.',
          required: true
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'show',
      description: 'Show a list of all Task in the ToDo List.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'all',
          description: 'Show all Tasks in the ToDo List.'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'incompleted',
          description: 'Show all the Incompleted Tasks in the ToDo List.'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'completed',
          description: 'Show all the Completed Task in the ToDo List.'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'specific',
          description: 'Show a Specific Task by ID or Name in the ToDo List.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'task',
              description: 'The Name or ID of the Task to show.',
              required: true 
            }
          ]
        }
      ]
    }
  ],
  callback: async (interaction) => {
    const subCommand = interaction.options.getSubcommand();
    const subCommandGroup = interaction.options.getSubcommandGroup();
    if (subCommand === 'add') {
      //await addTask(interaction);
    } else if (subCommandGroup === 'update') {
      if (subCommand === 'task') {

      } else if (subCommand === 'description') {

      }
    } else if (subCommand === 'remove') {

    } else if (subCommand === 'complete') {

    } else if (subCommandGroup === 'show') {
      if (subCommand === 'all') {

      } else if (subCommand === 'todo') {

      } else if (subCommand === 'completed') {

      } else if (subCommand === 'Specific') {

      }
    }
  }
}