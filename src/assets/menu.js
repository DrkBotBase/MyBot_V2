const moment = require('moment-timezone');

const { LANG } = require('../../config');
var hi_lang = ''
var list_a = ''
var list_b = ''
var list_c = ''
var sal_a = ''
var sal_b = ''
var sal_c = ''
var sal_d = ''
if(LANG == 'ES') {
  hi_lang = 'Hola'
  list_a = 'MENU'
  list_b = 'GRUPOS'
  list_c = 'UTILIDADES'
  sal_a = 'Es muy temprano, duerme un poco mas.'
  sal_b = 'Buenos Dias'
  sal_c = 'Buenas Tardes'
  sal_d = 'Buenas Noches'
}
else if(LANG == 'EN') {
  hi_lang = 'Hi'
  list_a = 'MENU'
  list_b = 'GROUPS'
  list_c = 'UTILITIES'
  sal_a = 'you do not sleep?. 😒'
  sal_b = 'good morning'
  sal_c = 'good afternoon'
  sal_d = 'good night'
}

const menu = (prefix, pushname, botName) => {
	var time = moment().tz(global.timeZone).format('HH:mm:ss')
	if(time < "05:00:00"){var saludo = sal_a}
	else if(time < "12:00:00"){var saludo = sal_b}
	else if(time < "19:00:00"){var saludo = sal_c}
	else if(time < "23:59:00"){var saludo = sal_d}

	let p = global.sp
	
	return `══✪〘 *${botName}* 〙✪══

${hi_lang} *${pushname}*, ${saludo}

*🪀 Owner* : ${global.owner}
*🖊️ Prefix* :〘 *${prefix}* 〙

╔══✪〘 *${list_a}* 〙✪══
${p} ${prefix}alive
${p} ${prefix}menu
${p} ${prefix}bot
${p} ${prefix}donar
╠══✪〘 *${list_b}* 〙✪══
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
╠══✪〘 *${list_c}* 〙✪══
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