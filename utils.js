const ytsr = require("ytsr")
const voice = require("@discordjs/voice")
const ytdl = require("ytdl-core")
const funny = require("./random")
const queue = new Map()
const Discord =require("discord.js")


//Main Player


async function Player(message , songname = [String]){
    const serverQueue = queue.get(message.guild.id)
// 
    const em = new Discord.MessageEmbed()

    .setTitle("Loading")
    .setAuthor("MusixPro" , "https://cutewallpaper.org/21/loading-gif-transparent-background/Download-Loading-Gif-Generator-Transparent-Background-PNG-.gif")
    .setDescription(funny())

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
    const serverQueue = queue.get(guild.id);
    const resource = voice.createAudioResource(ytdl(song.url , {audioBitrate: 50000 , quality: "highestaudio"}).on("error" , () =>{
        serverQueue.voiceChannel.disconnect()
        serverQueue.textChannel.send("There are no Songs In The Queue To Play")
    })
    )
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
        serverQueue.songs.shift();
         play2(guild , queue.get(guild.id).songs[0])
    })
}


//play2


async function play2(guild , song){
    const serverQueue = queue.get(guild.id);
    if(song === null) serverQueue.voiceChannel.disconnect() && serverQueue.textChannel.send("There are no Songs In The Queue To Play");
    const resource = voice.createAudioResource(ytdl(song.url , {audioBitrate: 50000 , quality: "highestaudio"}).on("error" , () =>{
        serverQueue.voiceChannel.disconnect()
        serverQueue.textChannel.send("There are no Songs In The Queue To Play")
    })
    )
    serverQueue.resource = resource

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
        serverQueue.songs.shift();
         play(guild , queue.get(guild.id).songs[0])
    })
}


//skip 


async function Skip(guild){
    try{
    const serverQueue = queue.get(guild.id);
    if(!serverQueue.songs){
        serverQueue.textChannel.send({content: 'There are No Songs In queue!'})
    }
        serverQueue.songs.shift()
        play(guild , queue.get(guild.id).songs[0])
    return;
}catch(e){
    const embed1 = new Discord.MessageEmbed()
    .setTitle("No Songs Left")
    .setColor("WHITE")
   message.channel.send({embeds : [embed1]})
}
}


//Now playing


async function NP(guild){
    const serverQueue = queue.get(guild.id);
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
    .setDescription(`Now Playing: 1) **${serverQueue.songs[0]}**\n\n\n` + Queue)
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

//Export Module


module.exports = {
    Player,
    Skip,
    Queue,
    Disconnect,
    NP,
    ERRHandler
}
