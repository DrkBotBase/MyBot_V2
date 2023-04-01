const axios = require("axios");
module.exports = {
  cmd: ['bin'],
  category: 'tools',
  desc: 'obten informacion sobre un bin.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, args, User}) {
    if (!args[0]) return m.reply(myLang("bin").msg);
    myBot.sendReact(m.chat, "🕒", m.key);
    await axios
      .get(`https://lookup.binlist.net/${args[0]}`)
      .then(async (response) => {
       json = response.data;
       msg = `💳 *BIN:* ${args[0]}\n`
       msg += " *TYPE:*\n"
       msg += `${json.scheme || 'not found'}\n`
       msg += `${json.type || 'not found'}\n`
       msg += `${json.brand || 'not found'}\n`
       msg += " *COUNTRY:*\n"
       msg += `${json.country.emoji || 'not found'} ${json.country.name || 'not found'}\n`
       msg += `${json.country.currency || 'not found'}\n`
      msg += " *BANK:*\n"
      msg += `${json.bank.name || 'Not Found'}`
      m.reply(msg)
    });
    User.counter(m.sender, { usage: 1 });
  }
};