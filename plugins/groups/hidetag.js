let Config = require("../../config");
module.exports = {
  cmd: ['hdt'],
  category: 'groups',
  desc: 'mensiona usuarios silenciosamente.',
  register: true,
  group: true,
  admin: true,
  botAdmin: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, participants, User}) {
    myBot.sendMessage(m.chat, {
      text: text || Config.BOT_NAME,
      mentions: participants.map((a) => a.id)
    }, { quoted: m });
    User.counter(m.sender, { usage: 1 });
  }
};