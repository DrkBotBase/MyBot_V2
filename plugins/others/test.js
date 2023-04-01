let { log, pint } = require("../../lib/colores");
//let Config = require("../../config");
//let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['quoted'],
  ignored: true,
  owner: true,
  //register: true,
  //group: true,
  //admin: true,
  //botAdmin: true,
  check: { pts: null },
  async handler(m) {
    log()
  }
};