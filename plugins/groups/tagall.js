let Config = require("../../config");
module.exports = {
  cmd: ['tagall'],
  category: 'groups',
  desc: 'mensiona a todos los usuarios de un grupo.',
  register: true,
  group: true,
  admin: true,
  botAdmin: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, participants, User }) {
    let ini = `${BOX.iniM.replace("{}", myLang("group").tag.msg_a)}\n`;
    let mesaj = `➲ *${myLang("group").tag.msg_b}:* ${text || ""}\n\n`;
    let end = `${BOX.endM.replace("{}", Config.BOT_NAME)}`;

    for (let i of participants) {
      mesaj += `${BOX.medM} @${i.id.split("@")[0]}\n`;
      tga = `${ini}${mesaj}${end}`;
    }
    myBot.sendMessage(m.chat, {
      text: tga,
      mentions: participants.map((a) => a.id)
    }, { quoted: m });
    User.counter(m.sender, { usage: 1 });
  }
};