const fs = require("fs");
const moment = require("moment-timezone");
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const { LANG } = require("../config");
if (LANG == "ES") {
  hi_lang = "Hola";
  list_a = "MENU";
  list_b = "GRUPOS";
  list_c = "JUEGOS";
  list_d = "UTILIDADES";
  list_e = "PROPIETARIO";
  sal_a = "Es muy temprano, duerme un poco mas.";
  sal_b = "Buenos Dias";
  sal_c = "Buenas Tardes";
  sal_d = "Buenas Noches";
} else if (LANG == "EN") {
  hi_lang = "Hi";
  list_a = "MENU";
  list_b = "GROUPS";
  list_c = "GAMES";
  list_d = "UTILITIES";
  list_e = "OWNER";
  sal_a = "you do not sleep?. 😒";
  sal_b = "good morning";
  sal_c = "good afternoon";
  sal_d = "good night";
}

const menu = (prefix, pushname, length, hit) => {
  var time = moment().tz(global.timeZone).format("HH:mm:ss");
  if (time < "05:00:00") {
    var saludo = sal_a;
  } else if (time < "12:00:00") {
    var saludo = sal_b;
  } else if (time < "19:00:00") {
    var saludo = sal_c;
  } else if (time < "23:59:00") {
    var saludo = sal_d;
  }

  return `══✪〘 *${global.botName}* 〙✪══

${hi_lang} *${pushname}*, ${saludo}

📈 *Total Hit:* ${hit}
💽 *Total Users:* ${length}
🪀 *Owner:* ${global.owner}
🖊️ *Prefix:*〘 *${prefix}* 〙

${readMore}
${BOX.iniM.replace("{}", list_a)}
${BOX.medM} ${prefix}alive
${BOX.medM} ${prefix}menu
${BOX.medM} ${prefix}profile
${BOX.medM} ${prefix}bot
${BOX.medM} ${prefix}donar
${BOX.medM} ${prefix}unlock
${BOX.medM} ${prefix}key
${BOX.medM} ${prefix}gpt
${BOX.end}
${BOX.iniM.replace("{}", list_b)}
${BOX.medM} ${prefix}promote
${BOX.medM} ${prefix}demote
${BOX.medM} ${prefix}add
${BOX.medM} ${prefix}kick
${BOX.medM} ${prefix}mute
${BOX.medM} ${prefix}unmute
${BOX.medM} ${prefix}groupinfo
${BOX.medM} ${prefix}tagall
${BOX.medM} ${prefix}hdt
${BOX.end}
${BOX.iniM.replace("{}", list_c)}
${BOX.medM} ${prefix}ttt
${BOX.medM} ${prefix}dados
${BOX.medM} ${prefix}ppt
${BOX.medM} ${prefix}slot
${BOX.medM} ${prefix}gay
${BOX.medM} ${prefix}love
${BOX.end}
${BOX.iniM.replace("{}", list_d)}
${BOX.medM} ${prefix}play
${BOX.medM} ${prefix}yts
${BOX.medM} ${prefix}song
${BOX.medM} ${prefix}video
${BOX.medM} ${prefix}getmusic
${BOX.medM} ${prefix}getvideo
${BOX.medM} ${prefix}ttdl
${BOX.medM} ${prefix}sticker
${BOX.medM} ${prefix}toaudio
${BOX.medM} ${prefix}tomp4
${BOX.medM} ${prefix}toimg
${BOX.medM} ${prefix}togif
${BOX.medM} ${prefix}tourl
${BOX.medM} ${prefix}emojimix
${BOX.medM} ${prefix}ttp
${BOX.medM} ${prefix}attp
${BOX.medM} ${prefix}trt
${BOX.medM} ${prefix}waifu
${BOX.medM} ${prefix}neko
${BOX.medM} ${prefix}yuri
${BOX.medM} ${prefix}img
${BOX.medM} ${prefix}wallpaper
${BOX.medM} ${prefix}ssweb
${BOX.medM} ${prefix}ebinary
${BOX.medM} ${prefix}dbinary
${BOX.medM} ${prefix}calc
${BOX.medM} ${prefix}bin
${BOX.medM} ${prefix}cambio
${BOX.medM} ${prefix}price
${BOX.medM} ${prefix}shazam
${BOX.medM} ${prefix}romevebg
${BOX.end}
${BOX.iniM.replace("{}", list_e)}
${BOX.medM} ${prefix}whatgroup
${BOX.medM} ${prefix}join
${BOX.medM} ${prefix}public
${BOX.medM} ${prefix}self
${BOX.medM} ${prefix}speedtest
${BOX.medM} ${prefix}update
${BOX.medM} ${prefix}actualizar
${BOX.medM} ${prefix}block
${BOX.medM} ${prefix}unblock
${BOX.medM} ${prefix}bc
${BOX.medM} ${prefix}bgc
${BOX.medM} ${prefix}ping|status
${BOX.medM} ${prefix}py
${BOX.medM} ${prefix}test
${BOX.medM} ${prefix}setmenu
${BOX.medM} ${prefix}setwelcome
${BOX.endM.replace("{}", global.botName)}`;
};

