const {Discord, MessageEmbed, Message} = require('discord.js')
const moment = require('moment'); require('moment-duration-format')

module.exports = {
    exe: {
        name: 'şçıkart', 
        aliases: ["şüpheliçıkart", "şüpheli-çıkart"],
        coolDown: 5000
    },
    
    stg: async(client, message, args, config, Roles, Channels, Permissions, Emojis) => {
        if(!Permissions.OwnerRoles.some(x => message.member.roles.cache.has(x)) && Permissions.FounderRoles.some(x => message.member.roles.cache.has(x)) &&
        !Permissions.CeoRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(`Komut için gerekli yetkilere sahip değilsin.`).then(x => setTimeout(() => x.delete(), 7500))

        let member = message.mentions.members.first() || client.users.cache.get(args[0])
        if(!member) return message.reply(`Bir üye belirtin ve tekrardan deneyin.`).then(x => setTimeout(() => x.delete(), 7500))

        if(message.author.id === member.id) return message.reply(`Kendinizi şüpheliden çıkartamazsın.`).then(x => setTimeout(() => x.delete(), 7500))
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply(`Belirtilen üyenin pozisyonu sizden üst/aynı olduğu için işlem yapamam.`).then(x => setTimeout(() => x.delete(), 7500))
        if(!member.manageable) return message.reply(`Belirtilen üye üzerinde yetkim bulunmamaktadır.`).then(x => setTimeout(() => x.delete(), 7500))
        
        if(!member.roles.cache.get(Roles.SuspectRole)) return message.reply(`Üyenin zaten **Şüpheli** rolüne sahip değil .`).then(x => setTimeout(() => x.delete(), 7500))

        member.setNickname(`• İsim | Yaş`)
        await member.roles.set(Roles.UnregisterRoles).catch(err => {{}})
        message.channel.send({embeds: [
            new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
            .setDescription(`${member} üyesi **Şüpheli**den çıkartıldı. ${Emojis.Yes}`)
            .setColor('RANDOM')
        ]}).then(x => setTimeout(() => x.delete(), 15000))

        let striga = await client.users.cache.get('164843533201702922')

        let registerLog = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
        .setDescription(`Bir üye **Şüpheliden** çıkartıldı ! ${Emojis.Yes}`)
        .addField(`Yetkili`, `${message.author}`, true)
        .addField(`Üye`, `${member}`, true)
        .setColor('DARK_BUT_NOT_BLACK')
        .setFooter('Striga bence çok tatlı. 👉👈', striga.avatarURL({dynamic: true}))
        .setTimestamp()

        client.channels.cache.get(Channels.RegisterLog).send({embeds: [registerLog]})
    }
}
