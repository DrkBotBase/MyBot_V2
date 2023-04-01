module.exports = {
  cmd: ['ytmp3'],
  category: 'downloader',
  desc: 'descarga audio de YouTube mediante su url.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, User, prefix}) {
    if (!text) return m.reply(myLang("song").msg.replace("{}", prefix));
    let regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
    if (!regex.test(text)) return m.reply(myLang("global").link_err)
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      link = `https://ytdl.tiodevhost.my.id/?url=${text}&filter=audioonly&quality=highestaudio&contenttype=audio/mpeg`
      myBot.sendMessage(m.chat, {
        audio: { url: link },
        mimetype: "audio/mpeg"
      }, { quoted: m });
      User.counter(m.sender, { usage: 1 });
    } catch (e) {
      throw e;
      m.reply(myLang("global").err);
    }
  }
};