const butTemplate = [
  {
    urlButton: {
      displayText: "Source Code",
      url: `${sourceCode}`,
    },
  },
  {
    callButton: {
      displayText: "Number Phone Owner",
      phoneNumber: `+${global.owner}`,
    },
  },
  {
    quickReplyButton: {
      displayText: "Menu",
      id: "menu",
    },
  },
  {
    quickReplyButton: {
      displayText: "Contact Owner",
      id: "owner",
    },
  },
  {
    quickReplyButton: {
      displayText: "GitHub",
      id: "sc",
    },
  },
];

const rules = `╔══✪〘 *𝙽𝚄𝙴𝚅𝙰𝚂 𝚁𝙴𝙶𝙻𝙰𝚂* 〙✪══
𝙴𝙻 𝙱𝙾𝚃 𝚃𝙸𝙴𝙽𝙴 𝚄𝙽 𝚂𝙸𝚂𝚃𝙴𝙼𝙰 𝙳𝙴 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾 𝚀𝚄𝙴 𝙶𝙰𝚁𝙰𝙽𝚃𝙸𝚉𝙰 𝚂𝚄 𝚄𝚂𝙾, 𝙴𝚂 𝙲𝙾𝙽 𝙴𝙻 𝙵𝙸𝙽 𝙳𝙴 𝙲𝙾𝙽𝚃𝚁𝙾𝙻𝙰𝚁 𝙴𝙻 𝚂𝙿𝙰𝙼 𝚈 𝙻𝙰𝚂 𝙼𝙰𝙻𝙰𝚂 𝙿𝚁𝙰𝙲𝚃𝙸𝙲𝙰𝚂.

𝚂𝙴 𝙷𝙰 𝙸𝙼𝙿𝙻𝙴𝙼𝙴𝙽𝚃𝙰𝙳𝙾 𝚄𝙽 𝚂𝙸𝚂𝚃𝙴𝙼𝙰 𝙳𝙴 𝙿𝚄𝙽𝚃𝙾𝚂 𝙻𝙾𝚂 𝙲𝚄𝙰𝙻𝙴𝚂 𝚂𝙴 𝙲𝙾𝙽𝚂𝙴𝙶𝚄𝙸𝚁𝙰́𝙽 𝙿𝙾𝚁 𝙼𝙴𝙳𝙸𝙾 𝙳𝙴 𝙻𝙾𝚂 𝙹𝚄𝙴𝙶𝙾𝚂 𝙸𝙽𝙲𝙾𝚁𝙿𝙾𝚁𝙰𝙳𝙾𝚂 𝚈 𝙻𝙰𝚂 𝙺𝙴𝚈𝚂.

*𝙹𝚄𝙴𝙶𝙾𝚂*
𝙷𝚊𝚜𝚝𝚊 𝚎𝚕 𝚖𝚘𝚖𝚎𝚗𝚝𝚘 𝚑𝚊𝚢 𝟹 𝚓𝚞𝚎𝚐𝚘𝚜 𝚒𝚗𝚌𝚘𝚛𝚙𝚘𝚛𝚊𝚍𝚘𝚜 𝚎𝚗 𝚎𝚕 𝙱𝙾𝚃, 𝚌𝚘𝚗 𝚕𝚘𝚜 𝚓𝚞𝚎𝚐𝚘𝚜 𝚙𝚞𝚎𝚍𝚎𝚜 𝚐𝚊𝚗𝚊𝚛 𝚘 𝚙𝚎𝚛𝚍𝚎𝚛 𝚙𝚞𝚗𝚝𝚘𝚜.
𝙰𝚕 𝚖𝚘𝚖𝚎𝚗𝚝𝚘 𝚍𝚎 𝚓𝚞𝚐𝚊𝚛 𝚙𝚞𝚎𝚍𝚎𝚜 𝚐𝚊𝚗𝚊𝚛 𝚍𝚎𝚜𝚍𝚎 𝟸𝟶 𝚙𝚞𝚗𝚝𝚘𝚜 𝚑𝚊𝚜𝚝𝚊 𝟷𝟶𝟶 𝚙𝚞𝚗𝚝𝚘𝚜 𝚘 𝚎𝚗 𝚎𝚕 𝚌𝚊𝚜𝚘 𝚍𝚎 𝚙𝚎𝚛𝚍𝚒𝚍𝚊 𝚜𝚎 𝚝𝚎 𝚛𝚎𝚜𝚝𝚊𝚛𝚊́𝚗 𝟸𝟶 𝚙𝚞𝚗𝚝𝚘𝚜.
➣ *𝙳𝙰𝙳𝙾𝚂*
𝙾𝚝𝚘𝚛𝚐𝚊𝚗 𝚍𝚎𝚜𝚍𝚎 𝟸 𝚑𝚊𝚜𝚝𝚊 𝟷𝟸 𝚙𝚞𝚗𝚝𝚘𝚜 𝚍𝚎𝚙𝚎𝚗𝚍𝚒𝚎𝚗𝚍𝚘 𝚎𝚕 𝚍𝚊𝚍𝚘 𝚚𝚞𝚎 𝚜𝚊𝚚𝚞𝚎𝚜.
⇀ 𝚄́𝚗𝚒𝚌𝚘 𝚓𝚞𝚎𝚐𝚘 𝚍𝚘𝚗𝚍𝚎 𝚗𝚘 𝚙𝚒𝚎𝚛𝚍𝚎𝚜 𝚙𝚞𝚗𝚝𝚘𝚜
➣ *𝙿𝙸𝙴𝙳𝚁𝙰, 𝙿𝙰𝙿𝙴𝙻, 𝚃𝙸𝙹𝙴𝚁𝙰*
𝙾𝚝𝚘𝚛𝚐𝚊 𝟸𝟶 𝚙𝚞𝚗𝚝𝚘𝚜 𝚜𝚒 𝚐𝚊𝚗𝚊𝚜, 𝟷𝟶 𝚙𝚞𝚗𝚝𝚘𝚜 𝚜𝚒 𝚎𝚖𝚙𝚊𝚝𝚊𝚜 𝚢 -𝟸𝟶 𝚙𝚞𝚗𝚝𝚘𝚜 𝚎𝚗 𝚌𝚊𝚜𝚘 𝚍𝚎 𝚙𝚎́𝚛𝚍𝚒𝚍𝚊.
➣ *𝚂𝙻𝙾𝚃*
𝙾𝚝𝚘𝚛𝚐𝚊 𝚍𝚎𝚜𝚍𝚎 𝟸𝟶 𝚙𝚞𝚗𝚝𝚘𝚜 𝚑𝚊𝚜𝚝𝚊 𝟷𝟶𝟶 𝚙𝚞𝚗𝚝𝚘𝚜 𝚍𝚎𝚙𝚎𝚗𝚍𝚒𝚎𝚗𝚍𝚘 𝚎𝚕 𝚌𝚘𝚖𝚋𝚘 𝚘𝚋𝚝𝚎𝚗𝚒𝚍𝚘.
𝙴𝚗 𝚌𝚊𝚜𝚘 𝚍𝚎 𝚙𝚎́𝚛𝚍𝚒𝚍𝚊 𝚜𝚎 𝚝𝚎 𝚛𝚎𝚜𝚝𝚊𝚛𝚊́𝚗 𝟸𝟶 𝚙𝚞𝚗𝚝𝚘𝚜
⇀ 𝙴𝚜𝚝𝚎 𝚎𝚜 𝚎𝚕 𝚓𝚞𝚎𝚐𝚘 𝚍𝚘𝚗𝚍𝚎 𝚖𝚊́𝚜 𝚙𝚞𝚗𝚝𝚘𝚜 𝚙𝚞𝚎𝚍𝚎𝚜 𝚐𝚊𝚗𝚊𝚛, 𝚙𝚎𝚛𝚘 𝚑𝚊𝚢 𝚞𝚗 𝚙𝚛𝚎𝚖𝚒𝚘 𝚎𝚜𝚌𝚘𝚗𝚍𝚒𝚍𝚘 𝚎𝚕 𝚌𝚞𝚊𝚕 𝚎𝚜 💤 𝚜𝚒 𝚜𝚊𝚌𝚊𝚜 𝟹 𝚍𝚎 𝚎𝚜𝚝𝚘𝚜 𝚎𝚗 𝚞𝚗𝚊 𝚖𝚒𝚜𝚖𝚊 𝚏𝚒𝚕𝚊 𝚜𝚎𝚛𝚊́𝚜 𝚋𝚕𝚘𝚚𝚞𝚎𝚊𝚍𝚘 𝚢 𝚗𝚘 𝚙𝚘𝚍𝚛𝚊́𝚜 𝚞𝚜𝚊𝚛 𝚎𝚕 𝙱𝚘𝚝, 𝚎𝚜 𝚊𝚑𝚒́ 𝚍𝚘𝚗𝚍𝚎 𝚎𝚗𝚝𝚛𝚊𝚗 𝚕𝚊𝚜 𝙺𝚎𝚢𝚜 𝚍𝚎 𝚍𝚎𝚜𝚋𝚕𝚘𝚚𝚞𝚎𝚘.
𝙰𝚕 𝚖𝚘𝚖𝚎𝚗𝚝𝚘 𝚍𝚎 𝚎𝚜𝚝𝚊𝚛 𝚋𝚕𝚘𝚚𝚞𝚎𝚊𝚍𝚘 𝚜𝚘𝚕𝚘 𝚙𝚘𝚍𝚛𝚊́𝚜 𝚞𝚜𝚊𝚛 𝚌𝚒𝚎𝚛𝚝𝚘𝚜 𝚌𝚘𝚖𝚊𝚗𝚍𝚘𝚜 𝚕𝚘𝚜 𝚌𝚞𝚊𝚕𝚎𝚜 𝚜𝚘𝚗.
⇀ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚊𝚛 𝚊𝚕 𝚌𝚛𝚎𝚊𝚍𝚘𝚛
⇀ 𝚅𝚎𝚛 𝚝𝚞 𝚙𝚎𝚛𝚏𝚒𝚕
⇀ 𝚞𝚗𝚕𝚘𝚌𝚔, 𝚚𝚞𝚎 𝚎𝚜 𝚎𝚕 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚙𝚊𝚛𝚊 𝚍𝚎𝚜𝚋𝚕𝚘𝚚𝚞𝚎𝚊𝚛𝚝𝚎 𝚎𝚗 𝚌𝚊𝚜𝚘 𝚍𝚎 𝚚𝚞𝚎 𝚝𝚎𝚗𝚐𝚊𝚜 𝚞𝚗𝚊 𝚔𝚎𝚢 𝚌𝚘𝚗 𝚎𝚜𝚊 𝚏𝚞𝚗𝚌𝚒𝚘́𝚗

*𝚀𝚄𝙴 𝚂𝙾𝙽 𝙻𝙰𝚂 𝙺𝙴𝚈𝚂?*
𝙻𝚊𝚜 𝙺𝚎𝚢𝚜 𝚜𝚘𝚗 𝚗𝚞́𝚖𝚎𝚛𝚘𝚜 𝚍𝚎 𝚜𝚎𝚒𝚜 𝚍𝚒́𝚐𝚒𝚝𝚘𝚜 𝚚𝚞𝚎 𝚎𝚜𝚝𝚊𝚛𝚊́𝚜 𝚛𝚎𝚌𝚒𝚋𝚒𝚎𝚗𝚍𝚘 𝚊𝚕 𝚖𝚘𝚖𝚎𝚗𝚝𝚘 𝚍𝚎 𝚓𝚞𝚐𝚊𝚛.

*𝙿𝙰𝚁𝙰 𝚀𝚄𝙴 𝚂𝙸𝚁𝚅𝙴𝙽?*
𝙷𝙰𝚈 𝟸 𝚃𝙸𝙿𝙾𝚂 𝙳𝙴 𝙺𝙴𝚈𝚂
➣ 𝙺𝚎𝚢𝚜 𝚍𝚎 𝚍𝚎𝚜𝚋𝚕𝚘𝚚𝚞𝚎𝚘.
𝚂𝚒𝚛𝚟𝚎𝚗 𝚙𝚊𝚛𝚊 𝚊𝚞𝚝𝚘 𝚍𝚎𝚜𝚋𝚕𝚘𝚚𝚞𝚎𝚊𝚛𝚝𝚎 𝚎𝚗 𝚎𝚕 𝚌𝚊𝚜𝚘 𝚍𝚎 𝚚𝚞𝚎 𝚑𝚊𝚕𝚕𝚊𝚜 𝚜𝚒𝚍𝚘 𝚋𝚕𝚘𝚚𝚞𝚎𝚊𝚍𝚘.
➣ 𝙺𝚎𝚢𝚜 𝚍𝚎 𝚙𝚞𝚗𝚝𝚘𝚜.
𝙿𝚊𝚛𝚊 𝚎𝚜𝚝𝚊 𝚌𝚊𝚝𝚎𝚐𝚘𝚛𝚒́𝚊 𝚑𝚊𝚢 𝚍𝚘𝚜 𝚝𝚒𝚙𝚘𝚜 𝚍𝚎 𝙺𝚎𝚢𝚜.
⇀ 𝙺𝚎𝚢𝚜 𝚚𝚞𝚎 𝚘𝚝𝚘𝚛𝚐𝚊𝚗 𝚙𝚞𝚗𝚝𝚘𝚜
⇀ 𝙺𝚎𝚢𝚜 𝚚𝚞𝚎 𝚚𝚞𝚒𝚝𝚊𝚗 𝚙𝚞𝚗𝚝𝚘𝚜

𝙿𝚊𝚛𝚊 𝚙𝚛𝚘𝚋𝚊𝚛 𝚕𝚊𝚜 𝙺𝚎𝚢𝚜 𝚎𝚜 𝚌𝚘𝚗 𝚎𝚕 𝚞𝚜𝚘 𝚍𝚎𝚕 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚔𝚎𝚢.
*𝙼𝙾𝙳𝙾 𝙳𝙴 𝚄𝚂𝙾*
𝙴𝚜𝚌𝚛𝚒𝚋𝚎 𝚔𝚎𝚢 𝚖𝚊𝚜 𝚎𝚕 𝚗𝚞́𝚖𝚎𝚛𝚘 𝚍𝚎 𝚕𝚊 𝚔𝚎𝚢 𝚘𝚋𝚝𝚎𝚗𝚒𝚍𝚘 𝚘 𝚜𝚘𝚕𝚘 𝚛𝚎𝚜𝚙𝚘𝚗𝚍𝚎 𝚕𝚊 𝚔𝚎𝚢 𝚘𝚋𝚝𝚎𝚗𝚒𝚍𝚊 𝚌𝚘𝚗 𝚎𝚕 𝚌𝚘𝚖𝚊𝚗𝚍𝚘.
╚════════════`;

module.exports = { menu, butTemplate, rules };
