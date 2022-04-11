const moment = require('moment-timezone');

const menu = (prefix, pushname) => {
 
	var time = moment().tz('America/Bogota').format('HH:mm:ss')
	if(time < "05:00:00"){var saludo = 'Es muy temprano, duerme un poco mas.'}
	else if(time < "12:00:00"){var saludo = 'Buenos Dias'}
	else if(time < "19:00:00"){var saludo = 'Buenas Tardes'}
	else if(time < "23:59:00"){var saludo = 'Buenas Noches'}

	let p = global.sp
	
	return `══✪〘 *DrkBot* 〙✪══

Hola ${pushname} ${saludo}

*🪀 Owner* : ${global.owner}
*🖊️ Prefix* : ${global.prefa}

╔══✪〘 *MENU* 〙✪══
${p} ${prefix}alive
${p} ${prefix}menu
${p} ${prefix}donar
╠══✪〘 *GRUPOS* 〙✪══
${p} ${prefix}promote
${p} ${prefix}demote
${p} ${prefix}add
${p} ${prefix}kick
${p} ${prefix}mute
${p} ${prefix}unmute
${p} ${prefix}linkgroup
${p} ${prefix}pareja
${p} ${prefix}tagall
${p} ${prefix}hidetag
╠══✪〘 *UTILIDADES* 〙✪══
${p} ${prefix}yt
${p} ${prefix}song
${p} ${prefix}video
${p} ${prefix}sticker
${p} ${prefix}emojimix
${p} ${prefix}img
${p} ${prefix}wallpaper
${p} ${prefix}ebinary
${p} ${prefix}dbinary
╚══✪〘 *DrkBot* 〙✪══`
}

module.exports = { menu }