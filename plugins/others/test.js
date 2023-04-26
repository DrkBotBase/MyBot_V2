const fs = require("fs");
let { log, pint } = require("../../lib/colores");
//let Config = require("../../config");
let { jsonformat } = require("../../lib/myfunc");
module.exports = {
  cmd: ['test'],
  ignored: true,
  owner: true,
  //register: true,
  //group: true,
  //admin: true,
  //botAdmin: true,
  check: { pts: null },
  async handler(m, {myBot, args, text, quoted}) {
    log(conns);
  }
};
