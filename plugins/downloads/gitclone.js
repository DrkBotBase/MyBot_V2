const fetch = require("node-fetch");
module.exports = {
  cmd: ['gitclone'],
  category: 'downloader',
  desc: 'descarga repositorio de GitHub.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, args, User}) {
    let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    if (!args[0]) return m.reply("https://github.com/DrkBotBase/MyBot_V2")
    if (!regex.test(args[0])) return m.reply("Link Invalido!")
    let [, user, repo] = args[0].match(regex) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      myBot.sendFile(m.chat, url, filename, null, m)
      User.counter(m.sender, { usage: 1 });
    } catch {
      m.reply(myLang("global").err);
    }
  }
};