let { mediafireDl } = require("../../lib/myfunc");
module.exports = {
  cmd: ['mediafire'],
  category: 'downloader',
  desc: 'descarga contenido de mediafire.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, User}) {
    if (!text) return m.reply("Necesito la url!")
    try {
      let { name, size, date, mime, link } = await mediafireDl(text)
      myBot.sendReact(m.chat, "🕒", m.key);
      msg = `*Nombre:* ${name}\n`
      msg += `*Peso:* ${size}\n`
      msg += `*Tipo:* ${mime}\n\n`
      msg += '*Espera un momento mientras se envia tu archivo.*'
      await m.reply(msg)
      await myBot.sendFile(m.chat, link, name, "", m, null, {mimetype: mime, asDocument: true})
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      m.reply(myLang("global").err);
    }
  }
};