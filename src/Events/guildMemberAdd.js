const { Discord, MessageEmbed, Client, Collection } = require('discord.js')
const client = global.client
const js = require('../../Client_Settings.json')
const sj = require('../Settings/Server_Channels.json')
const bencekomik = require('../Settings/Server_Roles.json')
const ahahha = require('../Settings/Server_Emojis.json')
const moment = require('moment'); 

module.exports = async (member) => {
let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
if(guvenilirlik) {          
await member.roles.set(bencekomik.SuspectRole) 
let suspect = new MessageEmbed()
.setAuthor(member.guild.name, member.guild.avatarURL({dynamic:true}))
.setDescription(`${member} üyesi **şüpheliye** atıldı. ${ahahha.Yes}`)
.setColor('DARK_RED')
.setTimestamp()
client.channels.cache.get(sj.SuspectLog).send({embeds: [suspect]})
} else {     
await ServerHg(member)
await member.setNickname(`• İsim | Yaş`)
await member.roles.add(bencekomik.UnregisterRoles)    

if(member.user.username.includes(js.Tag)) {
await member.setNickname(`${js.Tag} İsim | Yaş`)   
await member.roles.add(bencekomik.TagRole)
}

}}
module.exports.configuration = {name: "guildMemberAdd"}

function ServerHg(member) 
{
member.guild.channels.cache.get(sj.WelcomeChannel).send(`
Sunucumuza hoş geldin ${member} !

Hesabın **${global.tarihsel(member.user.createdAt)}** tarihinde (\`${global.tarihHesapla(member.user.createdAt)}\`) oluşturulmuş.
Sunucumuzun kurallarına <#${sj.RulesChannel}> göz atmanız tavsiye ederiz ceza işlemlerini kurallara göre yapıyoruz.
Sunucumuza Kayıt olmak için solda ki odalara girip ses teyit vererek kayıt olabilirsin.
   
:tada: Seninle birlikte sunucumuz **${member.guild.memberCount}** kişi oldu ! Tagımızı (**${js.Tag}**) alarak ailemizin bir parçası olabilirsin.`)
}
