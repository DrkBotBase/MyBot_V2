const ytdl = require('ytdl-core');
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
    const yts = await fetchJson(`https://api.dhamzxploit.my.id/api/ytsearch?q=${text}`)
    if(yts.status !== 'success') return myBot.sendError(m.chat, "🤖 No encuentro tu busqueda :(")
    let search = '';
    if(yts.result[0].type !== "channel") {
      search = yts.result[0]
    } else search = yts.result[1]
    try {
      let { videoId, title, thumbnail } = search;
      myBot.sendReact(m.chat, "🕒", m.key);
      let info = await ytdl.getInfo('https://youtu.be/' + search.videoId)
      let res = await ytdl.chooseFormat(info.formats, { filter: 'audioandvideo' })
      //let link = `https://ytdl.tiodevhost.my.id/${videoId}.mp4?filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`
      var tmb = thumbnail
      var mycapt = await myBot.sendMessage(m.chat, {
        text: `Download VideoDoc by:\n${BOT_NAME}`,
      })
      myBot.sendMessage(m.chat, {
        document: { url: res.url },
        mimetype: "video/mp4",
        fileName: `${videoId}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: "",
            thumbnailUrl: tmb,
            sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
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