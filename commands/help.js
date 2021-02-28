module.exports = {
    name: 'help',
    description: 'Embeds!',
    execute(message, args, Discord){

        const newEmbed = new Discord.MessageEmbed()
        .setColor('#7D93C8')
        .setTitle('🐺 WolfieMusic Guide 🐺')
        .setAuthor('Developer: LonelyWolf😋')
        .setDescription('Commands for WolfieMusic🐺 are given below:')
        .addFields(
            {name:'Commands',value:'#play + Url or name of the song - play song\n#skip - skip song\n#stop - stop song\n#resume - resume song\n#pause - pause song'},

        )
            .setImage('https://www.itl.cat/pngfile/big/229-2290514_white-wolf-howling-at-moon.jpg')
            .setFooter('Enjoy your time with WolfieMusic 🐺🎶');

            message.channel.send(newEmbed);
        /*
        let role = message.guild.roles.cache.find(r => r.name === "Tester");
        
        if(message.member.permissions.has("ADMINISTRATOR")){
            message.channel.send('Testing Successful :)');
        }else {
            message.channel.send('Testing Failed :(');
        }*/
    }
}
