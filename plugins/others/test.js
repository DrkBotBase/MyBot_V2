const fs = require("fs");
let { log, pint } = require("../../lib/colores");
//let Config = require("../../config");
let { jsonformat } = require("../../lib/myfunc");
module.exports = {
  cmd: ['test'],
  ignored: true,
  owner: true,
  //register: true,
  //group: true,
  //admin: true,
  //botAdmin: true,
  check: { pts: null },
  async handler(m, {myBot, args, text, quoted}) {
    //log()
let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? myBot.user.jid : m.sender
myBot.sendFile(m.chat, global.api('https://some-random-api.com', '/canvas/simpcard', {
avatar: await myBot.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
}), 'error.png', '*¡¡𝚃𝚄 𝚁𝙴𝙻𝙸𝙶𝙸𝙾𝙽 𝙴𝚂 𝚂𝙴𝚁 𝚄𝙽 𝚂𝙸𝙼𝙿!!*', m)
  }
};