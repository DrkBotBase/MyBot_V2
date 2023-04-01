const fs = require("fs");
let Config = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['emojimix'],
  category: 'converter',
  desc: 'mezcla de emojis.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, prefix, command, User}) {
    if (!text) return m.reply(myLang("emojimix").msg.replace("{}", prefix + command));
    myBot.sendReact(m.chat, "🕒", m.key);
    let [emoji1, emoji2] = text.split`+`;
    let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);
    for (let res of anu.results) {
      let encmedia = await myBot.sendImageAsSticker(m.chat, res.url, m, {
        packname: "Sticker by:",
        author: Config.BOT_NAME,
        categories: res.tags,
      });
      await fs.unlinkSync(encmedia);
    }
    User.counter(m.sender, { usage: 1 });
  }
};