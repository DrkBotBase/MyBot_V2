const moment = require('moment-timezone');

const menu = (prefix, pushname, botName) => {
 
	var time = moment().tz(global.timeZone).format('HH:mm:ss')
	if(time < "05:00:00"){var saludo = 'Es muy temprano, duerme un poco mas.'}
	else if(time < "12:00:00"){var saludo = 'Buenos Dias'}
	else if(time < "19:00:00"){var saludo = 'Buenas Tardes'}
	else if(time < "23:59:00"){var saludo = 'Buenas Noches'}

	let p = global.sp
	
	return `══✪〘 *${botName}* 〙✪══

Hola ${pushname} ${saludo}

*🪀 Owner* : ${global.owner}
*🖊️ Prefix* :〘 *${prefix}* 〙

╔══✪〘 *MENU* 〙✪══
${p} ${prefix}alive
${p} ${prefix}menu
${p} ${prefix}bot
${p} ${prefix}donar
╠══✪〘 *GRUPOS* 〙✪══
${p} ${prefix}promote
${p} ${prefix}demote
${p} ${prefix}add
${p} ${prefix}kick
${p} ${prefix}mute
${p} ${prefix}unmute
${p} ${prefix}linkgroup
${p} ${prefix}love
${p} ${prefix}tagall
${p} ${prefix}hdt
╠══✪〘 *UTILIDADES* 〙✪══
${p} ${prefix}play
${p} ${prefix}yts
${p} ${prefix}song
${p} ${prefix}video
${p} ${prefix}getmusic
${p} ${prefix}getvideo
${p} ${prefix}fbdl
${p} ${prefix}ttdl
${p} ${prefix}sticker
${p} ${prefix}toaudio
${p} ${prefix}tomp4
${p} ${prefix}toimg
${p} ${prefix}togif
${p} ${prefix}tourl
${p} ${prefix}emojimix
${p} ${prefix}ttp
${p} ${prefix}attp
${p} ${prefix}trt
${p} ${prefix}waifu
${p} ${prefix}neko
${p} ${prefix}img
${p} ${prefix}wallpaper
${p} ${prefix}2wallpaper
${p} ${prefix}ebinary
${p} ${prefix}dbinary
${p} ${prefix}calc
${p} ${prefix}bin
${p} ${prefix}cambio
${p} ${prefix}price
${p} ${prefix}shazam
${p} ${prefix}romevebg
╚══✪〘 *DrkBot* 〙✪══`
}

module.exports = { menu }