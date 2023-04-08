let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['yts'],
  category: 'search',
  desc: 'busquedas en YouTube.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, prefix, command, User}) {
    if (!text) return m.reply(myLang("yts").msg.replace("{}", prefix + command));
    const yts = (await fetchJson(`https://api.lolhuman.xyz/api/ytsearch?apikey=${restKey}&query=${text}`)).result
    if(!yts) return myBot.sendError(m.chat, "🤖 No encuentro tu busqueda :(")
    try {
      myBot.sendReact(m.chat, "🕒", m.key);
      let teks = `🔍 *Busqueda:*\n${text}\n\n`;
      yts.map((i) => {
        teks += `
╭━━━━━━━━⬣
*${i.title}*
📌 *Link:* https://www.youtube.com/watch?v=${i.videoId}
╰━━━━━━━━⬣`}).join("\n")
      myBot.sendImage(m.chat, yts[0].thumbnail, teks);
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      throw e;
      m.reply(myLang("global").err);
    }
  }
};