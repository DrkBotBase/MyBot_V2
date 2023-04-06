let { BOT_NAME } = require("../../config");
module.exports = {
  cmd: ['love'],
  category: 'games',
  desc: 'formar parejas.',
  register: true,
  group: true,
  check: { pts: 0 },
  async handler(m, {myBot, participants, User}) {
    let member = participants.map((u) => u.id);
    let me = m.sender;
    let rnd = member[Math.floor(Math.random() * member.length)];
    let jawab = `👫 \n@${me.split("@")[0]} ❤️ @${rnd.split("@")[0]}`;
    let ments = [me, rnd];
    await myBot.sendText(m.chat, `${jawab}\n${BOT_NAME}`, m,
      { mentions: ments }
    );
    User.counter(m.sender, { usage: 1 });
  }
};