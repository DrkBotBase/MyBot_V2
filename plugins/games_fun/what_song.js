const fs = require("fs");
let { sleep } = require("../../lib/myfunc");
module.exports = {
  cmd: ['cancion'],
  category: 'games',
  desc: 'juego de adivina la canción.',
  ignored: true,
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, prefix}) {
    let id = m.chat;
    let canciones = JSON.parse(fs.readFileSync("./src/canciones.json"));
    let json = canciones[Math.floor(Math.random() * canciones.length)]
    let cap = `*Adivina el titulo de está canción*\n`
        cap += `*Tiempo:* 60 segundos\n\n`
        cap += `Escribe ${prefix}pista para obtener una pista.`
    if (what_song.hasOwnProperty(id)) return m.reply("Todavía hay canciones sin responder!")
    m.reply(cap)
    myBot.sendMessage(m.chat, {
      audio: { url: json.link_song },
      mimetype: "audio/mpeg"
    }, { quoted: m }).then(() => {
      what_song[id] = json.answer
      console.log("Result: " + json.answer)
      setTimeout(() => {
        if (what_song.hasOwnProperty(id)) {
          m.reply("Tiempo Agotado.\nRespuesta: " + what_song[id].toLowerCase())
          delete what_song[id]
        }
      }, 60000);
    })
  }
};
