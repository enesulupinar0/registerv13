const {Discord, MessageEmbed, Message} = require('discord.js')
const moment = require('moment'); require('moment-duration-format')
const Database = require('../Models/Kayıtlar')
moment.locale('tr')

module.exports = {
    exe: {
        name: 'isimler', 
        aliases: ["isimleri", "geçmiş"],
        coolDown: 5000
    },
    
    stg: async(client, message, args, config, Roles, Channels, Permissions, Emojis) => {
        if(!Permissions.OwnerRoles.some(x => message.member.roles.cache.has(x)) && Permissions.FounderRoles.some(x => message.member.roles.cache.has(x)) &&
        !Permissions.CeoRoles.some(x => message.member.roles.cache.has(x)) && !Permissions.RegisterRoles.some(x => message.member.roles.cache.has(x)) &&
        !message.member.permissions.has('ADMINISTRATOR')) return message.reply(`Komut için gerekli yetkilere sahipd eğilsin.`).then(x => setTimeout(() => x.delete(), 7500))

        let member = message.mentions.members.first() || client.users.cache.get(args[0])
        if(!member) return message.reply(`Bir üye belirtin ve tekrardan deneyin.`).then(x => setTimeout(() => x.delete(), 7500))

        Database.find({sunucu: message.guild.id, user: member.id}, async(err, res) => {
            if(res.length < 1) return message.channel.send(`Belirtilen üyenin veritabanında kayıt işlemi bulunamadı.`).then(x => setTimeout(() => x.delete(), 7500))
            let mapper = res.reverse().reverse()
            let data = await Database.findOne({sunucu: message.guild.id, user: member.id})
            message.channel.send({embeds: [
                new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
                .setDescription(`${member} üyesinin toplamda ${res.length} tane farklı kayıtı bulundu! ${Emojis.Yes}
                
                ✏️ Güncel İsmi: \`${data.sonİsimYaş}\`

                ${mapper.map(x => `\`• ${x.isimleri}\` (${x.rolleri})`).join('\n')}
                `)
                .setColor('RANDOM')
            ]})
        })

    }
}
