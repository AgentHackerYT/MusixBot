const ytsr = require("ytsr")
const voice = require("@discordjs/voice")
const ytdl = require("ytdl-core")
const funny = require("./random")
const queue = new Map()
const Discord = require("discord.js")
const lyrics = require("solenolyrics")
const config = require("./config.json")
const map2 = new Map()

//Main Player


async function Player(message , songname = [String]){
    const serverQueue = queue.get(message.guild.id)
// 
    const em = new Discord.MessageEmbed()

    .setTitle("Searching Please Wait")
    .setAuthor("MusixPro" , "https://cutewallpaper.org/21/loading-gif-transparent-background/Download-Loading-Gif-Generator-Transparent-Background-PNG-.gif")
    .setDescription(funny())
    .setColor("WHITE")

    message.channel.send({embeds: [em]}).then(funny =>{

    ytsr(songname).then(data =>{


        const player = voice.createAudioPlayer()

        const info = data.items[0]

        let url = info.url

        if(songname.includes(["https://"])){

        url= songname

        }
        const connection = voice.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: true
        });
        const song ={
            title: info.title,
            url: info.url,
            channel: info.owner,
            description: info.description,
            duration: info.duration,
            thumbnail: info.thumbnails[0].url,
            badges: info.badges,
            channelURL: info.author.url,
            verfied: info.verified,
            views: info.views,
            uploadedAt: info.uploadedAt,
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
                info: info,
                resource: null

            }
            queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            play(message.guild , queue.get(message.guild.id).songs[0])
            funny.delete()
            connection.subscribe(player)
        }   else {
            serverQueue.songs.push(song);
            const embed = new Discord.MessageEmbed()
.setTitle("Added " + song.title + " To The Queue")
.setURL(song.url)
.setThumbnail(info.thumbnails[0].url)
.addField("Duration" , song.duration)
.addField("URL" , song.url)
//.addField("Badges" , song.badges || "No Badges")
.addField("Channel" , `[${info.author.name}](${song.channelURL})`)
//.addField("Verfied" , song.verfied)
.addField("Date Of Upload", song.uploadedAt)
.setColor("WHITE")

.setColor("WHITE")
message.channel.send({embeds: [embed]})
        }
    })
})
}


//Play1


function play(guild , song){
    try{
    const serverQueue = queue.get(guild.id);
    if(!song){
        queue.delete(guild.id);
    }
    const resource = voice.createAudioResource(ytdl(song.url , {
        filter: "audioonly" , quality: "highestaudio"
    }).on("error" , () =>{
        serverQueue.voiceChannel.disconnect()
        serverQueue.textChannel.send("There are no Songs In The Queue To Play")
    })
    )
    let final = map2.get(`${guild.id}_volume`)
    if(final == null) final = 5
   // resource.volume.setVolumeLogarithmic(final / 5)
    serverQueue.player.on("volUpdate" , () =>{
        resource.volume.setVolumeLogarithmic(map2.get(`${guild.id}_volume`) || 5 / 5)
    })
   //resource.encoder._read("-af apulsator=hz=0.08")
    serverQueue.player.play(resource)
    const embed = new Discord.MessageEmbed()
    .setTitle(song.title)
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    .addField("Duration" , song.duration)
    .addField("Duration" , song.duration)
    .addField("URL" , song.url)
    //.addField("Badges" , song.badges || "No Badges")
.addField("Channel" , `[${song.info.author.name}](${song.channelURL})`)
.addField("Verfied" , song.verfied || "false")
.addField("Date Of Upload", song.uploadedAt)
    .setColor("WHITE")
    serverQueue.textChannel.send({embeds: [embed]})
    resource.playStream.on("end" , () =>{
        serverQueue.player.on("loop" , () =>{
            play2(guild ,  queue.get(guild.id).songs[0])
        })
        serverQueue.songs.shift();
         play2(guild , queue.get(guild.id).songs[0])
    })
}catch (e){
    return;
}
}


//play2


async function play2(guild , song){
    try{
    const serverQueue = queue.get(guild.id);
    if(!song){
        queue.delete(guild.id);
    }
    if(song === null) serverQueue.voiceChannel.disconnect() && serverQueue.textChannel.send("There are no Songs In The Queue To Play");
    const resource = voice.createAudioResource(ytdl(song.url ,{
        filter: "audioonly" , quality: "highestaudio"
    }).on("error" , () =>{
        serverQueue.voiceChannel.disconnect()
        serverQueue.textChannel.send("There are no Songs In The Queue To Play")
    })
    )
    serverQueue.resource = resource
    let final = map2.get(`${guild.id}_volume`)
    if(final == null) final = 5
    // resource.encoder._read("-af apulsator=hz=0.08")
    resource.volume.setVolumeLogarithmic(map2.get(`${guild.id}_volume`) || 5 / 5)
    serverQueue.player.on("volUpdate" , () =>{
        resource.volume.setVolumeLogarithmic(final / 5)
    })
    if(serverQueue.songs !== null) serverQueue.voiceChannel.disconnect();
    serverQueue.player.play(resource)
    const embed = new Discord.MessageEmbed()
    .addField("Duration" , song.duration)
    .setTitle(song.title)
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    //.addField("Badges" , song.badges || "No Badges")
.addField("Channel" , `[${song.info.author.name}](${song.channelURL})`)
.addField("Verfied" , song.verfied || " false")
.addField("Date Of Upload", song.uploadedAt)
    .setColor("WHITE")
    serverQueue.textChannel.send({embeds: [embed]})
    resource.playStream.on("end" , () =>{
        serverQueue.player.on("loop" , () =>{
            play(guild ,  queue.get(guild.id).songs[0])
        })
        serverQueue.songs.shift();
         play(guild , queue.get(guild.id).songs[0])
    })
}catch (e){
    return;
}
}


