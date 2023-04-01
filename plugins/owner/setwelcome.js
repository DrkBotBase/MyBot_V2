let Config = require("../../config");
module.exports = {
  cmd: ['setwelcome'],
  category: 'owner',
  desc: 'enciende o apaga el mensaje de bienvenida en grupos.',
  owner: true,
  check: { pts: null },
  async handler(m, {args, myLang, pushname}) {
    if (args[0] === "on") {
      Config.WELCOME = "true";
      m.reply(myLang("global").success);
    } else if (args[0] === "off") {
      Config.WELCOME = "false";
      m.reply(myLang("global").success);
    } else {
      m.reply("on/off")
      /*let sections = [{
        title: "SWITCH WELCOME",
        rows: [
          {title: "On",rowId: `setwelcome on`,description: `Enciende Mensaje de Bienvenida.`,},
          {title: "Off",rowId: `setwelcome off`,description: `Apaga Mensaje de Bienvenida.`,},
        ],},];
      myBot.sendListMsg(m.chat, "Switch Welcome", Config.BOT_NAME, `Hola ${pushname}`, "⬆️", sections, m);
      */
    }
  }
};