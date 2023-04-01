let Config = require("../../config");
module.exports = {
  cmd: ['setmenu'],
  category: 'owner',
  desc: 'tipo de menu del bot.',
  owner: true,
  check: { pts: null },
  async handler(m, {args, myLang, pushname}) {
    if (args[0] === "image") {
      global.typeMenu = "image";
      m.reply(myLang("global").success);
    } else if (args[0] === "template") {
      global.typeMenu = "template";
      m.reply(myLang("global").success);
    } else if (args[0] === "location") {
      global.typeMenu = "location";
      m.reply(myLang("global").success);
    } else {
      m.reply("image/location/template")
      /*let sections = [{
        title: "OPCIONES DE CAMBIO DE MENÚ",
        rows: [
          {title: "Menú Image",rowId: `setmenu image`,description: `Menú con imagen`},
          {title: "Menú Location",rowId: `setmenu location`,description: `Menú Pequeño`},
          {title: "Menú Template",rowId: `setmenu template`,description: `Menú Botones Template`},
        ],},];
      myBot.sendListMsg(m.chat, "Selecciona el tipo de Munú del Bot", Config.BOT_NAME, `Hola ${pushname}`, "⬆️", sections, m);
      */
    }
  }
};