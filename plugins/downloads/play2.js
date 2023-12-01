const ytdl = require('ytdl-core');
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['play2'],
  category: 'downloader',
  desc: 'descarga video de YouTube.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, myLang, prefix, command, User}) {
    if (!text) return m.reply(myLang("play").msg.replace("{}", prefix + command));
    const yts = await fetchJson(`https://api.dhamzxploit.my.id/api/ytsearch?q=${text}`)
    if(yts.status !== 'success') return myBot.sendError(m.chat, "🤖 No encuentro tu busqueda :(")
    let search = '';
    if(yts.result[0].type !== "channel") {
      search = yts.result[0]
    } else search = yts.result[1]
    try {
      let { videoId, title, seconds, timestamp, views } = search;
      myBot.sendReact(m.chat, "🕒", m.key);
      if(seconds > 360) return m.reply(`Video sobrepasa los 6 minutos.\nUtiliza el comando ${prefix}playdoc para descargar.`)
      let info = await ytdl.getInfo('https://youtu.be/' + search.videoId)
      let res = await ytdl.chooseFormat(info.formats, { filter: 'audioandvideo' })
      //let link = `https://ytdl.tiodevhost.my.id/${videoId}.mp4?filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`
      let teks = `
╭━━━━━━━━━━⬣
*${title}*
🕒 *Duracion:* ${timestamp}
📈 *Vistas:* ${views.toLocaleString('es-ES')}
╰━━━━━━━━━━⬣`.trim()
      myBot.sendMessage(m.chat, {
        video: { url: res.url },
        mimetype: "video/mp4",
        caption: teks
      }, { quoted: m });
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      throw e;
      m.reply(myLang("global").err);
    }
  }
};