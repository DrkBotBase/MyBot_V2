let { pickRandom, sleep } = require("../../lib/myfunc");
module.exports = {
  cmd: ['slot'],
  category: 'games',
  desc: 'juego de casino.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, User}) {
    const suits = ["💎", "♠️", "♣️", "❤️", "💤"];
    let d = "",
    r = "",
    k = "";
    for (let i = 0; i < 9; i++) {
      let suit = pickRandom(suits)
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
      myBot.sendMessage(m.chat, {
        text: slt(d, r, k, "😭 *PERDISTE 20 PUNTOS*")
      }, { quoted: m });
      await sleep(2000);
      myBot.sendMessage(m.sender,{
        text: pickRandom(keysAll)
      }, { quoted: m });
    }
  }
};