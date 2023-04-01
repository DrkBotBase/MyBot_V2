let Config = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['play', 'play2'],
  category: 'downloader',
  desc: 'descarga audio y video de YouTube.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, myLang, User, prefix, command}) {
    if (!text) return m.reply(myLang("play").msg.replace("{}", prefix + command));
    let ytplay = await fetchJson(`https://api.dhamzxploit.my.id/api/ytsearch?q=${text}`)
    let { url, title, thumbnail, timestamp, views } = ytplay.result[0];
    if(command == "play") {
      try {
        myBot.sendReact(m.chat, "🕒", m.key);
        link = `https://ytdl.tiodevhost.my.id/?url=${url}&filter=audioonly&quality=highestaudio&contenttype=audio/mpeg`
        myBot.sendMessage(m.chat, {
          audio: { url: link },
          mimetype: "audio/mpeg"
        }, { quoted: m });
        User.counter(m.sender, { usage: 1 });
      } catch (e) {
        throw e;
        m.reply(myLang("global").err);
      }
    } else if(command == "play2") {
      try {
        myBot.sendReact(m.chat, "🕒", m.key);
        link = `https://ytdl.tiodevhost.my.id/?url=${url}&filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`
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
  }
};