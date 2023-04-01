let Config = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['instagram'],
  category: 'downloader',
  desc: 'descarga contenido de instagram',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, args}) {
    if (!args[0]) return m.reply("Necesito la url.");
    let { status, result } = await fetchJson(`https://api.lolhuman.xyz/api/instagram?apikey=${restKey}&url=${args[0]}`)
    if(status !== 200) return m.reply("Hay un problema con la busqueda de su contenido.\nIntente nuevamente.")
    let json = result[0]
    myBot.sendReact(m.chat, "🕒", m.key);
    if(json.includes("mp4")) return myBot.sendMessage(m.chat, {
      video: { url: json },
      mimetype: "video/mp4",
      caption: Config.BOT_NAME
    }, { quoted: m });
    else if(json.includes("jpg")) return myBot.sendImage(m.chat, json, Config.BOT_NAME, m)
  }
};