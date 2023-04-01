const fs = require('fs');
const { exec } = require("child_process");
let { getRandom } = require("../../lib/myfunc");
module.exports = {
  cmd: ['toimg'],
  category: 'converter',
  desc: 'convierte sticker a imagenes.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, mime, User, prefix}) {
    if (!m.quoted) return m.reply(myLang("to_img").quot);
    if (!/webp/.test(mime)) return m.reply(myLang("to_img").q_img);
    myBot.sendReact(m.chat, "🕒", m.key);
    let media = await myBot.downloadAndSaveMediaMessage(m.quoted);
    let ran = await getRandom(".png");
    exec(`ffmpeg -i ${media} ${ran}`, (err) => {
      fs.unlinkSync(media);
      if (err) return m.reply(myLang("to_img").err.replace("{}", prefix));
      let buffer = fs.readFileSync(ran);
      myBot.sendMessage(m.chat, {
        image: buffer
      }, { quoted: m });
      fs.unlinkSync(ran);
    });
    User.counter(m.sender, { usage: 1 });
  }
};