const axios = require("axios");
let Config = require("../../config");
let { getBuffer } = require("../../lib/myfunc");
module.exports = {
  cmd: ['dalle'],
  category: 'ia',
  desc: 'inteligencia artificial para descargar imagenes.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, User}) {
    if(!text) return m.reply("Que imagen deseas generar?");
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      //res = await getBuffer(`https://api.lolhuman.xyz/api/dall-e?apikey=${restKey}&text=${text}`)
      //myBot.sendImage(m.chat, res, Config.BOT_NAME)
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        "model": "image-alpha-001",
        "prompt": text,
        "num_images": 1,
        "size": "512x512",
        "response_format": "url"
      }, {
          headers: {
            'Authorization': `Bearer ${Config.OPEN_AI_KEY}`
          }
      });
      await myBot.sendImage(m.chat, response.data.data[0].url, Config.BOT_NAME)
      User.counter(m.sender, { usage: 1 });
    } catch {
      m.reply(myLang("global").err);
    }
  }
};