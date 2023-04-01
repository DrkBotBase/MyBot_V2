let Config = require("../../config");
let { tiktokdlv2 } = require("@bochilteam/scraper");
module.exports = {
  cmd: ['tiktok'],
  category: 'downloader',
  desc: 'descarga videos de TikTok.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, prefix, command, User}) {
    if (!text) return m.reply(myLang("ttdl").msg.replace("{}", prefix + command));
    if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) return m.reply(myLang("global").link_err)
    try {
      let { video } = await tiktokdlv2(text);
      myBot.sendReact(m.chat, "🕒", m.key);
      await myBot.sendMessage(m.chat, {
        video: {url: video.no_watermark },
        mimetype: "video/mp4",
        caption: myLang("global").by.replace("{}", Config.BOT_NAME)
      }, { quoted: m });
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      throw e;
      m.reply(myLang("global").err);
    }
  }
};