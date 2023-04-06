let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['yts'],
  category: 'search',
  desc: 'busquedas en YouTube.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, prefix, command, User}) {
    if (!text) return m.reply(myLang("yts").msg.replace("{}", prefix + command));
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      const yts = await fetchJson(`https://api.dhamzxploit.my.id/api/ytsearch?q=${text}`)
      let teks = text + "\n\n";
      yts.result.map((i) => {
        teks += `
╭━━━━━━━━━━⬣
*${i.title}*
📌 *Link:* ${i.url}
🕒 *Duracion:* ${i.timestamp}
📈 *Vistas:* ${i.views}
╰━━━━━━━━━━⬣`}).join("\n")
      myBot.sendImage(m.chat, yts.result[0].thumbnail, teks);
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      throw e;
      m.reply(myLang("global").err);
    }
  }
};