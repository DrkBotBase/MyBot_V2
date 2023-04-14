let Config = require("../../config");
let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: ['gpt'],
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

      const { Configuration, OpenAIApi } = require("openai");
      const configuration = new Configuration({
        apiKey: Config.OPEN_AI_KEY || console.log('Err ApikEy'),
      });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.5,
        max_tokens: 500,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["AI:"],
      });
      myBot.sendMessage(m.chat, {
        text: response.data.choices[0].text.trim()
      }, { quoted: m });
      User.counter(m.sender, { usage: 1 });
  }
};
