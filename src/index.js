require('dotenv').config();
const { Client, IntentsBitField, ActivityType } = require('discord.js');

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

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'hey') {
    interaction.reply('Hey!');
  } else if (interaction.commandName === 'ping') {
    interaction.reply('Pong!');
  } else if (interaction.commandName === 'add') {
    const num1 = interaction.options.get('first-number').value;
    const num2 = interaction.options.get('second-number').value;

    interaction.reply(`${num1} + ${num2} = ${num1 + num2}`);
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