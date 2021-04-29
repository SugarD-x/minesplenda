
const { Client, Intents, MessageAttachment } = require('discord.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const cron = require('cron');
var fs = require('fs')
var prefix = config.prefix;

var commands = {
  //mod +
  "timeset": ["time set", 2],
  "teleport": ["tp", 2],
  "kick": ["kick", 2],
  "survival": ["gamemode survival", 2],
  "spectate": ["gamemode spectator", 2],
  /*admin+ stuff*/
  "ban": ["ban", 3],
  "say": ["say", 3],
  "pardon": ["pardon", 4],
  "ban-ip": ["ban-ip", 3],
  "pardon-ip": ["pardon-ip", 4],
  "creative": ["gamemode creative", 5],
  //"gamemode": ["gamemode", 6],
  //owner?
  "op": ["op", 7]
};

//var lvl_names = ["everyone", "Moderator", "Administrator", "Owner"];
var lvl_names = ["everyone", "Developer (MC:VS)", "Moderator (MC:VS)", "Administrator (MC:VS)", "Manager (MC:VS)", "Division leader (MC:VS)", "Community Leader", "Server Owner"];

//connect() {
this.mcchatProc = require("child_process").spawn('python3', ['-u', config.mcchatpath, config.mcserver, config.mcuser, config.mcpass]);
console.log('mcchat child');
//}

this.mcchatProc.stdout.on('data', (data) => {
  console.log(`mcchat: ${data}`);
  var logtext = `{data}`
  fs.appendFile('log.txt', data, (err) => {
    if (err) throw err;
  });
  if (data.indexOf('Players online:') >= 0) {
    this.mcchatProc.stdin.write(`/gamemode spectator minesplenda\n`);
  }
});

let websiteAd = new cron.CronJob('0 */22 * * * *', () => {
  this.mcchatProc.stdin.write(`/tellraw @a "Check out our website!"\n`);
  this.mcchatProc.stdin.write(`/tellraw @a "www.asshatgaming.com"\n`);
  console.log("fired ad");
});

let discordAd = new cron.CronJob('0 */18 * * * *', () => {
  this.mcchatProc.stdin.write(`/tellraw @a "Chat with us on Discord!"\n`);
  this.mcchatProc.stdin.write(`/tellraw @a "discord.asshatgaming.com"\n`);
  console.log("fired ad");
});

client.on("ready", async =>{
  console.log("discord");
  client.user.setPresence({
        status: "online",  //You can show online, idle....
  });
  client.user.setActivity('Minecraft, duh', { type: 'PLAYING' });
  discordAd.start();
  websiteAd.start()
});

client.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot || message.guild === null) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  if (!args.length) {
    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

  if (command === 'minesplenda') {
    message.channel.send(`im alive`);
  }

  else if (command === 'gamemode') {
    if(!message.member.roles.cache.some(r=>["Developer (MC:VS)"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!")
    var commaless = args.join(" ");
    this.mcchatProc.stdin.write(`/gamemode ${args[0]} ${args[1]}` + "\n");
    console.log(`${message.author.tag} /gamemode ${commaless}`);
  }
  else if (command === 'uploadlog') {
    if(!message.member.roles.cache.some(r=>["Developer (MC:VS)"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!")
    const attachment = new MessageAttachment('log.txt');
    message.channel.send(`${message.author},`, attachment);
//    message.reply("comingsoon")
  } else {
    var cache = message.member.roles.cache;

    if (commands[command] != undefined) {
    /* "Cuts" the `lvl_names` array from `commands[command][1]` to the end. Example: For the "ban" command, the returned array would be `["Administrator", "Owner"]`. */
      var tmp_lvl = lvl_names.slice(commands[command][1]);

      if (!cache.some(r => tmp_lvl.includes(r.name))) {
        return message.reply("Sorry, you don't have permissions to use this!");
      } else
      {
        var commaless = args.join(" ");
        this.mcchatProc.stdin.write(`/${commands[command][0]} ${commaless}` + "\n");
        console.log(`${message.author.tag} /${commands[command][0]} ${commaless}`);
      }
    }
  }
});

client.login(config.token)
