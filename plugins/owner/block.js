let { jsonformat } = require("../../lib/myfunc");
module.exports = {
  cmd: ['block', 'unblock'],
  category: 'owner',
  desc: 'bloquear y desbloquear usuarios.',
  owner: true,
  check: { pts: null },
  async handler(m, {command, text}) {
    if(command == "block") {
      let users = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      await myBot
        .updateBlockStatus(users, "block")
        .then((res) => m.reply(jsonformat(res)))
        .catch((err) => m.reply(jsonformat(err)));
    } else if( command == "unblock") {
      let users = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      await myBot
        .updateBlockStatus(users, "unblock")
        .then((res) => m.reply(jsonformat(res)))
        .catch((err) => m.reply(jsonformat(err)));
    }
  }
};