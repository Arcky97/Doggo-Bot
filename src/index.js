require('dotenv').config();
const { Client, IntentsBitField, ActivityType, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent
  ]
});

client.on('ready', (c) => {
  console.log(`'${c.user.username}' is ready!`);

  let serverCount = totalMembers = 0;
  client.guilds.cache.forEach(guild => {
    totalMembers += guild.memberCount - 1;
    serverCount ++;
  });

  client.user.setActivity({
    name: `${totalMembers} Members in ${serverCount} Server!`,
    type: ActivityType.Watching,
  })
  
});

client.on('interactionCreate', async (interaction) => {
  //if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'hey') {
    interaction.reply('Hey!');
  } else if (interaction.commandName === 'ping') {
    interaction.reply('Pong!');
  } else if (interaction.commandName === 'add') {
    const num1 = interaction.options.get('first-number').value;
    const num2 = interaction.options.get('second-number').value;

    interaction.reply(`${num1} + ${num2} = ${num1 + num2}`);
  } else if (interaction.commandName == 'embed') {
    const embed = new EmbedBuilder()
      .setTitle("Embed Title")
      .setDescription('This is an Embed Description.')
      .setColor('Random')
      .addFields(
      { 
        name: 'Field Title', 
        value: 'Some random value.',
        inline: true
      },
      {
        name: 'Another Field Title',
        value: 'Some random value here.',
        inline: true
      }
    );

    interaction.reply({ embeds: [embed] })
  } else if (interaction.isButton()){
    await interaction.deferReply({ ephemeral: true});
    try {
      const role = interaction.guild.roles.cache.get(interaction.customId);
      if (!role) {
        interaction.editReply({
          content: "I couldn't find that role!"
        })
        return;
      }

      const hasRole = interaction.member.roles.cache.has(role.id);

      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.editReply(`The role ${role} has been removed.`);
        return;
      }

      await interaction.member.roles.add(role);
      await interaction.editReply(`The role ${role} has been added.`);
    } catch (error) {
      console.error(error);
    }
  }
})

client.on('messageCreate', (ctx) => {
  if (ctx.channel.id === '934542823724818452') {
    let message = ctx.content.toLowerCase()
    switch (message) {
      case "hello":
        ctx.channel.send("Hey!");
        break;
      case "wassoup":
        ctx.channel.send("Woof!");
        break;
      case "u good":
        ctx.channel.send("Me good! U good?");
        break;
    }
  }
});

client.login(process.env.CLIENT_TOKEN);