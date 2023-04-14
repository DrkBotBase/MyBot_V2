let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['yts'],
  category: 'search',
  desc: 'busquedas en YouTube.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, prefix, command, User}) {
    if (!text) return m.reply(myLang("yts").msg.replace("{}", prefix + command));
    const yts = await fetchJson(`https://api.dhamzxploit.my.id/api/ytsearch?q=${text}`)
    if(yts.status !== 'success') return myBot.sendError(m.chat, "🤖 No encuentro tu busqueda :(")
    try {
      let { url, title, thumbnail, timestamp, views } = yts.result[0];
      myBot.sendReact(m.chat, "🕒", m.key);
      let teks = `🔍 *Busqueda:*\n${text}\n\n`;
      yts.result.map((i) => {
        teks += `
╭━━━━━━━━━━⬣
*${i.title}*
📌 *Link:* ${i.url}
🕒 *Duracion:* ${i.timestamp}
📈 *Vistas:* ${i.views}
╰━━━━━━━━━━⬣`}).join("\n")
      myBot.sendImage(m.chat, thumbnail, teks);
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      throw e;
      m.reply(myLang("global").err);
    }
  }
};