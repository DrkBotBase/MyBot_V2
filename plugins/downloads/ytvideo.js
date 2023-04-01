let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['ytmp4'],
  category: 'downloader',
  desc: 'descarga video de YouTube mediante su url.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, prefix, User}) {
    if (!text) return m.reply(myLang("video").msg.replace("{}", prefix));
    let regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
    if (!regex.test(text)) return m.reply(myLang("global").link_err)
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      link = `https://ytdl.tiodevhost.my.id/?url=${text}&filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`
      let yts = await fetchJson(`https://api.dhamzxploit.my.id/api/ytsearch?q=${text}`)
      let { title, timestamp, ago, views } = yts.result[0];
      let info = `
╭━━━━━━━━━━⬣
*${title}*
🕒 *Duracion:* ${timestamp}
📈 *Vistas:* ${views}
╰━━━━━━━━━━⬣`.trim()
      myBot.sendMessage(m.chat, {
        video: { url: link },
        mimetype: "video/mp4",
        caption: info
      }, { quoted: m });
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      throw e;
      m.reply(myLang("global").err);
    }
  }
};