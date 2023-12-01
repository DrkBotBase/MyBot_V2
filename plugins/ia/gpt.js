const { Configuration, OpenAIApi } = require("openai");
let Config = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['gpt'],
  ignored: true,
  owner: true,
  category: 'ia',
  desc: 'inteligencia artificial que te puede ayudar con cualquier tema.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, command, text, mime, User}) {
    if(!text) return m.reply(myLang("ia").gpt_msg)
    /*try {
      myBot.sendReact(m.chat, "🕒", m.key);
      let { status, result } = await fetchJson(`https://api.lolhuman.xyz/api/openai?apikey=${restKey}&text=${text}&user=${m.sender}`)
      if(status !== 200) return m.reply(myLang("global").err);
      m.reply("🤖 " + result);
    } catch {}*/
      msg = "Ingrese un texto..";
      if (/audio/.test(mime)) return m.reply(msg);
      if (/image/.test(mime)) return m.reply(msg);
      if (/video/.test(mime)) return m.reply(msg);
      if (!text) return m.reply(myLang("ia").gpt_msg);
      myBot.sendReact(m.chat, "🕒", m.key);

      const configuration = new Configuration({
        apiKey: Config.OPEN_AI_KEY || console.log('Err ApikEy'),
      });
      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "assistant", 
          content: `Eres un asistente experto en todas las materias, profundiza y da respuestas claras y concretas de cada pregunta que te hagan. ${text}`
        }],
      });
      myBot.sendMessage(m.chat, {
        text: response.data.choices[0].message.content.trim()
      }, { quoted: m });
      User.counter(m.sender, { usage: 1 });
  }
};
