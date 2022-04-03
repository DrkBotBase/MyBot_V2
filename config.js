/*
  Copyright (C) 2022
  DrkBot-MD - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

const fs = require('fs')
const chalk = require('chalk')

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
global.packname = 'DrkBot'
global.author = 'Ian'
global.sessionName = 'minibot'
global.prefa = ['.']
global.sp = '╠❖'
global.mess = {
    success: '✓ Éxito',
    admin: 'Funciones especiales de administrador de grupo!',
    botAdmin: 'El bot debe ser administrador!',
    owner: 'Funciones especiales del propietario del bot',
    group: 'Funciones utilizadas solo para grupos!',
    private: 'Funciones utilizadas solo para chat privado!',
    bot: 'Funciones especiales del usuario del número de bot',
    wait: 'Cargando...',
    endLimit: 'Su límite diario ha expirado, el límite se restablecerá cada 12 horas',
}
global.limitawal = {
    premium: "Infinity",
    free: 100
}
global.thumb = fs.readFileSync('./lib/bot.jpg')

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
