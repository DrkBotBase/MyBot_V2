let { BOT_NAME } = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['play'],
  category: 'downloader',
  desc: 'descarga audio de YouTube.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, myLang, prefix, command, User}) {
    if (!text) return m.reply(myLang("play").msg.replace("{}", prefix + command));
    vid = (await fetchJson(`https://api.lolhuman.xyz/api/ytplay?apikey=${restKey}&query=${text}`)).result
    if(!vid) return myBot.sendError(m.chat, "🤖 No encuentro tu busqueda :(")
    let { id, title, thumbnail } = vid
    try {
      myBot.sendReact(m.chat, "🕒", m.key);
      let link = `https://ytdl.tiodevhost.my.id/${id}.mpeg?filter=audioonly&quality=highestaudio&contenttype=audio/mpeg`
      var tmb = thumbnail
      var mycapt = await myBot.sendMessage(m.chat, {
        text: `Download Music by:\n${BOT_NAME}`,
      })
      myBot.sendMessage(m.chat, {
        audio: { url: link },
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: title,
            body: "",
            thumbnailUrl: tmb,
            sourceUrl: `https://www.youtube.com/watch?v=${id}`,
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

async function scraper(query) {
  let search = (await fetchJson(`https://api.lolhuman.xyz/api/ytplay?apikey=${restKey}&query=${text}`)).result
}