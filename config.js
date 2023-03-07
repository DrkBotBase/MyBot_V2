/*
  Copyright (C) 2022
  DrkBot-MD - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

const { existsSync, readFileSync, watchFile, unwatchFile } = require("fs");
const { log, pint } = require("./lib/colores");
if (existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

// Other
global.owner = ["573508770421"];
global.premium = [];
global.sessionName = "session";
global.typeMenu = "image";
global.timeZone = "America/Bogota";
global.timeLocale = "co";
global.sourceCode = "https://github.com/DrkBotBase/MyBot_V2";
global.newFont = "on";
global.botFont = "Math monospace";

let d = new Date(new Date() + 3600000);
global.time = d.toLocaleTimeString("es", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

// Line BOX
global.BOX = {
  ini: "╭━━━━━━━━━━⬣",
  end: "╰━━━━━━━━━━⬣",
  iniM: "╭━━〘 *{}* 〙━━",
  endM: "╰━━〘 *{}* 〙━━⬣",
  med: "┊",
  medM: "┊⇀",
};

// Global Images
global.thumb = readFileSync("./lib/bot.jpg");
global.nothing = readFileSync("./lib/nsp.webp");
global.rulesImg = readFileSync("./lib/rules.jpg");
global.miniRobot = readFileSync("./lib/musicRobot.jpg");
global.maintenance = "https://telegra.ph/file/fb1477894bdd05a7d9851.jpg";

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}

// env ## not modify ##
module.exports = {
  BOT_NAME:
    process.env.BOT_NAME === undefined ? "🤖 Bot-MD" : process.env.BOT_NAME,
  BRANCH: "master",
  HANDLER: process.env.HANDLER === undefined ? "^[.]" : process.env.HANDLER,
  LANG:
    process.env.LANGUAGE === undefined
      ? "ES"
      : process.env.LANGUAGE.toUpperCase(),
  LOG: process.env.LOG_ERR === undefined ? "true" : process.env.LOG_ERR,
  MSG_CONSOLE:
    process.env.MSG_CONSOLE === undefined ? "" : process.env.MSG_CONSOLE,
  ONLINE: process.env.ONLINE === undefined ? "true" : process.env.ONLINE,
  READ: process.env.SEND_READ === undefined ? "" : process.env.SEND_READ,
  SESSION:
    process.env.SESSION === undefined
      ? global.sessionName
      : process.env.SESSION,
  VERSION:
    process.env.VERSION === undefined
      ? JSON.parse(readFileSync("./package.json")).version
      : process.env.VERSION,
  WORKTYPE:
    process.env.WORKTYPE === undefined ? "public" : process.env.WORKTYPE,
  OPEN_AI_KEY:
    process.env.OPEN_AI_KEY === undefined ? "" : process.env.OPEN_AI_KEY,
};
// end env

let file = require.resolve(__filename);
watchFile(file, () => {
  unwatchFile(file);
  log(pint(`Update ${__filename}`, "orange."));
  delete require.cache[file];
  require(file);
});
