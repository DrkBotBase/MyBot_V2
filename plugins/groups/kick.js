module.exports = {
  cmd: ['kick'],
  category: 'groups',
  desc: 'expulsa usuarios de un grupo.',
  register: true,
  group: true,
  admin: true,
  botAdmin: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, User}) {
    let users = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await myBot.groupParticipantsUpdate(m.chat, [users], "remove");
    m.reply(myLang("group").kick
        .replace("{}", users)
        .replace("@s.whatsapp.net", "")
    );
    User.counter(m.sender, { usage: 1 });
  }
};