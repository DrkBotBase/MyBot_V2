/*
  Copyright (C) 2023
  DarkBox - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

require("./config");
const {
  proto,
  generateWAMessage,
  areJidsSameUser
} = require("@adiwajshing/baileys");
const fs = require("fs");
const similarity = require("similarity");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const {
  sleep,
  isUrl,
  fetchJson,
  parseMention,
  modifyLetter,
} = require("./lib/myfunc");
const { log, pint, bgPint } = require("./lib/colores");
const Config = require("./config");

global.db = JSON.parse(fs.readFileSync("./src/games.json"))
if (global.db) global.db = {
    game: {},
    ...(global.db || {})
}
global.kuismath = db.game.math = {}
global.riddle = db.game.riddle = {}
global.what_song = db.game.songs = {}
global.t_t_t = db.game.ttt = {}

// Language
const myLang = require("./language").getString;

module.exports = myBot = async (myBot, m, chatUpdate, store) => {
  try {
    var body = m.mtype === "conversation" ? m.message.conversation : m.mtype == "imageMessage" ? m.message.imageMessage.caption : m.mtype == "videoMessage" ? m.message.videoMessage.caption : m.mtype == "extendedTextMessage" ? m.message.extendedTextMessage.text : m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : "";
    var budy = typeof m.text == "string" ? m.text : "";
    const prefix = Config.HANDLER.match(/\[(\W*)\]/)[1][0];
    const isCmd = body.startsWith(prefix);
    const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await myBot.decodeJid(myBot.user.id);
    const isCreator = [botNumber, ...global.owner].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
    const itsMe = m.sender == botNumber ? true : false;
    const text = (q = args.join(" "));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const isMedia = /image|video|sticker|audio/.test(mime);

    // New Functions BD
    const { User, addUserKey, totalHit } = require("./src/data");
    const regUser = User.check(m.sender);
    const checkUser = User.show(m.sender);
    const {
      keysAll,
      _unlock,
      _puntosMas,
      _puntosMenos,
    } = require("./src/keys");

    // Group
    const groupMetadata = m.isGroup ? await myBot.groupMetadata(m.chat).catch((e) => {}) : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = m.isGroup ? await participants.filter((v) => v.admin !== null).map((v) => v.id) : "";
    const groupOwner = m.isGroup ? groupMetadata.owner : "";
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const isPremium = global.premium.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender) || false;

    // Public & Self
    if (!myBot.public) {
      if (!m.key.fromMe) return;
    }

    //  Push Message To Console && Auto Read
    if (m.message) {
      if (Config.READ === "true") {
        myBot.sendReadReceipt(m.chat, m.sender, [m.key.id]);
      }
      if (Config.MSG_CONSOLE === "true") {
        log(
          pint(bgPint(new Date(), "white"), "black.") + "\n" +
          pint(bgPint("[ NUEVO MENSAJE ]", "white"), "black.") + "\n" +
          pint(bgPint(budy, "blue"), "white.") + "\n" +
          pint("=> Sender: ", "magenta") + pint(pushname) + " " + pint(m.sender, "yellow") + "\n" +
          pint("=> To: ", "blue") + " " + pint(m.isGroup ? pushname : "Chat Privado") + " " + pint(m.chat) + "\n\n"
        );
      }
    }
    
    if (budy) {
      if (regUser === false) {
        new User(m.sender, pushname);
      }
    }

try {
  let id = m.chat;
  if (kuismath.hasOwnProperty(id) && !isCmd && m.quoted) {
      respuesta = kuismath[id]
      log(m.quoted.text)
      if (m.text == respuesta) {
        await myBot.sendText(m.chat, `🎮 Quiz Math 🎮\n\nRespuesta Correcta 🎉\n\nQuieres volver a jugar? envia: ${prefix}math mode`, m)
        delete kuismath[id]
      } else m.reply('Respuesta Incorrecta!')
  }
  if (riddle.hasOwnProperty(id) && !isCmd && m.quoted) {
      respuesta = riddle[id]
      if (budy.toLowerCase() == respuesta.toLowerCase()) {
        await myBot.sendText(m.chat, `🎮 Acertijo 🎮\n\nRespuesta Correcta 🎉\n\nQuieres volver a jugar? envia: ${prefix}acertijo`, m)
        delete riddle[id]
      } else if (similarity(budy.toLowerCase(), respuesta.toLowerCase().trim()) >= 0.72) m.reply('Casi lo logras!');
      else m.reply('Respuesta Incorrecta!')
  }
  if (what_song.hasOwnProperty(id) && !isCmd) {
      respuesta = what_song[id]
      if (budy.toLowerCase() == respuesta.toLowerCase()) {
        await myBot.sendText(m.chat, `🎮 What Song Is 🎮\n\nRespuesta Correcta 🎉\n\nQuieres volver a jugar? envia: ${prefix}canciones`, m)
        delete what_song[id]
      } else if (similarity(budy.toLowerCase(), respuesta.toLowerCase().trim()) >= 0.72) m.reply('Casi lo logras!');
      else m.reply('Respuesta Incorrecta!')
  }
// ------------------ TicTacToe ------------------ //
    let room = Object.values(t_t_t).find(
      (room) =>
        room.id &&
        room.game &&
        room.state &&
        room.id.startsWith("tictactoe") &&
        [room.game.playerX, room.game.playerO].includes(m.sender) &&
        room.state == "PLAYING"
    );
    if (room) {
      let ok;
      let isWin = !1;
      let isTie = !1;
      let isSurrender = !1;
      if (!/^([1-9]|(me)?rendirse|off|siguiente)$/i.test(m.text)) return;
      isSurrender = !/^[1-9]$/.test(m.text);
      if (m.sender !== room.game.currentTurn) {
        if (!isSurrender) return !0;
      }
      if (
        !isSurrender &&
        1 >
          (ok = room.game.turn(
            m.sender === room.game.playerO,
            parseInt(m.text) - 1
          ))
      ) {
        m.reply(
          {
            "-3": "Juego Terminado",
            "-2": "Invalido",
            "-1": "Posición Invalida",
            0: "Posición Invalida",
          }[ok]
        );
        return !0;
      }
      if (m.sender === room.game.winner) isWin = true;
      else if (room.game.board === 511) isTie = true;
      let arr = room.game.render().map((v) => {
        return {
          X: "❌",
          O: "⭕",
          1: "1️⃣",
          2: "2️⃣",
          3: "3️⃣",
          4: "4️⃣",
          5: "5️⃣",
          6: "6️⃣",
          7: "7️⃣",
          8: "8️⃣",
          9: "9️⃣",
        }[v];
      });
      if (isSurrender) {
        room.game._currentTurn = m.sender === room.game.playerX;
        isWin = true;
      }
      let winner = isSurrender ? room.game.currentTurn : room.game.winner;
      let str = `Sala ID: ${room.id}

${BOX.iniM.replace("{}", "JUGADORES")}
❌: @${room.game.playerX.split("@")[0]}
⭕: @${room.game.playerO.split("@")[0]}
${BOX.end}

${arr.slice(0, 3).join("")}
${arr.slice(3, 6).join("")}
${arr.slice(6).join("")}

${
  isWin
    ? `El jugador @${winner.split("@")[0]} es el ganador.`
    : isTie
    ? "Empate.\nJuego Terminado"
    : `Turno de: *${["❌", "⭕"][1 * room.game._currentTurn]} (@${
        room.game.currentTurn.split("@")[0]
      }*)`
}

Escriba *rendirse* para admitir la derrota.`.trim();
      if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
        room[room.game._currentTurn ^ isSurrender ? "x" : "o"] = m.chat;
      if (room.x !== room.o)
        await myBot.sendText(room.x, str, m, { mentions: parseMention(str) });
      await myBot.sendText(room.o, str, m, { mentions: parseMention(str) });
      if (isTie || isWin) {
        delete t_t_t[room.id];
      }
    }
// ------------------ End ------------------ //
} catch (e) {
  log(pint(e, "blue"))
}


const cmd = Object.values(attr.commands).find((cmn) => cmn.cmd && cmn.cmd.includes(command) && !cmn.disabled)
  if(!cmd) return
  if (cmd.owner && !isCreator) return myBot.sendError(m.chat, myLang("global").owner);
  else if (cmd.register && !regUser) return myBot.sendError(m.chat, myLang("global").noReg.replace("{}", prefix));
  else if(checkUser.block == true) return myBot.sendError(m.chat, "Estas Bloqueado.");
  else if (checkUser.points < cmd.check.pts ) {
    if(!isCreator) return myBot.sendError(m.chat, myLang('ia').gpt_no_points.replace("{}", cmd.check.pts - checkUser.points)) }
  else if(cmd.group && !m.isGroup) return myBot.sendError(m.chat, myLang("global").group)
  else if(cmd.isPrivate && m.isGroup) return myBot.sendError(m.chat, myLang("global").private);
  else if(cmd.admin && !isAdmins) return myBot.sendError(m.chat, myLang("global").admin);
  else if(cmd.botAdmin && !isBotAdmins) return myBot.sendError(m.chat, myLang("global").botAdmin);

    // reset users every 12 hours
    let cron = require("node-cron");
    cron.schedule("00 12 * * *", () => {
        log(pint("Reseted Data", "yellow."));
    },{
      scheduled: true,
      timezone: global.timeZone,
    });

    // Anti Link
    /*if (budy.match(`chat.whatsapp.com`)) {
      if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
      let gclink = (`https://chat.whatsapp.com/`+await myBot.groupInviteCode(m.chat))
      let isLinkThisGc = new RegExp(gclink, 'i')
      let isgclink = isLinkThisGc.test(m.text)
      if (isCreator) return m.reply(myLang('antilink').own)
      if (isAdmins) return m.reply(myLang('antilink').admin)
      if (isgclink) return m.reply(myLang('antilink').detect)
      m.reply(myLang('antilink').msg)
      await sleep(3000)
      myBot.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }
        
      // Mute Chat
    if (data.chats[m.chat].mute && !isAdmins && !isCreator) {
      return
    }*/

    // Respon Cmd with media
    if (isMedia && m.msg.fileSha256 && m.msg.fileSha256.toString("base64")) {
      let hash = m.msg.fileSha256.toString("base64");
      let { text, mentionedJid } = hash;
      let messages = await generateWAMessage( m.chat, {
        text: text,
        mentions: mentionedJid
      },{
        userJid: myBot.user.id,
        quoted: m.quoted && m.quoted.fakeObj,
      });
      messages.key.fromMe = areJidsSameUser(m.sender, myBot.user.id);
      messages.key.id = m.key.id;
      messages.pushName = m.pushName;
      if (m.isGroup) messages.participant = m.sender;
      let msg = {
        ...chatUpdate,
        messages: [proto.WebMessageInfo.fromObject(messages)],
        type: "append",
      };
      myBot.ev.emit("messages.upsert", msg);
    }


    // ======== INICIO COMANDOS ========
   /*switch (command) {
      case "alive":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          anu = await modifyLetter(myLang("alive").msg);
          myBot.sendImage(m.chat, thumb, anu)
          User.counter(m.sender, { usage: 1 });
        }
        break;
      // DOWNLOADS
      case "getmusic":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!text)
            return m.reply(
              myLang("get_down").msg.replace("{}", prefix + command)
            );
          if (!m.quoted) return m.reply(myLang("get_down").quot);
          if (!m.quoted.isBaileys) return m.reply(myLang("get_down").no_me);
          let urls = quoted.text.match(
            new RegExp(
              /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/,
              "gi"
            )
          );
          if (!urls) return m.reply(myLang("get_down").quot);
          myBot.sendReact(m.chat, "🕒", m.key);
          try {
            link = `https://ytdl.tiodevhost.my.id/?url=${urls[text - 1]}&filter=audioonly&quality=highestaudio&contenttype=audio/mpeg`
            myBot.sendMessage(
              m.chat,
              { audio: { url: link }, mimetype: "audio/mpeg" },
              { quoted: m }
            );
            User.counter(m.sender, { usage: 1 });
          } catch (e) {
            throw e;
            m.reply(myLang("global").err);
          }
        }
        break;
      case "getvideo":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!text)
            return m.reply(
              myLang("get_down").msg.replace("{}", prefix + command)
            );
          if (!m.quoted) return m.reply(myLang("get_down").quot);
          if (!m.quoted.isBaileys) return m.reply(myLang("get_down").no_me);
          let urls = quoted.text.match(
            new RegExp(
              /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/,
              "gi"
            )
          );
          if (!urls) return m.reply(myLang("get_down").quot);
          myBot.sendReact(m.chat, "🕒", m.key);
          try {
            link = `https://ytdl.tiodevhost.my.id/?url=${urls[text -1]}&filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`
            let url = await fetchJson(`https://api.dhamzxploit.my.id/api/ytsearch?q=${urls[text -1]}`)
            let { title, timestamp, ago, views } = url.result[0];
            let info = `
╭━━━━━━━━━━⬣
*${title}*
🕒 *Duracion:* ${timestamp}
📈 *Vistas:* ${views}
╰━━━━━━━━━━⬣`.trim()
            myBot.sendMessage(
              m.chat,
              {
                video: { url: link },
                mimetype: "video/mp4",
                caption: info,
              },
              { quoted: m }
            );
            User.counter(m.sender, { usage: 1 });
          } catch (e) {
            throw e;
            m.reply(myLang("global").err);
          }
        }
        break;
      // TOOLS
      case "cambio":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!text) return m.reply(myLang("exchange").msg);
          key = "bcab649da87b8cc8e5f000d0";
          if (!key) throw "Falta la key!";
          if (text.includes(",") && verify(text) == 2) {
            var split = text.split(",");
            a = split[0].trim();
            b = split[1].trim();
            am = split[2].trim();
          } else {
            return m.reply(myLang("exchange").err);
          }
          await axios
            .get(
              `https://v6.exchangerate-api.com/v6/${key}/pair/${a}/${b}/${am}`
            )
            .then(async (response) => {
              var { conversion_rate, conversion_result } = response.data;
              var msg = `✅\n\n💲 *${a.toUpperCase()}:* ${conversion_rate} ${b.toUpperCase()}\n🟰 *${b.toUpperCase()}:* ${conversion_result}`;
              m.reply(msg);
            });
          function verify(str) {
            let letra = ",";
            let arreglo = [];
            str = str.split("");
            str.map((n) => {
              if (n.toLowerCase() === letra) {
                arreglo.push(n);
              }
            });
            return arreglo.length;
          }
          User.counter(m.sender, { usage: 1 });
        }
        break
      // GAMES
      case "unlock":
        {
          if (!args[0]) return m.reply("Necesito la Key.");
          if (_unlock.includes(args[0])) {
            User.change(m.sender, { block: false });
            m.reply(
              `Usaste satisfactoriamente la Key *${args[0]}* para desbloquearte, sigue jugando y acumulando Keys.`
            );
          } else {
            m.reply("Sigue intentando :(");
          }
        }
        break;
      case "key":
        {
          if (!m.quoted && !args[0])
            return m.reply("Envia la key o respondela");
          teks = args[0] ? args[0] : m.quoted.text;
          if (isNaN(teks) || !Number.isInteger(Number(teks))) {
            m.reply("El formato de la key es invalido");
            return;
          }
          if (_unlock.includes(teks)) {
            return m.reply(`La Key ${teks} es válida para desbloqueo.`);
          }
          let keyData;
          if (_puntosMas.includes(teks)) {
            keyData = {
              points: 20,
              message: `La Key ${teks} es válida por +20 puntos.`,
            };
          } else if (_puntosMenos.includes(teks)) {
            keyData = {
              points: -20,
              message: `La Key ${teks} es válida por -20 puntos.`,
            };
          }
          if (keyData) {
            if (addUserKey(m.sender, teks) === false) {
              return m.reply(
                `La llave *[ ${teks} ]* ha alcanzado el límite máximo de usos`
              );
            }
            User.counter(m.sender, { cash: keyData.points });
            m.reply(keyData.message);
          } else {
            m.reply("Key no válida");
          }
        }
        break;
      // END GAMES
      case "antilink":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!m.isGroup) return m.reply(myLang("global").group);
          if (!isBotAdmins) return m.reply(myLang("global").botAdmin);
          if (!isAdmins) return m.reply(myLang("global").admin);
          if (args[0] === "on") {
            m.reply(myLang("antilink").on);
          } else if (args[0] === "off") {
            m.reply(myLang("antilink").off);
          } else {
            let buttons = [
              {
                buttonId: "antilink on",
                buttonText: { displayText: "ON" },
                type: 1,
              },
              {
                buttonId: "antilink off",
                buttonText: { displayText: "OFF" },
                type: 1,
              },
            ];
            await myBot.sendButtonText(
              m.chat,
              buttons,
              `MOD ANTILINK`,
              Config.BOT_NAME,
              m
            );
          }
          User.counter(m.sender, { usage: 1 });
        }
        break;
      // END GROUPS
      // FOR OWNER
      case "whatgroup":
        {
          if (!isCreator) return m.reply(myLang("global").owner);
          if (!text) return m.reply(myLang("own").join.link);
          if (!isUrl(args[0]) && !args[0].includes("whatsapp.com"))
            m.reply(myLang("own").join.link_err);
          myBot.sendReact(m.chat, "🕒", m.key);
          let result = args[0].split("https://chat.whatsapp.com/")[1];
          let code = await myBot.groupGetInviteInfo(result);
          try {
            pic = await myBot.profilePictureUrl(code.id, "image");
          } catch (e) {
            pic = global.thumb;
          }
          msg = `*Nombre:* ${code.subject}\n`;
          msg += `*Creador:* ${code.owner.split("@")[0]}\n`;
          msg += `*Tamaño:* ${code.size}\n`;
          msg += `*Desc:* ${code.desc || "El grupo no tiene descripción."}`;
          myBot.sendImage(m.chat, pic, msg);
          User.counter(m.sender, { usage: 1 });
        }
        break;
      case "py":
        {
          if (!isCreator) return m.reply(myLang("global").owner);
          if (!text) return m.reply("a quien voy a saludar?");
          const pythonProcess = await spawn("python", ["saludo.py"]);
          let pythonResponse = "";

          pythonProcess.stdout.on("data", function (data) {
            pythonResponse += data.toString();
          });
          pythonProcess.stdout.on("end", function () {
            m.reply(pythonResponse);
          });
          pythonProcess.stdin.write(text);
          pythonProcess.stdin.end();
          User.counter(m.sender, { usage: 1 });
        }
        break;

      default:
        if (budy.startsWith(">")) {
          if (!isCreator) return m.reply(myLang("global").owner);
          try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
            await m.reply(evaled);
          } catch (err) {
            await m.reply(String(err));
          }
        }

        if (budy.startsWith("$")) {
          if (!isCreator) return m.reply(myLang("global").owner);
          exec(budy.slice(2), (err, stdout) => {
            if (err) return m.reply(err);
            if (stdout) return m.reply(stdout);
          });
        }

        if (isCmd && budy.toLowerCase() != undefined) {
          if (m.chat.endsWith("broadcast")) return;
          if (m.isBaileys) return;
          let msgs = checkUser;
          if (!(budy.toLowerCase() in msgs)) return;
          myBot.copyNForward(m.chat, msgs[budy.toLowerCase()], true);
        }
    }*/

    await cmd.handler(m, {
      myLang,
      myBot,
      budy,
      isCmd,
      args,
      pushname,
      isCreator,
      command,
      prefix,
      q,
      text,
      mime,
      User,
      participants,
      regUser
    });
  } catch (err) {
    if (Config.LOG == "false") return;
    myBot.sendMessage(myBot.user.id, { text: `*-- ${myLang("err").msgReport} [ ${Config.BOT_NAME} ] --*\n` + "*Error:* ```" + err + "```"});
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  log(pint(`Update ${__filename}`, "orange."));
  delete require.cache[file];
  require(file);
});
