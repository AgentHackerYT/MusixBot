const ytdl = require('ytdl-core')
const ytsr = require('ytsr')
const voice = require('@discordjs/voice')
const config = require("./config.json")
const {Client, Intents} = require('discord.js')
const client = new Client({intents: [Intents.FLAGS.GUILDS , Intents.FLAGS.GUILD_VOICE_STATES]})
client.login(config.token)
exports.Player =  async function Player(opts){
ytsr(opts.query).then(data =>{
    const player = voice.createAudioPlayer()
    const connection = voice.joinVoiceChannel({
        channelId: opts.channel,
        guildId: opts.guild,
        adapterCreator:  client.guilds.cache.get(opts.guild).voiceAdapterCreator
    })
    const resource = voice.createAudioResource(ytdl(data.items[0].url))

    player.play(resource)
    connection.subscribe(player)
})  
}
