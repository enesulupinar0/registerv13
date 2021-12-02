const { Discord, MessageEmbed, Client, Collection } = require('discord.js')
const settings = require('../../Client_Settings.json')

const Roles = require('../Settings/Server_Roles.json')
const Channels = require('../Settings/Server_Channels.json')
const Permissions = require('../Settings/Server_Permissions.json') 
const Emojis = require('../Settings/Server_Emojis.json')

module.exports = async(message) => {

if (!message.guild || message.author.bot || message.channel.type === 'dm') return;
let prefix = settings.Client_Prefixs.filter(p => message.content.startsWith(p))[0]; 
if (!prefix) return;
let config = settings;
let args = message.content.split(' ').slice(1);
let command = message.content.split(' ')[0].slice(prefix.length); 
let stg = client.commands.get(command) || client.commands.get(client.aliases.get(command));
if (stg){
stg.stg(client, message, args, config, Roles, Channels, Permissions, Emojis);
}

}
module.exports.configuration = {name: "messageCreate"}