const fs = require("fs");
module.exports = {
  cmd: ['gay'],
  category: 'games',
  desc: 'nivel de gay de un usuario.',
  register: true,
  group: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, User}) {
    let ment = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? myBot.user.jid : m.sender
    let userName = myBot.getName(ment)
    await myBot.sendMessage(m.chat, {
      video: fs.readFileSync("./src/media/gay.mp4"),
      caption: myLang("gay")
        .msg.replace("{}", userName)
        .replace("{}", Math.floor(100 * Math.random())),
      gifPlayback: true,
      mentions: ment,
    }, { quoted: m });
    User.counter(m.sender, { usage: 1 });
  }
};