//skip 


async function Skip(guild , message){
    try{
    const serverQueue = queue.get(guild.id);
    if(!serverQueue.songs){
        serverQueue.textChannel.send({content: 'There are No Songs In queue!'})
    }
        serverQueue.songs.shift()
        play2(guild , queue.get(guild.id).songs[0])
    return;
}catch(e){
    const embed1 = new Discord.MessageEmbed()
    .setTitle("No Songs Left")
    .setColor("WHITE")
   message.channel.send({embeds : [embed1]})
}
}


//Now playing


async function NP(guild , message){
    try{
    const serverQueue = queue.get(guild.id);
    const embed = new Discord.MessageEmbed()
    .setTitle(serverQueue.songs.title)
    .setURL(serverQueue.songs.url)
    .setThumbnail(serverQueue.songs.thumbnail)
    .addField("Duration" , serverQueue.songs.duration)
    .addField("Duration" , serverQueue.songs.duration)
    .addField("URL" , serverQueue.songs.url)
    //.addField("Badges" , serverQueue.songs.badges || "No Badges")
.addField("Channel" , `[${serverQueue.songs.info.author.name}](${serverQueue.songs.channelURL})`)
.addField("Verfied" , serverQueue.songs.verfied || "false")
.addField("Date Of Upload", serverQueue.songs.uploadedAt)
    .setColor("WHITE")
    serverQueue.textChannel.send({embeds: [embed]})
    }catch (e){
        const embed1 = new Discord.MessageEmbed()
        .setTitle("No Songs Left")
        .setColor("WHITE")
       message.channel.send({embeds : [embed1]})
    }
}


//Disconnect


async function Disconnect(guild , message){
    try{
    const serverQueue = queue.get(guild.id);
    serverQueue.voiceChannel.disconnect()
    serverQueue.textChannel.send({content: 'Disconnected'})
    }catch (e) {
        if(!message.member.voice.channel.valueOf()){
        message.channel.send({content: 'Join A Voice Channel First'})
        }else{
            message.channel.send({content: "I am not in a voice channel"})
        }
    }
}


//Queue


async function Queue(guild ,message){
    var i = 2
    const serverQueue = queue.get(guild.id)
    try{
    
    const Queue = serverQueue.songs.slice(1).map(function(elem){
        return `${i++}) ` + elem.title;
    }).join("\n\n")
    console.log(Queue)
    const embed = new Discord.MessageEmbed()
    .setTitle("Queue For " + guild.name)
    .setDescription(`Now Playing: 1) **${serverQueue.songs[0].title}**\n\n\n` + Queue)
    .setColor("WHITE")
    serverQueue.textChannel.send({embeds : [embed]})
}catch(err){
    const embed1 = new Discord.MessageEmbed()
    .setTitle("Queue For " + guild.name)
    .setDescription("No Songs Playing , Get The Party Started")
    .setColor("WHITE")
   message.channel.send({embeds : [embed1]})
}
}


//Err Handler


async function ERRHandler(Input , message){
    message.channel.send(Input)
}


//PausePlay


function Pause(guild , message){
    try{
    const serverQueue = queue.get(guild.id)

    serverQueue.player.pause(true)
    message.channel.send("Paused")
    return serverQueue.player.pause()
    }catch(err){
        message.channel.send({content: "No Songs Playing"})
    }
}


//Resume



function Resume(guild , message){
    try{
    const serverQueue = queue.get(guild.id)
    serverQueue.player.unpause(true)
    message.channel.send("Resumed")
    }catch(err){
        message.channel.send({content: "No Songs Playing"})
    }
}


async function Lyrics(guild, message){
    try{
    const serverQueue = queue.get(guild.id)
lyrics.requestLyricsFor(serverQueue.songs[0].title).then(data =>{
    const embed = new Discord.MessageEmbed()
    .setColor("WHITE")
    .setDescription(data)
    .setTitle("Lyrics for " + serverQueue.songs[0].title)
    message.channel.send({embeds : [embed]})
}).catch(e =>{
    console.log(e)
    message.channel.send({content: "No Lyrics Found"})
})
    }catch(e){
        message.channel.send({content: "No Songs Playing"})
    }
}


//Volume


async function Volume(vol , message){
const volume = parseInt(vol)
const serverQueue = queue.get(message.guild.id)
if(amount < 1 || amount > 100){
    return message.channel.send('you need to input a number between 1 and 100.');
}
map2.set(`${message.guild.id}_volume` , volume)
serverQueue.player.emit('volUpdate')
message.channel.send({content: `Volume Set To ${volume}`})
}


//Export Module


module.exports = {
    Player,
    Skip,
    Queue,
    Disconnect,
    NP,
    Pause,
    Resume,
    Lyrics,
    Volume,
    ERRHandler
}
