const fs = require('fs');
let Config = require("../../config");
let { webp2mp4File } = require("../../lib/uploader");
module.exports = {
  cmd: ['tovideo'],
  category: 'converter',
  desc: 'convierte sticker en movimiento a videos.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, mime, User}) {
    if (!m.quoted) return m.reply(myLang("to_mp4").quot);
    if (!/webp/.test(mime)) return m.reply(myLang("to_mp4").q_video);
    myBot.sendReact(m.chat, "🕒", m.key);
    let media = await myBot.downloadAndSaveMediaMessage(m.quoted);
    let webpToMp4 = await webp2mp4File(media);
    await myBot.sendMessage(m.chat, {
      video: {
        url: webpToMp4.result,
        caption: myLang("global").by.replace("{}", Config.BOT_NAME)
      }
    }, { quoted: m });
    await fs.unlinkSync(media);
    User.counter(m.sender, { usage: 1 });
  }
};