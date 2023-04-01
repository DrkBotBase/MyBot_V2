const cp = require("child_process");
const { promisify } = require("util");
const exec = promisify(cp.exec).bind(cp);
module.exports = {
  cmd: ['speedtest'],
  category: 'owner',
  desc: 'velocidad del servidor.',
  owner: true,
  check: { pts: null },
  async handler(m, {myBot}) {
    myBot.sendReact(m.chat, "🕒", m.key);
    m.reply("Prueba de velocidad...");
    let o;
    try {
      o = await exec("python speed.py");
    } catch (e) {
      o = e;
    } finally {
      let { stdout, stderr } = o;
      if (stdout.trim()) m.reply(stdout);
      if (stderr.trim()) m.reply(stderr);
    }
  }
};