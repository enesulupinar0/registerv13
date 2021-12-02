const { Discord, MessageEmbed, Client, Collection } = require('discord.js')
const { joinVoiceChannel } = require('@discordjs/voice');
const client = global.client
const chalk = require('chalk')
const settings = require('../../Client_Settings.json')

module.exports = async() => {
   
    let durum;
    if(settings.Client_Status === "dnd") durum = "Rahatsız Etmeyin."
    if(settings.Client_Status === "online") durum = "Çevirim içi."
    if(settings.Client_Status === "idle") durum = "Boşta."
    if(settings.Client_Status === "invisible") durum = "Görünmez."
    
    client.user.setPresence({activities: [{name: settings.Client_Message, type: "WATCHING"}], status: settings.Client_Status})
    console.log(chalk.yellow("HAZIR - Botun bilgileri aşağıda paylaşıldı.\nBotun durumunda "+settings.Client_Message+" yazıyor\nBotun durumu "+durum+" \nBotun prefixleri: "+settings.Client_Prefixs+" ✔"))
    
    let voiceChannel = client.channels.cache.get(settings.Client_Voice_ID)
    if(voiceChannel && client.channels.cache.get(settings.Client_Voice_ID)) {
        
        joinVoiceChannel({channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator}); 
        console.log(chalk.magenta("SES - Ses ile bağlantı kuruldu, client "+settings.Client_Voice_ID+" idli ses odasında. ✔"))
    } else {
        console.log(chalk.magenta("SES - Ses ile bağlantı kurulamadı. ✘"))
    }

}
module.exports.configuration = {name: "ready"}