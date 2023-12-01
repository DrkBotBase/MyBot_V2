let Config = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['bot'],
  ignored: true,
  owner: true,
  category: 'ia',
  desc: 'chatbot para que te diviertas conversando.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myLang, text, User}) {
    if (!text) return m.reply(myLang("ia").msg);
    let lang = Config.LANG.toLowerCase();
    let { messages } = await fetchJson(`https://api.simsimi.net/v2/?text=${text}&lc=${lang}&cf=true`)
    try {
      json = messages[0].text
      if (
        json === "Roberto" ||
        json === "maite" ||
        json === "Luis Mario." ||
        json === "Ricardo milos\n"
      ) {
        m.reply("🤖 " + myLang("ia").name.replace("{}", Config.BOT_NAME));
      } else {
        m.reply("🤖 " + json);
      }
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      m.reply(myLang("global").err);
    }
  }
};