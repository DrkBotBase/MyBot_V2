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
  areJidsSameUser,
  generateWAMessageFromContent,
  MessageType,
} = require("@adiwajshing/baileys");
const fs = require("fs");

const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const path = require("path");
const {
  sleep,
  isUrl,
  fetchJson,
  jsonformat,
  parseMention,
  getRandom,
  pickRandom,
  modifyLetter,
} = require("./lib/myfunc");
const { log, pint, bgPint } = require("./lib/colores");
const Config = require("./config");

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
    
const cmd = Object.values(attr.commands).find((cmn) => cmn.cmd && cmn.cmd.includes(command) && !cmn.disabled)
  if(!cmd) return
  if (cmd.owner && !isCreator) return m.reply(myLang("global").owner);
  else if (cmd.register && !regUser) return m.reply(myLang("global").noReg.replace("{}", prefix));
  else if(checkUser.block == true) return m.reply("Estas Bloqueado.");
  else if (checkUser.points < cmd.check.pts ) {
    if(!isCreator) return m.reply(myLang('ia').gpt_no_points.replace("{}", cmd.check.pts - checkUser.points)) }
  else if(cmd.group && !m.isGroup) return m.reply(myLang("global").group);
  else if(cmd.isPrivate && m.isGroup) return m.reply(myLang("global").private);
  else if(cmd.admin && !isAdmins) return m.reply(myLang("global").admin);
  else if(cmd.botAdmin && !isBotAdmins) return m.reply(myLang("global").botAdmin);
