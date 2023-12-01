const googleTTS = require('google-translate-tts');
let Config = require("../../config");

module.exports = {
  cmd: ['tts'],
  category: 'converter',
  desc: 'convierte texto a audio.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, User}) {
    if (!text) return m.reply('Que texto quieres pasar a audio?')
    let lang = Config.LANG.toLowerCase();
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      let buffer = await googleTTS.synthesize({
        text: text,
        voice: lang
      });
      myBot.sendMessage(m.chat, {
        audio: buffer,
        mimetype: "audio/mpeg"
      }, { quoted: m });
     } catch (e) {
       throw e
       m.reply('🤖 *Tenemos un error*')
     }
    User.counter(m.sender, { usage: 1 });
  }
};