let Config = require("../../config");
module.exports = {
  cmd: ['bc', 'bgc'],
  category: 'owner',
  desc: 'envia difusion a los grupos donde se encuentra el bot.',
  owner: true,
  check: { pts: null },
  async handler(m, {myBot, command, text, prefix}) {
    let = imgbc = (await m.quoted.download()).catch(() => global.thumb);
    if(command == "bc") {
      if (!text) return m.reply(`Que quieres enviar?\n\nEjemplo: ${prefix + command} text`);
      let anu = await Object.keys(database)
      m.reply(`Enviar difusión a ${anu.length} chat.\n*Tiempo de envio:* Aproximadamente ${anu.length * 2} segundos.`);
      for (let i of anu) {
        await sleep(1500);
        let txt = `「 Difusor Bot 」\n\n${text}`;
        myBot.sendButtonLoc(i, imgbc, txt, Config.BOT_NAME, "MENU", "menu");
      }
      m.reply("Difusion Enviada");
    } else if(command == "bgc") {
      if (!text) return m.reply(`Que quieres enviar?\n\nEjemplo: ${prefix + command} text`);
      let getGroups = await myBot.groupFetchAllParticipating();
      let groups = Object.entries(getGroups).slice(0).map((entry) => entry[1]);
      let anu = groups.map((v) => v.id);
      m.reply(`Enviar difusión a ${anu.length} grupos.\nTiempo de envio ${anu.length * 1.5} segundos.`);
      for (let i of anu) {
        await sleep(1500);
        let txt = `「 Difusor Bot 」\n\n${text}`;
        myBot.sendButtonLoc(i, imgbc, txt, Config.BOT_NAME, "MENU", "menu");
      }
      m.reply("Difusion Enviada");
    }
  }
};