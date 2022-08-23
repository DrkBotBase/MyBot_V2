/*
  Copyright (C) 2022
  DrkBot-MD - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

const fs = require('fs')
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
const { log, pint } = require('./lib/colores');

// Website Api
global.APIs = {
	zenz: 'https://zenzapi.xyz',
}

// Apikey Website Api
global.APIKeys = {
	'https://zenzapi.xyz': 'Your Key',
}

// Other
global.owner = ['573508770421']
global.premium = []
global.author = 'DrkBot'
global.sessionName = 'sess304'
global.sp = '╠❖'
global.typeMenu = 'image'

global.limitawal = {
    premium: "Infinity",
    free: 100
}

global.thumb = fs.readFileSync('./lib/bot.jpg')
global.nothing = fs.readFileSync('./lib/nsp.webp')

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// env ## not modify ##
module.exports = {
  BOT_NAME: process.env.BOT_NAME === undefined ? '🤖 Bot-MD' : process.env.BOT_NAME,
  BRANCH: 'master',
  HANDLER: process.env.HANDLER === undefined ? '^[/]' : process.env.HANDLER,
  LANG: process.env.LANGUAGE === undefined ? 'ES' : process.env.LANGUAGE.toUpperCase(),
  LOG: process.env.LOG_ERR === undefined ? 'true' : process.env.LOG_ERR,
  MSG_CONSOLE: process.env.MSG_CONSOLE === undefined ? '' : process.env.MSG_CONSOLE,
  ONLINE: process.env.ONLINE === undefined ? 'online' : process.env.ONLINE,
  READ: process.env.SEND_READ === undefined ? '' : process.env.SEND_READ,
  SESSION: process.env.SESSION === undefined ? global.sessionName : process.env.SESSION,
  VERSION: process.env.VERSION === undefined ? 'V1-MD' : process.env.VERSION,
  WORKTYPE: process.env.WORKTYPE === undefined ? 'public' : process.env.WORKTYPE
};
// end env

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	log(pint(`Update ${__filename}`, 'orange.'))
	delete require.cache[file]
	require(file)
})
