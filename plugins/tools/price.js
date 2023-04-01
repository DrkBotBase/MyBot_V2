const axios = require('axios');
module.exports = {
  cmd: ['price'],
  category: 'tools',
  desc: 'obten precio de criptomonedas.',
  register: true,
  check: { pts: 0 },
  async handler(m, {text, User}) {
    if (!text) return m.reply("Token?");
    key = "1be6e707f54766812254c65612a60298080cf7b26c2ef6ea9e6ea0b0b11b8890";
    if (!key) throw m.reply("Falta la key!");
    await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${text.toLowerCase()}&tsyms=USD,COP&api_key={${key}}`)
      .then(async (response) => {
        var { USD, COP } = response.data;
        var msg = `*Token:* ${text.toUpperCase()}\n\n*USD:* ${USD}\n*COP:* ${COP}`;
        m.reply(msg);
      });
    User.counter(m.sender, { usage: 1 });
  }
};