const { LANG } = require('../config');
const p = global.BOX

if(LANG == 'ES') {
  ini = 'INFORMACIÓN DEL GRUPO'
  link = 'LINK DEL GRUPO'
  name = 'NOMBRE DEL GRUPO'
  des = 'DESCRIPCIÓN DEL GRUPO'
  users = 'NÚMEROS DE USUARIOS'
  creator = 'CREADOR DEL GRUPO'
  admins = 'ADMINS DEL GRUPO'
}
// medM: '┊'
// med: '┊⇀'
const infoGroup = (a,b,c,d,e,f) => {
  return `*${ini}*
  
${p.ini.replace('{}',link)}
https://chat.whatsapp.com/${a}
${p.end}

${p.ini.replace('{}',name)}
${p.medM} ${b}
${p.end}

${p.ini.replace('{}',des)}
${c || ''}
${p.end}

${p.ini.replace('{}',users)}
${p.med} ${d} *Usuarios*
${p.end}

${p.ini.replace('{}',creator)}
${p.med} @${e}
${p.end}

${p.ini.replace('{}',admins)}
${f}
${p.endM.replace('{}',global.author)}`.trim()
}

module.exports = { infoGroup }