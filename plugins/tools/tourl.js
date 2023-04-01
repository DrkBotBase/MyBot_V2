const fs = require("fs");
const util = require("util");
let { TelegraPh } = require("../../lib/uploader");
module.exports = {
  cmd: ['tourl'],
  category: 'tools',
  desc: 'sube imagenes, audios y videos a Telegraph y obten su url.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, mime, User}) {
    myBot.sendReact(m.chat, "🕒", m.key);
    if(m.quoted.text) {
      return m.reply('Responde solo image/audio/video')
    } else if (/image|audio/.test(mime)) {
      let media = await myBot.downloadAndSaveMediaMessage(m.quoted);
      let anu = await TelegraPh(media);
      m.reply(util.format(anu));
    } else if (/video/.test(mime)) {
      if ((m.quoted.msg || m.quoted).seconds > 11)
      return m.reply(myLang("sticker").time_wait);
      let media = await myBot.downloadAndSaveMediaMessage(m.quoted);
      let anu = await TelegraPh(media);
      m.reply(util.format(anu));
    } else {
      m.reply(myLang("removebg").err);
    }
    await fs.unlinkSync(media);
    User.counter(m.sender, { usage: 1 });
  }
};