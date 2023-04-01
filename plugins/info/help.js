const moment = require("moment-timezone");
let { LANG, BOT_NAME, VERSION } = require("../../config");
let { totalHit } = require("../../src/data");
let more = String.fromCharCode(8206);
let readMore = more.repeat(4001);
if (LANG == "ES") {
  hi_lang = "Hola";
  sal_a = "Es muy temprano, duerme un poco mas.";
  sal_b = "Buenos Dias";
  sal_c = "Buenas Tardes";
  sal_d = "Buenas Noches";
} else if (LANG == "EN") {
  hi_lang = "Hi";
  sal_a = "you do not sleep?. 😒";
  sal_b = "good morning";
  sal_c = "good afternoon";
  sal_d = "good night";
}
module.exports = {
  ignored: true,
  cmd: ['menu'],
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, prefix}) {
    try {
      const cmd = []
      Object.values(attr.commands)
        .filter((cm) => !cm.disabled && !cm.ignored)
        .map((cm) => {
          cmd.push({
            cmd: cm.cmd,
            tag: cm.category ? cm.category : "Uncategorized",
            desc: cm.desc ? cm.desc : '-'
          })
        });
      const map_tag = cmd.map((mek) => mek.tag);
      const sort_tag = await map_tag.sort();
      const tag_data = new Set(sort_tag);
      const tags = [...tag_data];
      let time = moment().tz(global.timeZone).format("HH:mm:ss");
      if (time < "05:00:00") {
        var saludo = sal_a;
      } else if (time < "12:00:00") {
        var saludo = sal_b;
      } else if (time < "19:00:00") {
        var saludo = sal_c;
      } else if (time < "23:59:00") {
        var saludo = sal_d;
      }
      let menu = `${hi_lang} *${m.pushName}*, ${saludo}\n\n`
      menu += `📈 *Total Hit:* ${totalHit()}\n`
      menu += `👥 *Total Users:* ${await Object.keys(database).map((i) => database[i].phone).length}\n`
      menu += `️🆚 *Version:* ${VERSION}\n`
      menu += `🪀 *Owner:* ${global.owner}\n`
      menu += `🖊️ *Prefix:*〘 *${prefix}* 〙\n\n`
      menu += `${readMore}`
      let numtag = 1
      const totalTags = tags.length
      for (let tag of tags) {
        if (numtag > 1) {
          menu += `${BOX.end}\n`
        }
        menu += `\n${BOX.iniM.replace("{}", tag.toUpperCase())}\n`
        const filt_cmd = cmd.filter((mek) => mek.tag == tag);
        const map_cmd = await filt_cmd.map((mek) => mek.cmd);
        const sort = await map_cmd.sort(function (a, b) {
          return a.length - b.length;
        });
        for (let j = 0; j < sort.length; j++) {
          menu += `${BOX.medM} ${prefix}${sort[j]}\n`;
        }
        if (numtag === totalTags) {
          menu += `${BOX.endM.replace("{}", BOT_NAME)}`
        }
        numtag++
      }
      myBot.sendImage(m.chat, global.thumb, menu, m)
    } catch (e) {
      console.log(e)
    }
  }
};