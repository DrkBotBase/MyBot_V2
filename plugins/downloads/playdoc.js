const hxz = require('hxz-api');
let { BOT_NAME } = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['playdoc'],
  category: 'downloader',
  desc: 'descarga video de YouTube formato documento.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, myLang, prefix, command, User}) {
    if (!text) return m.reply(myLang("play").msg.replace("{}", prefix + command));
    vid = (await fetchJson(`https://ian.onrender.com/api/ytplay?apikey=DarBox&query=${text}`)).result
    if(!vid) return myBot.sendError(m.chat, "🤖 No encuentro tu busqueda :(")
    let { id, title, thumbnail, video } = vid
    try {
      myBot.sendReact(m.chat, "🕒", m.key);
      let url = 'https://www.youtube.com/watch?v=' + id
      var tmb = thumbnail
      var mycapt = await myBot.sendMessage(m.chat, {
        text: `Download VideoDoc by:\n${BOT_NAME}`,
      })
      myBot.sendMessage(m.chat, {
        document: { url: video.link },
        mimetype: "video/mp4",
        fileName: `${id}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: "",
            thumbnailUrl: tmb,
            sourceUrl: url,
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: mycapt })
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      throw e;
      m.reply(myLang("global").err);
    }
  }
};