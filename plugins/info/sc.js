let { generateWAMessageFromContent } = require("@adiwajshing/baileys");
module.exports = {
  cmd: ['sourcecode', 'sc'],
  category: 'info',
  desc: 'repositorio oficial del bot.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, User}) {
    let texto = `*@${m.sender.split`@`[0]}*\n\n*${myLang("sc").msg}*`;
    let aa = { quoted: m, userJid: myBot.user.id };
    let prep = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: texto,
        contextInfo: {
          externalAdReply: {
            title: "Official GitHub",
            body: null,
            thumbnail: global.thumb,
            sourceUrl: global.sourceCode,
          }, mentionedJid: [m.sender],
        }
      }
    }, aa);
    myBot.relayMessage(m.chat, prep.message, {
      messageId: prep.key.id,
      mentions: [m.sender],
    });
    User.counter(m.sender, { usage: 1 });
  }
};