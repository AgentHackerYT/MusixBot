const ytsr = require("ytsr")
const voice = require("@discordjs/voice")
const ytdl = require("ytdl-core")
const queue = new Map()
const Discord =require("discord.js")
async function Player(message , songname = [String]){
    const serverQueue = queue.get(message.guild.id)
    ytsr(songname).then(data =>{
        const connection = voice.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: true
        });
        const player = voice.createAudioPlayer()
        const info = data.items[0]
        const song ={
            title: info.title,
            url: info.url,
            channel: info.owner,
            description: info.description,
            duration: info.duration,
            thumbnail: info.thumbnails[0].url,
            info: info
        }
        if(!serverQueue){
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: connection,
                songs: [],
                volume: 5,
                playing: true,
                player: player,
                info: info
            }
            queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            play(message.guild , queue.get(message.guild.id).songs[0])
            connection.subscribe(player)
        }   else {
            serverQueue.songs.push(song.url);
            const embed = new Discord.MessageEmbed()
.setTitle(song.title)
.setURL(song.url)
.setThumbnail(info.thumbnails[0].url)
.addField("Duration" , song.duration)
.addField("URL" , song.url)
.setColor("WHITE")
message.channel.send({embeds: [embed]})
        }
    })
}
function play(guild , song){
    const serverQueue = queue.get(guild.id);
    const resource = voice.createAudioResource(ytdl(song.url));
    serverQueue.player.play(resource)
    const embed = new Discord.MessageEmbed()
    .setTitle(song.title)
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    .addField("Channel" , song.info.author.name)
    .addField("Duration" , song.duration)
    .addField("URL" , song.url)
    .setColor("WHITE")
    serverQueue.textChannel.send({embeds: [embed]})
    serverQueue.player.on(voice.AudioPlayerStatus.Idle , () =>{
        serverQueue.songs.shift();
    })
}
module.exports = Player
