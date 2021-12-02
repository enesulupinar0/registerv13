const {Discord, MessageEmbed, Message} = require('discord.js')
const moment = require('moment'); require('moment-duration-format')
const Database = require('../Models/Kayıtlar')
const Database2 = require('../Models/Yetkili')

module.exports = {
    exe: {
        name: 'erkek', 
        aliases: ["e", "man"],
        coolDown: 5000
    },
    
    stg: async(client, message, args, config, Roles, Channels, Permissions, Emojis) => {
        if(!Permissions.OwnerRoles.some(x => message.member.roles.cache.has(x)) && Permissions.FounderRoles.some(x => message.member.roles.cache.has(x)) &&
        !Permissions.CeoRoles.some(x => message.member.roles.cache.has(x)) && !Permissions.RegisterRoles.some(x => message.member.roles.cache.has(x)) &&
        !message.member.permissions.has('ADMINISTRATOR')) return message.reply(`Kayıt yapabilmek için gerekli yetkilere sahip değilsin.`).then(x => setTimeout(() => x.delete(), 7500))

        let member = message.mentions.members.first() || client.users.cache.get(args[0])
        if(!member) return message.reply(`Bir üye belirtin ve tekrardan deneyin.`).then(x => setTimeout(() => x.delete(), 7500))
        const Name = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg[0].toUpperCase() + arg.slice(1).toLowerCase()).join(" ");
        const Age = args.slice(2).filter(arg => !isNaN(arg))[0] ?? undefined;
        if(!Name) return message.reply(`Üyenin ismini belirtin.`).then(x => setTimeout(() => x.delete(), 7500))
        if(Name.length > 29) return message.reply(`Üyenin ismini 30 karakteri geçemez.`).then(x => setTimeout(() => x.delete(), 7500))
        if(!Age || !Number(args[2])) return message.reply(`Üyenin yaşını belirtin.`).then(x => setTimeout(() => x.delete(), 7500))

        if(message.author.id === member.id) return message.reply(`Kendinize kayıt işlemi uygulayamazsınız.`).then(x => setTimeout(() => x.delete(), 7500))
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply(`Belirtilen üyenin pozisyonu sizden üst/aynı olduğu için işlem yapamam.`).then(x => setTimeout(() => x.delete(), 7500))
        if(!member.manageable) return message.reply(`Belirtilen üye üzerinde yetkim bulunmamaktadır.`).then(x => setTimeout(() => x.delete(), 7500))
        
        if(!member.roles.cache.get(Roles.UnregisterRole)) return message.reply(`Üyenin üzerinde **Kayıtsız** rolü bulunmadığı için işlem yapamıyorum.`).then(x => setTimeout(() => x.delete(), 7500))
        if(member.roles.cache.get(Roles.JailRole)) return message.reply(`Üye **Cezalı** rolüne sahip olduğu için işlem yapamıyorum.`).then(x => setTimeout(() => x.delete(), 7500))
        if(member.roles.cache.get(Roles.SuspectRole)) return message.reply(`Üye **Şüpheli** rolüne sahip olduğu için işlem yapamıyorum.`).then(x => setTimeout(() => x.delete(), 7500))
        if(member.roles.cache.get(Roles.RegisterDisabledRoles)) return message.reply(`Üye **Kayıtı Engelleyen** bir role sahip olduğu için işlem yapamıyorum.`).then(x => setTimeout(() => x.delete(), 7500))
       
        if(config.Taglı_Alım && (!member.user.username.includes(config.Tag) && !member.premiumSince && !member.roles.cache.has(Roles.VipRole))) return message.channel.send({embeds: [new MessageEmbed().setDescription(`Sunucumuz taglı alımdadır. ${member} üyesi tagımızı alarak veya \`Boost\` basarak sunucumuza kayıt olabilir.`).setAuthor(message.guild.name, message.guild.iconURL({dynamic:true})).setColor('RANDOM')]}).then(x => setTimeout(() => x.delete(), 10000))
        let userName = `${member.user.username.includes(config.Tag) ? config.Tag : config.SecondaryTag} ${Name} | ${Age}`

        member.setNickname(`${userName}`)
        await member.roles.remove(Roles.UnregisterRoles).catch(err => {{}})
        await member.roles.add(Roles.ManRoles).catch(err => {{}})

        Database.find({sunucu: message.guild.id, user: member.id}, async(err, res) => {
            if(res.length < 1) {

                message.channel.send({embeds: [
                    new MessageEmbed()
                    .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
                    .setDescription(`${member} kişisi **Erkek** olarak kayıt edildi, ismi \`${userName}\` olarak değiştirildi.`)
                    .setColor('RANDOM')
                ]})

                new Database({
                    sunucu: message.guild.id,
                    user: member.id,
                    yetkili: message.author.id,
                    isimleri: userName,
                    isim: Name,
                    yaş: Age,
                    rolleri: `<@&${Roles.ManRole}>`, 
                    sonİsimYaş: userName,
                    tarih: Date.now()
                }).save().catch(err => console.log(`Erkek üye datası kayıt edilirken sorun yaşandı!\nSorun:`+ err))
                return;
            }

            let mapper = res.reverse().reverse() 

                message.channel.send({embeds: [
                    new MessageEmbed()
                    .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
                    .setDescription(`${member} kişisi **Erkek** olarak kayıt edildi, ismi \`${userName}\` olarak değiştirildi.
                    
                    Kişinin **${res.length}** farklı kayıt işlemi bulundu. ${Emojis.No}
                    
                    ${mapper.map(x => `\`• ${x.isimleri}\` (${x.rolleri})`).slice(0, 6).join("\n ")}
                    
                    \`!isimler @Striga/ID\` komutuyla kişinin kayıtlarını görebilirsiniz.`)
                    .setColor('RANDOM')
                ]})

                new Database({
                    sunucu: message.guild.id,
                    user: member.id,
                    yetkili: message.author.id,
                    isimleri: userName,
                    isim: Name,
                    yaş: Age,
                    rolleri: `<@&${Roles.ManRole}>`, 
                    tarih: Date.now()
                }).save().catch(err => console.log(`Erkek üye datası kayıt edilirken sorun yaşandı!\nSorun:`+ err))
                await Database.findOneAndUpdate({sunucu: message.guild.id, user: member.id}, { $set: { sonİsimYaş: userName } })
            })


            let striga = await client.users.cache.get('164843533201702922')

            Database2.findOne({sunucu: message.guild.id, user: message.author.id}, async(err, res) => {
                if(!res) {
                    new Database2({sunucu: message.guild.id, user: message.author.id, toplamkayıt: 1, erkekkayıt: 1}).save().catch({})
                    client.channels.cache.get(Channels.StaffLog).send({embeds: [new MessageEmbed()
                        .setAuthor(message.author.username, message.member.displayAvatarURL({dynamic:true}))
                        .setDescription(`${member} ilk kullanıcısını kayıt etti!`)
                        .setColor('RANDOM')
                        .setFooter(`Striga sana aşık !`,striga.displayAvatarURL({dynamic:true}))
                        .setTimestamp()]})
                } else {
                    res.sunucu = message.guild.id
                    res.user = message.author.id
                    res.toplamkayıt++
                    res.erkekkayıt++
                    res.save().catch()
                    client.channels.cache.get(Channels.StaffLog).send({embeds: [new MessageEmbed()
                        .setAuthor(message.author.username, message.member.displayAvatarURL({dynamic:true}))
                        .setDescription(`${member} 1 kullanıcıyı daha kayıt etti!
                        Kullanıcının toplamda ${res.toplamkayıt} teyiti var.
                        ${res.erkekkayıt} kez erkek, ${res.kadınkayıt} kez kadın kayıt etmiş. `)
                        .setColor('RANDOM')
                        .setFooter(`Striga sana aşık !`,striga.displayAvatarURL({dynamic:true}))
                        .setTimestamp()]})
                }
            })

            let registerLog = new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
            .setDescription(`Bir üye sunucumuza kayıt edildi ! ${Emojis.Yes}`)
            .addField(`Yetkili`, `${message.author}`, true)
            .addField(`Üye`, `${member}`, true)
            .addField(`- Güncel İsim`, `\`${userName}\``, false)
            .addField(`- Verilen Roller`, `${Roles.ManRoles.map(x => `<@&${x}>`)}`, false)
            .addField(`- Alınan Roller`, `${Roles.UnregisterRoles.map(x => `<@&${x}>`)}`, false)
            .addField(`- Cinsiyet`, `Erkek`, false)
            .setColor('RANDOM')
            .setFooter('Striga bence çok tatlı. 👉👈',striga.avatarURL({dynamic: true}))
            .setTimestamp()

            client.channels.cache.get(Channels.RegisterLog).send({embeds: [registerLog]})
    }
}
