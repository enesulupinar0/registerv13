const {Discord, MessageEmbed, Message} = require('discord.js')
const Database = require('../Models/Yetkili')
const moment = require('moment')
moment.locale('tr')

module.exports = {
    exe: {
        name: 'top-teyit', 
        aliases: ["topteyit", "top-registers"], 
    },
    
    stg: async(client, message, args, config, Roles, Channels, Permissions, Emojis) => {
        
        if(!Permissions.OwnerRoles.some(x => message.member.roles.cache.has(x)) && Permissions.FounderRoles.some(x => message.member.roles.cache.has(x)) &&
        !Permissions.CeoRoles.some(x => message.member.roles.cache.has(x)) && !Permissions.RegisterRoles.some(x => message.member.roles.cache.has(x)) &&
        !message.member.permissions.has('ADMINISTRATOR')) return message.reply(`Kayıt yapabilmek için gerekli yetkilere sahip değilsin.`).then(x => setTimeout(() => x.delete(), 7500))
        
        let TopTeyit = await Database.find().sort({ toplamkayıt: -1 });
        
        let striga = await client.users.cache.get('164843533201702922')
        
        let sıralama = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
        .setDescription(`Top \`20\` Teyit Sıralaması Listelendi.
        Sunucuda yetkili \`${TopTeyit.length}\` kayıt yapmış gerçekleştirilmiş.
        
        ${TopTeyit.length ? TopTeyit.map((x, i) => `\`${i+1}.\` <@${x.user}> toplamda \`${x.toplamkayıt} kayıta sahip.\``).join(`\n`) : "Veri yok."}`).setColor('RANDOM').setFooter(`🥰 Hey sanırım senden hoşlanıyorum 😍`, striga.displayAvatarURL({dynamic:true}))
        
        message.channel.send(`*Veriler yükleniyor...*`).then(x => setTimeout(() => x.delete(), 1500))

        //alın çok cool gözüktünüz başarılarınızın devamını dilerim kodumun aptalları

        setTimeout(() => {
            message.reply({embeds: [sıralama]})
        }, 1550); 

}}