module.exports = {
  cmd: ['reg'],
  ignored: true,
  check: { pts: null },
  async handler(m, {budy, myLang, pushname, User, regUser}) {
    if (budy) {
        if (regUser === false) {
          new User(m.sender, pushname);
        }
      }
    m.reply(myLang("reg").ok);
  }
};