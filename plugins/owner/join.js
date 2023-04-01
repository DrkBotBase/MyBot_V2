let { isUrl } = require("../../lib/myfunc");
module.exports = {
  cmd: ['join'],
  category: 'owner',
  desc: 'ingresa el bot a grupos mediante un enlace de invitacion.',
  owner: true,
  check: { pts: null },
  async handler(m, {text, myLang, myBot}) {
    if (!text) return m.reply(myLang("own").join.link);
    if (!isUrl(args[0]) && !args[0].includes("whatsapp.com")) return m.reply(myLang("own").join.link_err);
    myBot.sendReact(m.chat, "🕒", m.key);
    let result = args[0].split("https://chat.whatsapp.com/")[1];
    await myBot
      .groupAcceptInvite(result)
      .then((res) => m.reply(myLang("own").join.ok))
      .catch((err) => m.reply(myLang("own").join.err));
  }
};
