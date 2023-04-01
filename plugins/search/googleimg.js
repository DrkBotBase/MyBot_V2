let Config = require("../../config");
let { googleImage } = require("@bochilteam/scraper");
module.exports = {
  cmd: ['img'],
  category: 'search',
  desc: 'busca imagenes de google.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, command, prefix, User}) {
    if (!text) return m.reply(myLang("img").msg.replace("{}", prefix + command));
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      anu = await googleImage(text);
      result = anu[Math.floor(Math.random() * anu.length)];
      myBot.sendImage(m.chat, result, Config.BOT_NAME)
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