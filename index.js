const Discord = require("discord.js")
const intents = new Discord.Intents().add("DIRECT_MESSAGES").add("GUILDS").add("GUILD_MESSAGES").add("GUILD_VOICE_STATES").add("GUILD_MEMBERS")
//console.log(intents)
const client = new Discord.Client({intents: intents})
client.on("ready" , () =>{
    console.log("Ready")
})
client.on("messageCreate" , (message , msg ,s) =>{
    const prefix = "lfi!"
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(" ")
    const command = args.shift().toLowerCase()
    if(command === "play"){
            const Player = require("./utils")
            Player(message , args.join(" "))
    }
})
client.login(TOKEN)
