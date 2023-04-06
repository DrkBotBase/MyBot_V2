let TicTacToe = require("../../lib/tictactoe");
let { parseMention } = require("../../lib/myfunc");
module.exports = {
  cmd: ['ttt'],
  category: 'games',
  desc: 'juego TicTacToe.',
  register: true,
  group: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, prefix, command}) {
    if (!text) return m.reply("Necesitas un nombre para la sala.");
    if (Object.values(t_t_t)
      .find((room) => room.id.startsWith("tictactoe") &&
        [room.game.playerX, room.game.playerO].includes(m.sender)
    )) return m.reply("Todavía estás en un juego.");
    let room = Object.values(t_t_t)
      .find((room) => room.state === "WAITING" &&
      (text ? room.name === text : true));
    if (room) {
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
      anu = 'Esperando contrincante\n\n' + (text ? `Para aceptar el reto escriba: *${prefix}${command} ${text}*` : '')
      //anu = `Esperando contrincante.\n\nPara aceptar reto toca el boton de abajo.`;
      imgLogo = "https://store-images.s-microsoft.com/image/apps.2005.14057826194083709.67242c47-4fd7-4f1a-9dd6-5d93f6cc10df.f80f14c0-72ab-46ff-86cd-9d801c8e04e8?mode=scale&q=90&h=300&w=300";
      myBot.sendImage(m.chat, imgLogo, anu)
      /*mBot.sendButtonLoc(m.chat, imgLogo, anu,
          "Juego TicTacToe", "ACEPTAR JUEGO",
          `${prefix}${command} ${text}`
      );*/
      t_t_t[room.id] = room;
    }
  }
};