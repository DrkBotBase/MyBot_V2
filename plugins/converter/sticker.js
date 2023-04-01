const fs = require("fs");
let Config = require("../../config");
module.exports = {
  cmd: ['sticker'],
  category: 'converter',
  desc: 'convierte imagenes y videos cortos a sticker.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, mime, prefix, command, User}) {
    if (!m.quoted) return m.reply(myLang("sticker").quot.replace("{}", prefix + command));
    if (text.length > 0) { name = text;}
    else { name = "Sticker by:"; }
    myBot.sendReact(m.chat, "🕒", m.key);
    if (/image|webp/.test(mime)) {
      let media = await m.quoted.download();
      let encmedia = await myBot.sendImageAsSticker(m.chat, media, m, {
        packname: name,
        author: Config.BOT_NAME,
      });
      await fs.unlinkSync(encmedia);
    } else if (/video/.test(mime)) {
      if ((m.quoted.msg || m.quoted).seconds > 11)
      return m.reply(myLang("sticker").time_wait);
      let media = await m.quoted.download();
      let encmedia = await myBot.sendVideoAsSticker(m.chat, media, m, {
        packname: name,
        author: Config.BOT_NAME,
      });
      await fs.unlinkSync(encmedia);
    } else {
      m.reply(myLang("sticker").end.replace("{}", prefix + command));
    }
    User.counter(m.sender, { usage: 1 });
  }
};