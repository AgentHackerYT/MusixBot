const Discord = require("discord.js")
const music = require("./utils")
const intents = new Discord.Intents().add("DIRECT_MESSAGES").add("GUILDS").add("GUILD_MESSAGES").add("GUILD_VOICE_STATES").add("GUILD_MEMBERS")
const config = require('./config.json')
const client = new Discord.Client({intents: intents})
client.on("ready" , () =>{
    console.log("Ready")
})
client.on("messageCreate" , (message) =>{
    const prefix = "lfi!"
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(" ")
    const command = args.shift().toLowerCase()
    if(command === "play"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.Player(message , args.join(" "))
    }
    if(command === "queue"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.Queue(message.guild , message)
    }
    if(command === "skip"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.Skip(message.guild , message)
    }
    if(command === "dc"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.Disconnect(message.guild)
    }
    if(command === "pause"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.Pause(message.guild , message)
    }
    if(command === "resume"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.Resume(message.guild , message)
    }
    if(command === "lyrics"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.Lyrics(message.guild , message)
    }
    if(command === "np"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.NP(message.guild , message)
    }
    if(command === "ping"){
        message.channel.send({content: "Pinging..."}).then(msg =>{
        const embed = new Discord.MessageEmbed()
        .setColor("WHITE")
        .setTitle("Pong!!")
        //.setAuthor("MusixBot" , client.user.displayAvatarURL())
        .addField("Bot Latency" , msg.createdTimestamp - Date.now() + "ms")
        .addField("API Latency" ,`${Math.round(client.ws.ping)}ms`)
        msg.delete()
        message.channel.send({embeds: [embed]})
        })
    }
})
client.login(config.token)
