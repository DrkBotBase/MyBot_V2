const { LANG } = require("../config");

if (LANG == "ES") {
  ini = "INFORMACIÓN DEL GRUPO";
  link = "LINK DEL GRUPO";
  name = "NOMBRE DEL GRUPO";
  des = "DESCRIPCIÓN DEL GRUPO";
  users = "NÚMEROS DE USUARIOS";
  creator = "CREADOR DEL GRUPO";
  admins = "ADMINS DEL GRUPO";
}
// medM: '┊'
// med: '┊⇀'
const infoGroup = (a, b, c, d, e, f) => {
  return `*${ini}*
  
${BOX.iniM.replace("{}", link)}
https://chat.whatsapp.com/${a}
${BOX.end}

${BOX.iniM.replace("{}", name)}
${BOX.medM} ${b}
${BOX.end}

${BOX.iniM.replace("{}", des)}
${c || `${BOX.medM} El grupo no tiene descripción.`}
${BOX.end}

${BOX.iniM.replace("{}", users)}
${BOX.med} ${d} *Usuarios*
${BOX.end}

${BOX.iniM.replace("{}", creator)}
${BOX.med} @${e}
${BOX.end}

${BOX.iniM.replace("{}", admins)}
${f}
${BOX.endM.replace("{}", global.botName)}`.trim();
};

module.exports = { infoGroup };
