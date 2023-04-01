let Config = require("../../config");
let { wallpaper } = require("../../lib/scraper");
module.exports = {
  cmd: ['wallpaper'],
  category: 'search',
  desc: 'obten wallpapers de la web.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, command, prefix, User}) {
    if (!text) return m.reply(myLang("img").msg.replace("{}", prefix + command));
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      anu = await wallpaper(text);
      result = anu[Math.floor(Math.random() * anu.length)];
      myBot.sendImage(m.chat, result.image[0], Config.BOT_NAME)
      /*let buttons = [
        {buttonId: `wallpaper ${text}`, buttonText: { displayText: "➡️" }, type: 1},
      ];
      let buttonMessage = {
        image: { url: result.image[0] },
          caption: `*-----「 ${botName} 」-----*`,
          footer: Config.BOT_NAME,
          buttons: buttons,
          headerType: 4,
      };
      await myBot.sendMessage(m.chat, buttonMessage, { quoted: m });*/
      User.counter(m.sender, { usage: 1 });
    } catch {
      m.reply(myLang("global").err);
    }
  }
};