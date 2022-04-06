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

*🪀 Owner* : @${global.owner}
*🖊️ Prefix* : ${global.prefa}

╔══✪〘 *MENU* 〙✪══
${p} ${prefix}alive
${p} ${prefix}menu
${p} ${prefix}update
${p} ${prefix}info
${p} ${prefix}owner
${p} ${prefix}donar
${p} ${prefix}limit
╚══✪〘 *DrkBot* 〙✪══`
}

module.exports = { menu }