const exports = {
  myLang,
  myBot,
  body,
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
  participants
};

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

    this.game = this.game ? this.game : {};
    let room = Object.values(this.game).find(
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
        delete this.game[room.id];
      }
    }

    // ACERTIJO
    let similarity = require("similarity");
    let threshold = 0.72;
    /*id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^ⷮ/i.test(m.quoted.text)) return !0
    this.mstekateki = this.mstekateki ? this.mstekateki : {}
    if (!(id in this.mstekateki)) return m.reply('Ese acertijo ya ha terminado!')
    if (m.quoted.id == this.mstekateki[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.mstekateki[id][1]))
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.response.toLowerCase().trim()) {
            m.reply(`*Respuesta correcta!*`)
            clearTimeout(this.tekateki[id][2])
            delete this.mstekateki[id]
        } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold) m.reply(`Casi lo logras!`)
        else m.reply('Respuesta incorrecta!')
    }*/

    // ======== INICIO COMANDOS ========
    /*switch (command) {
      // ======== REGISTRO DB ========
      case "reg":
        {
          if (m.isGroup) return m.reply(myLang("reg").msg);
          if (regUser === true) return m.reply(myLang("reg").check);
          new User(m.sender, pushname);
          m.reply(myLang("reg").ok);
        }
        break;
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
      case "menu":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          users = await Object.keys(db).map((i) => db[i].phone)
          anu = menu(prefix, pushname, users.length, totalHit());
          linkS = [
            "https://youtu.be/13aBcRrL0oE",
            "https://youtu.be/e-fA-gBCkj0",
            "https://youtu.be/CQLsdm1ZYAw",
            "https://youtu.be/Bznxx12Ptl0",
            "https://youtu.be/u9LH_y159sg",
            "https://youtu.be/HhjHYkPQ8F0",
            "https://youtu.be/nPvuNsRccVw",
            "https://youtu.be/KRaWnd3LJfs",
            "https://youtu.be/KBtk5FUeJbk",
            "https://youtu.be/ZaflNU45bVY",
            "https://youtu.be/D9G1VOjN_84",
          ];
          let enlace = {
            contextInfo: {
              externalAdReply: {
                title: "MUSICA SELECCIONADA",
                body: "Link :)",
                sourceUrl: linkS[Math.floor(linkS.length * Math.random())],
                showAdAttribution: false,
                thumbnail: global.miniRobot,
              },
            },
          };
          if (global.typeMenu === "image") {
            myBot.sendImage(m.chat, anu, m);
          } else if (global.typeMenu === "template") {
            myBot.send5ButImg(
              m.chat,
              anu,
              Config.BOT_NAME,
              global.thumb,
              butTemplate
            );
          } else if (global.typeMenu === "location") {
            myBot.sendButtonLoc(
              m.chat,
              global.thumb,
              anu,
              Config.BOT_NAME,
              "REGLAS",
              "rules"
            );
          }
          User.counter(m.sender, { usage: 1 });
        }
        break;
      // CONVERTER
      case "bass":
      case "blown":
      case "deep":
      case "earrape":
      case "fast":
      case "fat":
      case "nightcore":
      case "reverse":
      case "robot":
      case "slow":
      case "smooth":
      case "tupai":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          myBot.sendReact(m.chat, "🕒", m.key);
          try {
            let set;
            if (/bass/.test(command))
              set = "-af equalizer=f=54:width_type=o:width=2:g=20";
            if (/blown/.test(command)) set = "-af acrusher=.1:1:64:0:log";
            if (/deep/.test(command)) set = "-af atempo=4/4,asetrate=44500*2/3";
            if (/earrape/.test(command)) set = "-af volume=12";
            if (/fast/.test(command))
              set = '-filter:a "atempo=1.63,asetrate=44100"';
            if (/fat/.test(command))
              set = '-filter:a "atempo=1.6,asetrate=22100"';
            if (/nightcore/.test(command))
              set = "-filter:a atempo=1.06,asetrate=44100*1.25";
            if (/reverse/.test(command)) set = '-filter_complex "areverse"';
            if (/robot/.test(command))
              set =
                "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\"";
            if (/slow/.test(command))
              set = '-filter:a "atempo=0.7,asetrate=44100"';
            if (/smooth/.test(command))
              set =
                "-filter:v \"minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'\"";
            if (/tupai/.test(command))
              set = '-filter:a "atempo=0.5,asetrate=65100"';
            if (/audio/.test(mime)) {
              let media = await myBot.downloadAndSaveMediaMessage(quoted);
              let ran = getRandom(".mp3");
              exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
                fs.unlinkSync(media);
                if (err) return m.reply(err);
                let buff = fs.readFileSync(ran);
                myBot.sendMessage(
                  m.chat,
                  { audio: buff, mimetype: "audio/mpeg" },
                  { quoted: m }
                );
                User.counter(m.sender, { usage: 1 });
                fs.unlinkSync(ran);
              });
            } else m.reply(myLang("voz_modify").msg);
          } catch (e) {
            throw e;
          }
        }
        break;
      // DOWNLOADS
      case "yts":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!text) return m.reply(myLang("yts").msg.replace("{}", prefix + command));
          myBot.sendReact(m.chat, "🕒", m.key);
          try {
            const yts = await fetchJson(`https://api.dhamzxploit.my.id/api/ytsearch?q=${text}`)
            let teks = text + "\n\n";
            yts.result.map((i) => {
              teks += `
╭━━━━━━━━━━⬣
*${i.title}*
📌 *Link:* ${i.url}
🕒 *Duracion:* ${i.timestamp}
📈 *Vistas:* ${i.views}
╰━━━━━━━━━━⬣`}).join("\n")
            myBot.sendImage(m.chat, yts.result[0].thumbnail, teks);
            User.counter(m.sender, { usage: 1 });
          } catch (e) {
            throw e;
            m.reply(myLang("global").err);
          }
        }
        break;
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
      case "gpt":
        {
          //myBot.sendMessage(m.chat, {react: {text: '🚧', key: m.key}})
          //return myBot.sendImage(m.chat, global.maintenance, '⚠️', m)
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (checkUser.points < 3000) return m.reply(myLang("ia").gpt_no_points.replace("{}", 3000 - checkUser.points));

          msg = "Ingrese o responda solo texto.";
          if (/audio/.test(mime)) return m.reply(msg);
          if (/image/.test(mime)) return m.reply(msg);
          if (/video/.test(mime)) return m.reply(msg);
          if (!m.quoted && !text) return m.reply(myLang("ia").gpt_msg);

          myBot.sendReact(m.chat, "🕒", m.key);
          try {
            const { Configuration, OpenAIApi } = require("openai");

            const configuration = new Configuration({
              apiKey: Config.OPEN_AI_KEY || log('Err ApikEy'),
            });
            const openai = new OpenAIApi(configuration);

            const response = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: text ? text : m.quoted.text,
              temperature: 0.5,
              max_tokens: 500,
              top_p: 1.0,
              frequency_penalty: 0.5,
              presence_penalty: 0.0,
              stop: ["You:"],
            });
            myBot.sendMessage(
              m.chat,
              { text: response.data.choices[0].text.trim() },
              { quoted: m }
            );
            User.counter(m.sender, { usage: 1 });
          } catch (e) {
            log(e)
            m.reply(myLang("global").msg.err);
          }
        }
        break;
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
      case "dados":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          let da = [
            "./src/media/1.webp",
            "./src/media/2.webp",
            "./src/media/3.webp",
            "./src/media/4.webp",
            "./src/media/5.webp",
            "./src/media/6.webp",
          ];
          let res = pickRandom(da);
          if (res === "./src/media/1.webp") {
            await myBot.sendMedia(m.chat, res, "Bot", "MD", m, {
              asSticker: true,
            });
            User.counter(m.sender, { usage: 1, cash: 2 });
          } else if (res === "./src/media/2.webp") {
            await myBot.sendMedia(m.chat, res, "Bot", "MD", m, {
              asSticker: true,
            });
            User.counter(m.sender, { usage: 1, cash: 4 });
          } else if (res === "./src/media/3.webp") {
            await myBot.sendMedia(m.chat, res, "Bot", "MD", m, {
              asSticker: true,
            });
            User.counter(m.sender, { usage: 1, cash: 6 });
          } else if (res === "./src/media/4.webp") {
            await myBot.sendMedia(m.chat, res, "Bot", "MD", m, {
              asSticker: true,
            });
            User.counter(m.sender, { usage: 1, cash: 8 });
          } else if (res === "./src/media/5.webp") {
            await myBot.sendMedia(m.chat, res, "Bot", "MD", m, {
              asSticker: true,
            });
            User.counter(m.sender, { usage: 1, cash: 10 });
          } else if (res === "./src/media/6.webp") {
            await myBot.sendMedia(m.chat, res, "Bot", "MD", m, {
              asSticker: true,
            });
            User.counter(m.sender, { usage: 1, cash: 12 });
          }
        }
        break;
      case "ppt":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!text)
            return m.reply(
              `Seleccione piedra/papel/tijera\n\nEjemplo : *${
                prefix + command
              }* piedra`
            );
          const choices = ["piedra", "papel", "tijera"];
          while (!choices.includes(text)) {
            return m.reply("Opción inválida. Elije: piedra, papel o tijera");
          }
          const computerChoice =
            choices[Math.floor(Math.random() * choices.length)];
          if (text === computerChoice) {
            m.reply(`EMPATE\nTu: ${text} -- 🤖: ${computerChoice}`);
            User.counter(m.sender, { usage: 1, cash: 10 });
          } else if (
            (text === "piedra" && computerChoice === "tijera") ||
            (text === "papel" && computerChoice === "piedra") ||
            (text === "tijera" && computerChoice === "papel")
          ) {
            m.reply(
              `🥳 *GANASTE 20 PUNTOS*\nTu: ${text} -- 🤖: ${computerChoice}`
            );
            User.counter(m.sender, { usage: 1, cash: 20 });
          } else {
            m.reply(
              `😭 *PERDISTE 20 PUNTOS*\nTu: ${text} -- 🤖: ${computerChoice}`
            );
            User.counter(m.sender, { usage: 1, cash: -20 });
          }
        }
        break;
      case "slot":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          const suits = ["💎", "♠️", "♣️", "❤️", "💤"];
          let d = "",
            r = "",
            k = "";
          for (let i = 0; i < 9; i++) {
            let suit = suits[Math.floor(Math.random() * suits.length)];
            if (i < 3) {
              d += ` ${suit} `;
            } else if (i < 6) {
              r += ` ${suit} `;
            } else {
              k += ` ${suit} `;
            }
          }
          const slt = (lineA, lineB, lineC, msg) => {
            return `${msg}
──────
${lineA}
${lineB}
${lineC}
──────
🔮𝉃𝜄𝜐𝉃𝜍𝜅𝉃𝛾🔮`;
          };
          picas = " ♠️  ♠️  ♠️ ";
          diamond = " 💎  💎  💎 ";
          heart = " ❤️  ❤️  ❤️ ";
          clover = " ♣️  ♣️  ♣️ ";
          zzz = " 💤  💤  💤 ";
          if (d == picas || r == picas || k == picas) {
            User.counter(m.sender, { usage: 1, cash: 50 });
            myBot.sendText(m.chat, slt(d, r, k, "🥳 *GANASTE 50 PUNTOS*"), m);
          } else if (d == diamond || r == diamond || k == diamond) {
            User.counter(m.sender, { usage: 1, cash: 100 });
            myBot.sendText(m.chat, slt(d, r, k, "🥳 *GANASTE 100 PUNTOS*"), m);
          } else if (d == heart || r == heart || k == heart) {
            User.counter(m.sender, { usage: 1, cash: 20 });
            myBot.sendText(m.chat, slt(d, r, k, "🥳 *GANASTE 20 PUNTOS*"), m);
          } else if (d == clover || r == clover || k == clover) {
            User.counter(m.sender, { usage: 1, cash: 20 });
            myBot.sendText(m.chat, slt(d, r, k, "🥳 *GANASTE 20 PUNTOS*"), m);
          } else if (d == zzz || r == zzz || k == zzz) {
            myBot.sendText(m.chat, slt(d, r, k, "🥶 *BLOQUEADO*"), m);
            User.change(m.sender, { block: true });
          } else {
            User.counter(m.sender, { usage: 1, cash: -20 });
            myBot.sendMessage(
              m.chat,
              { text: slt(d, r, k, "😭 *PERDISTE 20 PUNTOS*") },
              { quoted: m }
            );
            await sleep(2000);
            myBot.sendMessage(
              m.sender,
              { text: pickRandom(keysAll) },
              { quoted: m }
            );
          }
        }
        break;
      case "ttt":
        {
          if (!m.isGroup) return m.reply(myLang("global").group);
          if (!text) return m.reply("Necesitas un nombre para la sala.");
          let TicTacToe = require("./lib/tictactoe");
          this.game = this.game ? this.game : {};
          if (
            Object.values(this.game).find(
              (room) =>
                room.id.startsWith("tictactoe") &&
                [room.game.playerX, room.game.playerO].includes(m.sender)
            )
          )
            return m.reply("Todavía estás en un juego.");
          let room = Object.values(this.game).find(
            (room) =>
              room.state === "WAITING" && (text ? room.name === text : true)
          );
          if (room) {
            //m.reply('Contrincante encontrado!')
            room.o = m.chat;
            room.game.playerO = m.sender;
            room.state = "PLAYING";
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
            let str = `Sala ID: ${room.id}

${BOX.iniM.replace("{}", "JUGADORES")}
❌: @${room.game.playerX.split("@")[0]}
⭕: @${room.game.playerO.split("@")[0]}
${BOX.end}

${arr.slice(0, 3).join("")}
${arr.slice(3, 6).join("")}
${arr.slice(6).join("")}

Turno de *@${room.game.currentTurn.split("@")[0]}*

Escriba *rendirse* para admitir la derrota.`;
            if (room.x !== room.o)
              await myBot.sendText(room.x, str, m, {
                mentions: parseMention(str),
              });
            await myBot.sendText(room.o, str, m, {
              mentions: parseMention(str),
            });
          } else {
            room = {
              id: "tictactoe-" + +new Date(),
              x: m.chat,
              o: "",
              game: new TicTacToe(m.sender, "o"),
              state: "WAITING",
            };
            if (text) room.name = text;
            //m.reply('Esperando contrincante\n\n' + (text ? `Para aceptar el reto escriba: *${prefix}${command} ${text}*` : ''))
            imgLogo =
              "https://store-images.s-microsoft.com/image/apps.2005.14057826194083709.67242c47-4fd7-4f1a-9dd6-5d93f6cc10df.f80f14c0-72ab-46ff-86cd-9d801c8e04e8?mode=scale&q=90&h=300&w=300";
            anu = `Esperando contrincante.\n\nPara aceptar reto toca el boton de abajo.`;
            myBot.sendButtonLoc(
              m.chat,
              imgLogo,
              anu,
              "Juego TicTacToe",
              "ACEPTAR JUEGO",
              `${prefix}${command} ${text}`
            );
            this.game[room.id] = room;
          }
        }
        break;
      case "delttt":
        {
          this.game = this.game ? this.game : {};
          try {
            if (this.game) {
              delete this.game;
              myBot.sendText(
                m.chat,
                "Sesión de TicTacToe eliminada con éxito",
                m
              );
            } else if (!this.game) {
              m.reply("No hay session activa.");
            } else return m.reply("?");
          } catch (e) {
            m.reply("Tenemos un error.");
          }
        }
        break;
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
      case "gay":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!m.isGroup) return m.reply(myLang("global").group);
          let ment = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? myBot.user.jid : m.sender
          let userName = myBot.getName(ment)
          await myBot.sendMessage(
            m.chat,
            {
              video: fs.readFileSync("./src/media/gay.mp4"),
              caption: myLang("gay")
                .msg.replace("{}", userName)
                .replace("{}", Math.floor(100 * Math.random())),
              gifPlayback: true,
              mentions: ment,
            },
            { quoted: m }
          );
          User.counter(m.sender, { usage: 1 });
        }
        break;
      case "love":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!m.isGroup) return m.reply(myLang("global").group);
          let member = participants.map((u) => u.id);
          let me = m.sender;
          let rnd = member[Math.floor(Math.random() * member.length)];
          let jawab = `👫 \n@${me.split("@")[0]} ❤️ @${rnd.split("@")[0]}`;
          let ments = [me, rnd];
          let buttons = [
            { buttonId: "love", buttonText: { displayText: "👩‍❤️‍👨" }, type: 1 },
          ];
          await myBot.sendButtonText(
            m.chat,
            buttons,
            jawab,
            Config.BOT_NAME,
            m,
            { mentions: ments }
          );
          User.counter(m.sender, { usage: 1 });
        }
        break;
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
      case "groupinfo":
        {
          if (regUser === false) return m.reply(myLang("global").noReg.replace("{}", prefix));
          if (checkUser.block === true) return m.reply("Estas Bloqueado.");
          if (checkUser.points <= 0) return m.reply(myLang("global").no_points);
          if (!m.isGroup) return m.reply(myLang("global").group);
          if (!isBotAdmins) return m.reply(myLang("global").botAdmin);
          
          await myBot.sendButton(
            m.chat,
            " ",
            anu,
            pp,
            [["𝗠 𝗘 𝗡 𝗨", "menu"]],
            m,
            { mentions: [...groupAdmins.map((v) => v.id), owner] }
          );
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
      case "test":
        {
          if (!isCreator) return m.reply(myLang("global").owner);
          miLog = await myBot.sendMessageModify(m.chat, "mi mensaje", null, {
                    title: 'Grupo Oficial', largeThumb: true, thumbnail: thumb, url: 'https://chat.whatsapp.com/GxjXaj3SxNDAWh8oMQ5bkg'
                  })
          log(miLog)
          log(m.chat)
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
    await cmd.handler(m, exports);
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
