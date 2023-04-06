let { BOT_NAME } = require("../../config");
let { pickRandom } = require("../../lib/myfunc");
module.exports = {
  cmd: ['dados'],
  category: 'games',
  desc: 'juego de dados.',
  register: true,
  check: { pts: null },
  async handler(m, {myBot, User}) {
    let da = [
      "./src/media/1.webp",
      "./src/media/2.webp",
      "./src/media/3.webp",
      "./src/media/4.webp",
      "./src/media/5.webp",
      "./src/media/6.webp",
    ];
    let res = pickRandom(da);
    if (res === "./src/media/1.webp") {
      await myBot.sendMedia(m.chat, res, "Number 1", BOT_NAME, m, {
        asSticker: true,
      });
      User.counter(m.sender, { usage: 1, cash: 2 });
    } else if (res === "./src/media/2.webp") {
      await myBot.sendMedia(m.chat, res, "Number 2", BOT_NAME, m, {
        asSticker: true,
      });
      User.counter(m.sender, { usage: 1, cash: 4 });
    } else if (res === "./src/media/3.webp") {
      await myBot.sendMedia(m.chat, res, "Number 3", BOT_NAME, m, {
        asSticker: true,
      });
      User.counter(m.sender, { usage: 1, cash: 6 });
    } else if (res === "./src/media/4.webp") {
      await myBot.sendMedia(m.chat, res, "Number 4", BOT_NAME, m, {
        asSticker: true,
      });
      User.counter(m.sender, { usage: 1, cash: 8 });
    } else if (res === "./src/media/5.webp") {
      await myBot.sendMedia(m.chat, res, "Number 5", BOT_NAME, m, {
        asSticker: true,
      });
      User.counter(m.sender, { usage: 1, cash: 10 });
    } else if (res === "./src/media/6.webp") {
      await myBot.sendMedia(m.chat, res, "Number 6", BOT_NAME, m, {
        asSticker: true,
      });
      User.counter(m.sender, { usage: 1, cash: 12 });
    }
  }
};