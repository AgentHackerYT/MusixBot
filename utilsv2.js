const ytsr = require("ytsr");
const voice = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const funny = require("./random");
const queue = new Map();
const Discord = require("discord.js");
const lyrics = require("solenolyrics");
const config = require("./config.json");
const map2 = new Map();

async function Player(message, songname) {
    const serverQueue = queue.get(message.guild.id);

    const embed = new Discord.MessageEmbed()
        .setTitle("Searching Please Wait")
        .setAuthor("MusixPro", "https://cutewallpaper.org/21/loading-gif-transparent-background/Download-Loading-Gif-Generator-Transparent-Background-PNG-.gif")
        .setDescription(funny())
        .setColor("WHITE");

    message.channel.send({ embeds: [embed] });

    const data = await ytsr(songname);
    if (!data.items.length) return message.channel.send("No results found.");

    const info = data.items[0];
    const url = songname.includes("https://") ? songname : info.url;

    const connection = voice.joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: true
    });

    const song = {
        title: info.title,
        url: url,
        channel: info.owner,
        description: info.description,
        duration: info.duration,
        thumbnail: info.thumbnails[0].url,
        badges: info.badges,
        channelURL: info.author.url,
        verified: info.verified,
        views: info.views,
        uploadedAt: info.uploadedAt,
        info: info
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: connection,
            songs: [song],
            volume: 5,
            playing: true,
            player: voice.createAudioPlayer(),
        };

        queue.set(message.guild.id, queueConstruct);
        play(message.guild, queueConstruct.songs[0]);
        connection.subscribe(queueConstruct.player);
    } else {
        serverQueue.songs.push(song);
        const embed = new Discord.MessageEmbed()
            .setTitle(`Added ${song.title} to the queue`)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .addField("Duration", song.duration)
            .addField("URL", song.url)
            .addField("Channel", `[${info.author.name}](${song.channelURL})`)
            .addField("Date Of Upload", song.uploadedAt)
            .setColor("WHITE");

        message.channel.send({ embeds: [embed] });
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        queue.delete(guild.id);
        return;
    }

    const resource = voice.createAudioResource(ytdl(song.url, {
        filter: "audioonly",
        quality: "highestaudio"
    }).on("error", () => {
        serverQueue.voiceChannel.disconnect();
        serverQueue.textChannel.send("Error playing the song.");
    }));

    let volume = map2.get(`${guild.id}_volume`) || 5;
    resource.volume?.setVolumeLogarithmic(volume / 5);

    serverQueue.player.play(resource);

    const embed = new Discord.MessageEmbed()
        .setTitle(song.title)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addField("Duration", song.duration)
        .addField("Channel", `[${song.info.author.name}](${song.channelURL})`)
        .addField("Verified", song.verified ? "Yes" : "No")
        .addField("Date Of Upload", song.uploadedAt)
        .setColor("WHITE");

    serverQueue.textChannel.send({ embeds: [embed] });

    resource.playStream?.on("end", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    });
}

async function Skip(guild, message) {
    const serverQueue = queue.get(guild.id);
    if (!serverQueue || !serverQueue.songs.length) {
        return message.channel.send({ content: 'No songs in queue!' });
    }
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
}

async function NP(guild, message) {
    const serverQueue = queue.get(guild.id);
    if (!serverQueue || !serverQueue.songs.length) {
        return message.channel.send({ embeds: [new Discord.MessageEmbed().setTitle("No Songs Playing").setColor("WHITE")] });
    }

    const song = serverQueue.songs[0];
    const embed = new Discord.MessageEmbed()
        .setTitle(song.title)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addField("Duration", song.duration)
        .addField("Channel", `[${song.info.author.name}](${song.channelURL})`)
        .addField("Verified", song.verified ? "Yes" : "No")
        .addField("Date Of Upload", song.uploadedAt)
        .setColor("WHITE");

    serverQueue.textChannel.send({ embeds: [embed] });
}

async function Disconnect(guild, message) {
    const serverQueue = queue.get(guild.id);
    if (!serverQueue) {
        return message.channel.send({ content: "I am not in a voice channel" });
    }
    serverQueue.voiceChannel.disconnect();
    queue.delete(guild.id);
    message.channel.send({ content: 'Disconnected' });
}

async function Queue(guild, message) {
    const serverQueue = queue.get(guild.id);
    if (!serverQueue || !serverQueue.songs.length) {
        return message.channel.send({ embeds: [new Discord.MessageEmbed().setTitle("Queue Empty").setColor("WHITE")] });
    }

    const queueList = serverQueue.songs.map((song, i) => `${i + 1}) ${song.title}`).join("\n\n");
    const embed = new Discord.MessageEmbed()
        .setTitle(`Queue for ${guild.name}`)
        .setDescription(queueList)
        .setColor("WHITE");

    serverQueue.textChannel.send({ embeds: [embed] });
}

async function Lyrics(guild, message) {
    const serverQueue = queue.get(guild.id);
    if (!serverQueue || !serverQueue.songs.length) {
        return message.channel.send({ content: "No songs playing" });
    }

    const lyricsData = await lyrics.requestLyricsFor(serverQueue.songs[0].title).catch(() => null);
    if (!lyricsData) {
        return message.channel.send({ content: "No Lyrics Found" });
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(`Lyrics for ${serverQueue.songs[0].title}`)
        .setDescription(lyricsData)
        .setColor("WHITE");

    message.channel.send({ embeds: [embed] });
}

function Pause(guild, message) {
    const serverQueue = queue.get(guild.id);
    if (!serverQueue || !serverQueue.player) return message.channel.send({ content: "No songs playing" });

    serverQueue.player.pause();
    message.channel.send("Paused");
}

function Resume(guild, message) {
    const serverQueue = queue.get(guild.id);
    if (!serverQueue || !serverQueue.player) return message.channel.send({ content: "No songs playing" });

    serverQueue.player.unpause();
    message.channel.send("Resumed");
}

module.exports = { Player, Skip, NP, Disconnect, Queue, Lyrics, Pause, Resume };
