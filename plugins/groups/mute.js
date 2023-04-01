module.exports = {
  cmd: ['mute'],
  category: 'groups',
  desc: 'silencia un grupo.',
  register: true,
  group: true,
  admin: true,
  botAdmin: true,
  check: { pts: 0 },
  async handler(m, {myBot, args, User}) {
    if (args[0] === "on") {
      myBot.groupSettingUpdate(m.chat, "announcement");
      m.reply(myLang("mute").on.replace("{}", m.pushName || "No Name"));
    } else if (args[0] === "off") {
      myBot.groupSettingUpdate(m.chat, "not_announcement");
      m.reply(myLang("mute").off.replace("{}", m.pushName || "No Name"));
    } else {
      m.reply("on/off")
    }
    User.counter(m.sender, { usage: 1 });
  }
};