let Config = require("../../config");
if (Config.LANG == "ES") {
  ini = "INFORMACIÓN DEL GRUPO";
  link = "LINK DEL GRUPO";
  name = "NOMBRE DEL GRUPO";
  des = "DESCRIPCIÓN DEL GRUPO";
  users = "NÚMEROS DE USUARIOS";
  creator = "CREADOR DEL GRUPO";
  admins = "ADMINS DEL GRUPO";
}
module.exports = {
  cmd: ['infogr'],
  category: 'groups',
  desc: 'informacion del grupo actual.',
  register: true,
  group: true,
  admin: true,
  botAdmin: true,
  check: { pts: 0 },
  async handler(m, {myBot, participants, groupMetadata}) {
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      pp = await myBot.profilePictureUrl(m.chat, "image");
    } catch {
      pp = global.thumb;
    }
    let groupAdmins = participants.filter((i) => i.admin);
    anu = infoGroup(
      await myBot.groupInviteCode(m.chat), //groupCode
      groupMetadata.subject, // groupName
      groupMetadata.desc?.toString(), // groupDesc
      participants.length, // groupParticipants
      groupMetadata.owner.split("@")[0], // groupCreator
      groupAdmins
        .map((v, i) => `${global.BOX.medM} @${v.id.split("@")[0]}`)
        .join("\n") // groupAdmins
    );
    await myBot.sendImage(m.chat, anu, m, {
      mentions: [...groupAdmins.map((i) => i.id)]
    })
  }
};

function infoGroup (a, b, c, d, e, f) {
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
${BOX.endM.replace("{}", Config.BOT_NAME)}`.trim();
};