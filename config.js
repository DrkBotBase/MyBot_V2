/*
  Copyright (C) 2022
  DrkBot-MD - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

const syntaxerror = require("syntax-error");
const pathh = require("path")
const { existsSync, readFileSync, watchFile, unwatchFile } = require("fs");
const { log, pint } = require("./lib/colores");
if (existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

// Other
global.owner = ['573508770421'];
global.premium = [];
global.sessionName = "session";
global.typeMenu = "image";
global.timeZone = "America/Bogota";
global.timeLocale = "co";
global.sourceCode = "https://github.com/DrkBotBase/MyBot_V2";
global.groupBot = "https://chat.whatsapp.com/GxjXaj3SxNDAWh8oMQ5bkg";
global.newFont = "on";
global.botFont = "Math monospace";
global.plugins = {};
global.restKey = "IanVanh"

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

let pluginFilter = (filename) => /\.js$/.test(filename);
let pluginFolder = pathh.join(__dirname, "./plugins");
global.reload = (path) => {
	path = `./${path.replace(/\\/g, '/')}`
	filename = path.split("/")[3]
	if (pluginFilter(filename)) {
		let dir = pathh.join(pluginFolder, './' + path.split('/')[2] + '/' + path.split('/')[3])
		isi = require(path)
		if (dir in require.cache) {
			delete require.cache[dir];
			if (existsSync(dir)) console.info(`re - require plugin '${path}'`);
			else {
				console.log(`deleted plugin '${path}'`);
				return isi.function
					? delete attr.functions[filename]
					: delete attr.commands[filename];
			}
		} else console.info(`requiring new plugin '${filename}'`);
		let err = syntaxerror(readFileSync(dir), filename);
		if (err) console.log(`syntax error while loading '${filename}'\n${err}`);
		else
			try {
				isi.function
					? (attr.functions[filename] = require(dir))
					: (attr.commands[filename] = require(dir));
			} catch (e) {
				console.log(e);
			} finally {
				isi.function
					? (attr.functions = Object.fromEntries(
							Object.entries(attr.functions).sort(([a], [b]) => a.localeCompare(b))
					  ))
					: (attr.commands = Object.fromEntries(
							Object.entries(attr.commands).sort(([a], [b]) => a.localeCompare(b))
					  ));
			}
	}
};

// env ## not modify ##
module.exports = {
  BOT_NAME: process.env.BOT_NAME === undefined ? "🤖 DarkBox" : process.env.BOT_NAME,
  BRANCH: "master",
  HANDLER: process.env.HANDLER === undefined ? "^[.]" : process.env.HANDLER,
  WELCOME: process.env.WELCOME === undefined ? "true" : process.env.WELCOME,
  LANG: process.env.LANGUAGE === undefined ? "ES" : process.env.LANGUAGE.toUpperCase(),
  LOG: process.env.LOG_ERR === undefined ? "true" : process.env.LOG_ERR,
  MSG_CONSOLE: process.env.MSG_CONSOLE === undefined ? "" : process.env.MSG_CONSOLE,
  ONLINE: process.env.ONLINE === undefined ? "true" : process.env.ONLINE,
  READ: process.env.SEND_READ === undefined ? "" : process.env.SEND_READ,
  SESSION: process.env.SESSION === undefined ? global.sessionName : process.env.SESSION,
  VERSION: process.env.VERSION === undefined ? JSON.parse(readFileSync("./package.json")).version : process.env.VERSION,
  WORKTYPE: process.env.WORKTYPE === undefined ? "public" : process.env.WORKTYPE,
  OPEN_AI_KEY: process.env.OPEN_AI_KEY === undefined ? "" : process.env.OPEN_AI_KEY,
};
// end env

let file = require.resolve(__filename);
watchFile(file, () => {
  unwatchFile(file);
  log(pint(`Update ${__filename}`, "orange."));
  delete require.cache[file];
  require(file);
});
