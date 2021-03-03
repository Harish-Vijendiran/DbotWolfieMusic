const { Client } = require("discord.js");

module.exports = async (client) => {
    const guild = client.guilds.cache.get(process.env.wolfie_server); //serverID
    setInterval(() => {
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get(process.env.total_count)//ChannelID
        channel.setName(`Total Member : ${memberCount.toLocaleString()}`);
        console.log('Updating Member Count');
    }, 900000);
}