let { eBinary, dBinary } = require("../../lib/binary");
module.exports = {
  cmd: ['ebinary', 'dbinary'],
  category: 'tools',
  desc: 'pasa texto a codigo binario y viceversa.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myLang, command, text, User}) {
    if(command == 'ebinary') {
      if (!m.quoted && !text) return m.reply(myLang("binary").encode.replace("{}", prefix + command));
      teks = text ? text : m.quoted.text;
      m.reply(await eBinary(teks));
      User.counter(m.sender, { usage: 1 });
    } else if(command == 'dbinary') {
      if (!m.quoted) return m.reply(myLang("binary").decode.replace("{}", prefix + command));
      m.reply(await dBinary(m.quoted.text));
      User.counter(m.sender, { usage: 1 });
    }
  }
};