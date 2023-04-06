let { pickRandom } = require("../../lib/myfunc");
module.exports = {
  cmd: ['ppt'],
  category: 'games',
  desc: 'juego piedra, papel, tijeras.',
  register: true,
  check: { pts: 0 },
  async handler(m, {text, prefix, command, User}) {
    if (!text) return m.reply(`Seleccione piedra/papel/tijera\n\n*Ejemplo:* ${prefix + command} piedra`);
    const choices = ["piedra", "papel", "tijera"];
    while (!choices.includes(text)) {
      return m.reply("Opción inválida. Elije: piedra, papel o tijera");
    }
    const computerChoice = pickRandom(choices)
    if (text === computerChoice) {
      m.reply(`EMPATE\nTu: ${text} -- 🤖: ${computerChoice}`);
      User.counter(m.sender, { usage: 1, cash: 10 });
    } else if (
        (text === "piedra" && computerChoice === "tijera") ||
        (text === "papel" && computerChoice === "piedra") ||
        (text === "tijera" && computerChoice === "papel")
      ) {
      m.reply(`🥳 *GANASTE 20 PUNTOS*\nTu: ${text} -- 🤖: ${computerChoice}`);
      User.counter(m.sender, { usage: 1, cash: 20 });
    } else {
      m.reply(`😭 *PERDISTE 20 PUNTOS*\nTu: ${text} -- 🤖: ${computerChoice}`);
      User.counter(m.sender, { usage: 1, cash: -20 });
    }
  }
};