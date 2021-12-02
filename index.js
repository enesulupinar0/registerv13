const {Client, Intents, Collection} = require('discord.js')
const moment = require('moment');
require('moment-duration-format'); 
require('moment-timezone');
const mongoose = require('mongoose')
const chalk = require('chalk')
const fs = require('fs')
const settings = require('./Client_Settings.json')

const client = global.client = new Client({ fetchAllMembers: true, intents: [
  Intents.FLAGS.GUILDS, 
  Intents.FLAGS.GUILD_MESSAGES, 
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
  Intents.FLAGS.GUILD_MESSAGE_TYPING, 
  Intents.FLAGS.DIRECT_MESSAGES, 
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Intents.FLAGS.GUILD_INTEGRATIONS,
  Intents.FLAGS.GUILD_WEBHOOKS
] 
});

client.commands = new Collection();
client.aliases = new Collection();

fs.readdir('./src/Commands', (err, files) => {
  if(err) return console.log(err)
  files.forEach(js => { let command = require(`./src/Commands/${js}`); 
  client.commands.set(command.exe.name, command); console.log(chalk.blue("COMMAND - "+command.exe.name+" Komutu yüklendi. ✔"))
  if(command.exe.aliases) command.exe.aliases.forEach(ex => client.aliases.set(ex, command.exe.name))})})

fs.readdir("./src/Events", (err, files) => {
  if(err) return console.log(err)
  files.filter(x => x.endsWith(".js")).forEach(x => { let Loader = require(`./src/Events/${x}`);
  if(!Loader.configuration) return;
  client.on(Loader.configuration.name, Loader)
  console.log(chalk.red("EVENT - "+x+" Etkinliği yüklendi. ✔"))})});

mongoose.connect(settings.Mongo_URL, {useUnifiedTopology: true, useNewUrlParser: true});  
mongoose.connection.on("connected", () => {console.log(chalk.green("DATABASE - client ile DB bağlantısı kuruldu. ✔"))});
mongoose.connection.on("error", () => {console.log(chalk.red("DATABASE - client ile DB bağlantısı kurulamadı bir sorun yaşandı. ✘"))});
client.login(settings.Client_Token).then(console.log(chalk.green("TOKEN - client ile bağlantı kuruldu. ✔"))).catch(err => console.log(chalk.red("TOKEN - client ile bağlantı kurulamadı, token geçersiz. ✘")))


let aylartoplam = {"01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık"};
global.aylar = aylartoplam;
const tarihsel = global.tarihsel = function(tarih) {
let tarihci = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + global.aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY HH:mm")   
return tarihci};
const sayilariCevir = global.sayilariCevir = function(x) {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")};
const tarihhesapla = global.tarihHesapla = (date) => {
const startedAt = Date.parse(date);
var msecs = Math.abs(new Date() - startedAt);
      
const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365)); msecs -= years * 1000 * 60 * 60 * 24 * 365; const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30)); msecs -= months * 1000 * 60 * 60 * 24 * 30; const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7)); msecs -= weeks * 1000 * 60 * 60 * 24 * 7; const days = Math.floor(msecs / (1000 * 60 * 60 * 24)); msecs -= days * 1000 * 60 * 60 * 24; const hours = Math.floor(msecs / (1000 * 60 * 60)); msecs -= hours * 1000 * 60 * 60; const mins = Math.floor((msecs / (1000 * 60))); msecs -= mins * 1000 * 60; const secs = Math.floor(msecs / 1000); msecs -= secs * 1000;
      
var string = "";
if (years > 0) string += `${years} yıl`
else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
else if (secs > 0) string += `${secs} saniye`
else string += `saniyeler`;
      
string = string.trim(); return `${string} önce`;};