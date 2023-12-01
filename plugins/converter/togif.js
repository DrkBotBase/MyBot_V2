const fs = require('fs');
let Config = require("../../config");
let { webp2mp4File } = require("../../lib/uploader");
module.exports = {
  cmd: ['togif'],
  owner: true,
  ignored: true,
  category: 'converter',
  desc: 'convierte videos cortos a gif.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, mime, User}) {
    if (!m.quoted) return m.reply(myLang("to_gif").quot);
    if (!/webp/.test(mime) && !/video/.test(mime)) return m.reply(myLang("to_gif").q_gif);
    myBot.sendReact(m.chat, "🕒", m.key);
    let media = await myBot.downloadAndSaveMediaMessage(m.quoted);
    let webpToMp4 = await webp2mp4File(media);
    await myBot.sendMessage(m.chat, {
      video: {
        url: webpToMp4.result,
        caption: myLang("global").by.replace("{}", Config.BOT_NAME)
      }, gifPlayback: true,
    }, { quoted: m });
    await fs.unlinkSync(media);
    User.counter(m.sender, { usage: 1 });
  }
};