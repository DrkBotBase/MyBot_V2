let Config = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['yuri'],
  category: '+18',
  desc: 'descarga imagenes hentai.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, User}) {
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      let res = await fetchJson(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/yuri.json`);
      let enlace = await res[Math.floor(res.length * Math.random())];
      myBot.sendImage(m.chat, enlace, Config.BOT_NAME)
      /*let buttons = [
        { buttonId: command, buttonText: { displayText: "➡️" }, type: 1 },
      ];
      myBot.sendButImage(m.chat, enlace, myLang("global").by.replace("{}", botName), Config.BOT_NAME, buttons);*/
      User.counter(m.sender, { usage: 1 });
    } catch {
      m.reply(myLang("global").err);
    }
  }
};