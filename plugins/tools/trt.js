let { translate } = require('@vitalets/google-translate-api');
module.exports = {
  cmd: ['trt'],
  category: 'tools',
  desc: 'traduce texto a varios idiomas.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myLang, args, text, User}) {
    if (!m.quoted && !args) return m.reply(myLang("trt").quot);
    try {
      let { text, raw } = await translate(m.quoted.text, {to: args[0]})
      msg = `▶️ ${myLang("trt").from} _${raw.src}_\n`
      msg += `◀️ ${myLang("trt").to} _${args[0]}_\n`
      msg += `🔎 ${myLang("trt").res} ${text}`
      m.reply(msg)
      User.counter(m.sender, { usage: 1 });
    } catch {
      m.reply(myLang("global").err);
    }
  }
};