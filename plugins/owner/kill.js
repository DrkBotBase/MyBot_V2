module.exports = {
  cmd: ['kill'],
  category: 'owner',
  desc: 'restringe el uso del bot a usuarios.',
  owner: true,
  check: { pts: null },
  async handler(m, {args, User}) {
    if (args[0] === "add") {
      User.change(args[1] + "@s.whatsapp.net", { block: true });
    } else if (args[0] === "del") {
      User.change(args[1] + "@s.whatsapp.net", { block: false });
    } else {
      m.reply("add/del")
    }
  }
};
