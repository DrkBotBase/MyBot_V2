const acrcloud = require("acrcloud");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['shazam'],
  category: 'search',
  desc: 'obten informacion de alguna cancion.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, mime, User}) {
    if(!m.quoted) return m.reply(myLang("shazam").quot);
    if (/image/.test(mime)) return m.reply(myLang("shazam").image);
    if (/video/.test(mime)) return m.reply(myLang("shazam").video.replace("{}", prefix + command));
    myBot.sendReact(m.chat, "🕒", m.key);
    let sampleq = await m.quoted.download();
    let acr = new acrcloud({
      host: "identify-eu-west-1.acrcloud.com",
      access_key: "a7982a1f271fc390f3a69cb5bac04498",
      access_secret: "QPbD6UOnfawRtUiH88lzKx7edUaX20I0erUWCoCW",
    });
    let res = await acr.identify(sampleq)
    if(res.status.msg !== 'Success') return m.reply(myLang("shazam").err)
    json = res.metadata.music[0]
    msg = `🎶 ${json.title}\n`
    msg += `🎤 ${json.artists[0].name}\n`
    msg += `💽 ${json.album.name}\n`
    msg += `📆 ${json.release_date}`
    //msg += `🎥 https://youtu.be/${json.external_metadata.youtube.vid || ""}`
    m.reply(msg)
    User.counter(m.sender, { usage: 1 });
  }
};