const Discord = require("discord.js")
const queue = new Map()
const music = require("./utils")
const intents = new Discord.Intents().add("DIRECT_MESSAGES").add("GUILDS").add("GUILD_MESSAGES").add("GUILD_VOICE_STATES").add("GUILD_MEMBERS")
//console.log(intents)
const client = new Discord.Client({intents: intents , ws: {
    properties: {
        $browser: "$iOS"
    }
}})

client.on("ready" , () =>{
    console.log("Ready")
})

client.on("messageCreate" , (message , msg ,s) =>{
    const serverQueue = queue.get(message.guild.id);
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
        music.Skip(message.guild)
    }
    if(command === "dc"){
        if(!message.member.voice.channel ) return message.channel.send({content: "Join A Voice Channel"});
        music.Disconnect(message.guild)
    }
})
client.login(TOKEN)
