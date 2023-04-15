let { log, pint } = require("../../lib/colores");
//let Config = require("../../config");
//let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['test'],
  ignored: true,
  owner: true,
  //register: true,
  //group: true,
  //admin: true,
  //botAdmin: true,
  check: { pts: null },
  async handler(m, {myBot, args}) {
    if(args == "on") {
      await myBot.sendMessage(m.chat, {
        text: JSON.stringify(m.quoted, null, 2)
      }
    } else log(pint(m.quoted, '.'))
  }
};