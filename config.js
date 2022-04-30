/*
  Copyright (C) 2022
  DrkBot-MD - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

const fs = require('fs')
const { pint } = require('./lib/colores');
// Website Api
global.APIs = {
	zenz: 'https://zenzapi.xyz',
}

// Apikey Website Api
global.APIKeys = {
	'https://zenzapi.xyz': 'Your Key',
}

// Read msg & Push Message To Console
global.read = 'on'
global.pushMsgConsole = ''

// Other
global.owner = ['573508770421']
global.premium = []
global.packname = 'DrkBot'
global.author = 'Ian'
global.sessionName = 'ini'
global.prefa = ['/']
global.sp = '╠❖'
global.mess = {
    success: '✓ Éxito',
    admin: 'Funciones solo para administradores del grupo!',
    botAdmin: 'El bot debe ser administrador!',
    owner: 'Funciones especiales del propietario del bot',
    group: 'Funciones solo para grupos!',
    private: 'Funciones solo para chat privado!',
    bot: 'Funciones solo para el usuario del número del bot',
    wait: 'Un momento...',
    endLimit: 'Su límite diario ha expirado, el límite se restablecerá cada 12 horas'
}
global.updater = {
  BRANCH: 'master',
  UPDATE: '*¡Tu bot está completamente actualizado!*',
  NEW_UPDATE: '*¡Hay una nueva actualización disponible para el bot!*\n\nCambios:\n```'
}
global.limitawal = {
    premium: "Infinity",
    free: 100
}
global.thumb = fs.readFileSync('./lib/bot.jpg')
global.nothing = fs.readFileSync('./lib/nsp.webp')

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	log(pint(`Update ${__filename}`, 'orange.'))
	delete require.cache[file]
	require(file)
})
