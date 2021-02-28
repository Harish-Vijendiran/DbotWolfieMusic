const Discord = require('discord.js');
//ytdl for downloading the youtube video
const ytdl = require('ytdl-core');
//ytsearching for searching in youtube
const { YTSearcher } = require('ytsearcher');
//setting the youtube API
const searcher = new YTSearcher({
    key:"AIzaSyBUuV1ji2TW6wB9J3dMDd6E_iCeW5NeGGU",
    revealed: true 
});
//getting client from discord
const client = new Discord.Client();


const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter( file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
//to get the id of the server
const queue = new Map(); 
//starting the event
client.on("ready", () =>{       
    console.log("I'm Online!");
})
//getting the message from user
client.on("message", async(message) =>{
    //setting the prefix
    const prefix = '?';
    //getting the specific server id using map
    const serverQueue = queue.get(message.guild.id); 
    //excluding the first args before space
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    //converting uppercase to lowercase
    const command = args.shift().toLowerCase();
    //command for play, skip, stop, pause, resume using switch
    switch(command){
        case 'play':
            execute(message, serverQueue);
            break;
        case 'stop':
            stop(message, serverQueue);
            break;
        case 'skip':
            skip(message, serverQueue);
            break;
        case 'pause':
            pause(serverQueue);
            break;
        case 'resume':
            resume(serverQueue);
            break;
    }
    //creating a function to
    async function execute(message, serverQueue){
    //getting info about user's voice channel
    let vc = message.member.voice.channel;
    //checking if we are in the voice chat
    if(!vc){
        return message.channel.send("Please join the voice channel to execute this command!");
    }else {
        //searching for the song
        let result = await searcher.search(args.join(" "), {type: "video"});
        //start to download that song
        const songInfo = await ytdl.getInfo(result.first.url);
        //getting song title and url
        let song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        };
        //if the bot is in our voice channel if not it will join
        if(!serverQueue){
            //creating a queue for songs
            const queueConstructor = {
                txtchannel: message.channel,
                vchannel: vc,
                connection: null,
                songs: [],
                volume: 10,
                playing: true
            };
            //setting the server id for queue we created 
            queue.set(message.guild.id, queueConstructor);
            //adding song to the queue
            queueConstructor.songs.push(song);
            //trying to connect to voice channel we are in
            try{
                let connection = await vc.join();
                //by this bot will which voice cahnnel to join
                queueConstructor.connection = connection;
                play(message.guild, queueConstructor.songs[0]);
            }catch (err){
                //if there is error it will show in console
                console.error(err);
                //deleting the server id info
                queue.delete(message.guild.id);
                return message.channel.send(`Unable to connect to voice channel ${err}`);
            }
            }else {
            //if the bot is already in our voice channel we add the song
            serverQueue.songs.push(song);
            return message.channel.send(`The song has been added ${song.url}`);
            }

        }
    }
    function play(guild, song){
        //getting the server id and setting it to serverQueue
        const serverQueue = queue.get(guild.id);
        //if the song is not playing then the bot leave and delete server id info
        if(!song){
            serverQueue.vchannel.leave();
            queue.delete(guild.id);
            return;
        }
        //playing music
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            //if song finish it will play next
            .on("finish", () =>{
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            serverQueue.txtchannel.send(`Now Playing ${serverQueue.songs[0].url}`);
    }
    function stop(message, serverQueue){
        if(!message.member.voice.channel){
            return message.channel.send("You must join the voice channel to execute this command");
        }
        //clears the list of songs
        serverQueue.songs = [];
        //stops the play
        serverQueue.connection.dispatcher.end();
        message.channel.send("The song has stopped playing!");
    }
    
    function skip(message, serverQueue){
        if(!message.member.voice.channel){
            return message.channel.send("You must join the voice channel to execute this command");
        }
        if(!serverQueue){
            return message.channel.send("There is nothing to skip!");
        }
        serverQueue.connection.dispatcher.end();
        message.channel.send("Song Skipped!");
    }

    function pause(serverQueue){
        if(!serverQueue.connection){
            return message.channel.send("There is no music playing currently!");
        }
        if(!message.member.voice.channel){
            return message.channel.send("You must join the voice channel to execute this command");
        }
        if(serverQueue.connection.dispatcher.paused){
            return message.channel.send("The song is already paused");
        }
        serverQueue.connection.dispatcher.pause();
        message.channel.send("The song has been paused");
    }
    function resume(serverQueue){
        if(!serverQueue.connection){
            return message.channel.send("There is no music playing currently!");
        }
        if(!message.member.voice.channel){
            return message.channel.send("You must join the voice channel to execute this command");
        }
        if(serverQueue.connection.dispatcher.resumed){
            return message.channel.send("The song is already playing");
        }
        serverQueue.connection.dispatcher.resume();
        message.channel.send("The song has been resumed");
    }

    if(command == 'help'){
        client.commands.get('help').execute(message, args, Discord );
    }
})
//using token to login to the event
client.login("ODE0Njk3Njc3OTYyODcwODA2.YDhoVg.fsgACjmWtDHQycQytKfTW6Du_Nw")