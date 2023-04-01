let Config = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['ssweb'],
  category: 'tools',
  desc: 'toma capturas de pantalla de paginas web.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, User}) {
    if (!text) return m.reply("Necesito la url.");
    let regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (!regex.test(text)) return m.reply("Necesito una url valida.");
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      let img = await fetchJson(`https://api.apiflash.com/v1/urltoimage?access_key=9260ae15ebae448692cae6a5809c6e85&full_page=true&format=png&response_type=json&url=${text}`);
      myBot.sendImage(m.chat, img.url, Config.BOT_NAME);
      User.counter(m.sender, { usage: 1 });
    } catch {
      m.reply(myLang("global").err);
    }
  }
};