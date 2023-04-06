let { _unlock } = require("../../src/keys");
module.exports = {
  cmd: ['key'],
  category: 'info',
  desc: 'desbloquerse por key.',
  check: { pts: null },
  async handler(m, {args, User}) {
    if (!args[0]) return m.reply("Necesito la Key.");
    if (_unlock.includes(args[0])) {
      User.change(m.sender, { block: false });
      m.reply(`Usaste satisfactoriamente la Key *${args[0]}* para desbloquearte\n
      sigue jugando y acumulando Keys.`);
    } else {
      m.reply("Sigue intentando :(");
    }
  }
};