let { jsonformat } = require("../../lib/myfunc");
module.exports = {
  cmd: ['profile'],
  category: 'info',
  desc: 'obten tu informacion en el bot.',
  register: true,
  check: { pts: null },
  async handler(m, {User}) {
    let checkUser = User.show(m.sender);
    let msg = `*ID:* ${checkUser.id}\n`
    msg += `*Número:* ${checkUser.number.split("@")[0]}\n`
    msg += `*Nombre:* ${checkUser.name}\n`
    msg += `*Puntos:* ${checkUser.points}\n`
    msg += `*Uso del Bot:* ${checkUser.use}\n`
    msg += `*Reportes:* ${checkUser.report}`
    if (!m.isGroup) {
      msg += `\n*Keys:* ${jsonformat(checkUser.keys).replace(/"/g, "*").replace(/,/g, "")}`
    }
    m.reply(msg);
  }
};