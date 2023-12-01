let { BOT_NAME } = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['waifu', 'neko'],
  ignored: true,
  owner: true,
  category: '+18',
  desc: 'descarga imagenes hentai.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, command, User}) {
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      res = await fetchJson(`https://api.waifu.pics/nsfw/${command}`);
      //myBot.sendImage(m.chat, res.url, Config.BOT_NAME)
      let buttons = [
        { buttonId: command, buttonText: { displayText: "➡️" }, type: 1 },
      ];
      myBot.sendButImage(m.chat, res.url, myLang("global").by.replace("{}", BOT_NAME), BOT_NAME, buttons);
      User.counter(m.sender, { usage: 1 });
    } catch {
      m.reply(myLang("global").err);
    }
  }
};