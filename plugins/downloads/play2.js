const hxz = require('hxz-api');
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['play2'],
  category: 'downloader',
  desc: 'descarga video de YouTube.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, myLang, prefix, command, User}) {
    if (!text) return m.reply(myLang("play").msg.replace("{}", prefix + command));
    vid = (await fetchJson(`https://api.lolhuman.xyz/api/ytplay?apikey=${restKey}&query=${text}`)).result
    if(!vid) return myBot.sendError(m.chat, "🤖 No encuentro tu busqueda :(")
    let { id, title, duration, view } = vid
    try {
      myBot.sendReact(m.chat, "🕒", m.key);
      if(durationToSeconds(duration) > 600) return m.reply(`Video sobrepasa los 10 minutos.\nUtiliza el comando ${prefix}playdoc para descargar.`)
      let info = `
╭━━━━━━━━━━⬣
*${title}*
🕒 *Duracion:* ${duration}
📈 *Vistas:* ${view.toLocaleString('es-ES')}
╰━━━━━━━━━━⬣`.trim()
      let url = 'https://www.youtube.com/watch?v=' + id
      var cvr
      try {
        cvr = await hxz.youtube(url)
      } catch (e) {
        m.reply("[ err api ]");
      }
      var sce = cvr.link
      myBot.sendMessage(m.chat, {
        video: { url: sce },
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

function durationToSeconds(duration) {
  const timeParts = duration.split(':');
  const hours = parseInt(timeParts[0], 10) || 0;
  const minutes = parseInt(timeParts[1], 10) || 0;
  const seconds = parseInt(timeParts[2], 10) || 0;
  return (hours * 3600) + (minutes * 60) + seconds;
}