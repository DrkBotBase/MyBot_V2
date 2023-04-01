let { toAudio } = require("../../lib/converter");
module.exports = {
  cmd: ['toaudio'],
  category: 'converter',
  desc: 'convierte videos a audio.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, mime, User}) {
    if (!m.quoted) return m.reply(myLang("to_audio").quot);
    if (!/video/.test(mime)) return m.reply(myLang("to_audio").q_audio);
    myBot.sendReact(m.chat, "🕒", m.key);
    let media = await m.quoted.download();
    let audio = await toAudio(media, "mp4");
    myBot.sendMessage(m.chat, {
      audio: audio,
      mimetype: "audio/mpeg"
    }, { quoted: m });
    User.counter(m.sender, { usage: 1 });
  }
};