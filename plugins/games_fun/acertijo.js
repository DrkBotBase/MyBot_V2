const fs = require("fs");
module.exports = {
  cmd: ['acertijo'],
  category: 'games',
  desc: 'juego de adivinanzas.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, prefix, quoted}) {
    let id = m.chat;
    let acertijos = JSON.parse(fs.readFileSync("./src/acertijo.json"));
    let json = acertijos[Math.floor(Math.random() * acertijos.length)]
    let cap = `*${json.question}*\n`
        cap += `*Tiempo:* 30 segundos`
    if (id in riddle) return m.reply("Todavía hay preguntas sin responder!")
    myBot.sendText(m.chat, cap, m).then(() => {
      riddle[id] = json.response.trim()
      console.log("Result: " + json.response.trim())
      setTimeout(() => {
        if (riddle.hasOwnProperty(id)) {
          m.reply("Tiempo Agotado.\nRespuesta: " + riddle[id])
          delete riddle[id]
        }
      }, 30000)
    })
  }
};