       const ytsr = require("ytsr")
          ytsr(args.join(" ") , {
                limit: 5
          }).then(data =>{
                var i = 1
                message.channel.send({content: data.items.map(x => {return `${i++}) ${x.title}`}).join("\n")})
                const filter = m => m.content.startsWith("1") || m.content.startsWith("2") || m.content.startsWith("3") || m.content.startsWith("4") || m.content.startsWith("5") && !m.author.bot
                            const collector = new Discord.MessageCollector(message.channel,filter , {time: 15000})
            collector.on("collect" , (msg) =>{
                  if(msg.content == "1"){
                        const connection = voice.joinVoiceChannel({channelId: message.member.voice.channel.id , guildId: message.guild.id , adapterCreator: message.guild.voiceAdapterCreator})
                        const player = voice.createAudioPlayer()
                        const resource = voice.createAudioResource(ytdl(data.items[0].url))
                        connection.subscribe(player)
                        player.play(resource)
                        message.channel.send({
                           content: data.items[0].title   
                        })
                        collector.stop("Choosed")
                  }else if(msg.content == "2"){
                        const connection = voice.joinVoiceChannel({channelId: message.member.voice.channel.id , guildId: message.guild.id , adapterCreator: message.guild.voiceAdapterCreator})
                        const player = voice.createAudioPlayer()
                        const resource = voice.createAudioResource(ytdl(data.items[1].url))
                        connection.subscribe(player)
                        player.play(resource)
                        message.channel.send({
                           content: data.items[1].title   
                        })
                        collector.stop("Choosed")
                  }else if(msg.content == "3"){
                        const connection = voice.joinVoiceChannel({channelId: message.member.voice.channel.id , guildId: message.guild.id , adapterCreator: message.guild.voiceAdapterCreator})
                        const player = voice.createAudioPlayer()
                        const resource = voice.createAudioResource(ytdl(data.items[2].url))
                        connection.subscribe(player)
                        player.play(resource)
                        message.channel.send({
                           content: data.items[2].title   
                        })
                        collector.stop("Choosed")
                  }else if(msg.content == "4"){
                        const connection = voice.joinVoiceChannel({channelId: message.member.voice.channel.id , guildId: message.guild.id , adapterCreator: message.guild.voiceAdapterCreator})
                        const player = voice.createAudioPlayer()
                        const resource = voice.createAudioResource(ytdl(data.items[3].url))
                        connection.subscribe(player)
                        player.play(resource)
                        message.channel.send({
                           content: data.items[3].title   
                        })
                        collector.stop("Choosed")
                  }else if(msg.content == "5"){
                        const connection = voice.joinVoiceChannel({channelId: message.member.voice.channel.id, guildId: message.guild.id , adapterCreator: message.guild.voiceAdapterCreator})
                        const player = voice.createAudioPlayer()
                        const resource = voice.createAudioResource(ytdl(data.items[4].url))
                        connection.subscribe(player)
                        player.play(resource)
                        message.channel.send({
                           content: data.items[4].title   
                        })
                        collector.stop("Choosed")
                  }
              
            })
          })
