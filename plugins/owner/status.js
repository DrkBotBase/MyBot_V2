const os = require("os");
const speed = require("performance-now");
let Config = require("../../config");
let { runtime, formatp } = require("../../lib/myfunc");
module.exports = {
  cmd: ['ping', 'status'],
  category: 'owner',
  desc: 'obten informacion del bot.',
  owner: true,
  register: true,
  check: { pts: null },
  async handler(m, {command}) {
    if(command == "ping") {
      let used = process.memoryUsage();
      let cpus = os.cpus().map((cpu) => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
        return cpu;
      });
      let cpu = cpus.reduce(
        (last, cpu, _, { length }) => {
          last.total += cpu.total;
          last.speed += cpu.speed / length;
          last.times.user += cpu.times.user;
          last.times.nice += cpu.times.nice;
          last.times.sys += cpu.times.sys;
          last.times.idle += cpu.times.idle;
          last.times.irq += cpu.times.irq;
          return last;
        },{
          speed: 0,
          total: 0,
          times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0,
          },
        });
      let timestamp = speed();
      let latensi = speed() - timestamp;
      neww = performance.now();
      oldd = performance.now();
      respon = `
*VELOCIDAD DE RESPUESTA*

_Segundos:_ ${latensi.toFixed(4)}
_Milisegundos:_ ${oldd - neww}

💻 *INFO SERVER*
_RAM:_ ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

_MEMORIA NodeJS_
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map((v) => v.length)), " ")} : ${formatp(used[key])}`).join("\n")}

${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map((type) => `- *${(type + "*").padEnd(6)}: ${((100 * cpu.times[type]) / cpu.total).toFixed(2)}%`).join("\n")}
        
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times)
        .map((type) => `- *${(type + "*").padEnd(6)}: ${((100 * cpu.times[type]) / cpu.total).toFixed(2)}%`).join("\n")}`).join("\n\n")}` : ""
}`.trim();
    m.reply(respon);
    } else if(command == "status") {
    m.reply(`*𝚃𝙸𝙴𝙼𝙿𝙾 𝙳𝙴 𝙴𝙹𝙴𝙲𝚄𝙲𝙸Ó𝙽*
${BOX.iniM.replace("{}", Config.BOT_NAME)}
${BOX.medM} ⏱️ ${global.time} 
${BOX.medM} ⏰ ${runtime(process.uptime())}
${BOX.medM} 🔰 ${Config.VERSION}
${BOX.medM} 👥 ${await Object.keys(database).map((i) => database[i].phone).length}
${BOX.medM} ♨️ Bot modo${global.wtMyBot}
${BOX.medM} 👋🏻 ${Config.WELCOME === 'true' ? 'Welcome Encendido' : 'Welcome Apagado'}
${BOX.end}`);
  }
  }
};