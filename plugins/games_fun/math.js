let { genMath, modes } = require('../../src/math')
let { sleep } = require("../../lib/myfunc");
module.exports = {
  cmd: ['math'],
  category: 'games',
  desc: 'juego de matematicas.',
  ignored: true,
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, prefix}) {
    let id = m.chat
    if (kuismath.hasOwnProperty(id)) return m.reply("Todavía hay sesiones sin terminar!")
    if (!text) return m.reply(`Mode: ${Object.keys(modes).join(' | ')}\nEjemplo: ${prefix}math medium`)
    let result = await genMath(text.toLowerCase())
    myBot.sendText(m.chat, `*¿Cuál es el resultado de: ${result.soal.toLowerCase()}*?\n\nTiempo: ${(result.waktu / 1000)} segundos`, m).then(() => {
      kuismath[id] = result.jawaban
      console.log("Respuesta: " + result.jawaban)
      setTimeout(() => {
        if (kuismath.hasOwnProperty(id)) {
          m.reply("Tiempo Agotado.\nRespuesta: " + kuismath[id])
          delete kuismath[id]
        }
      }, result.waktu);
    })
  }
};