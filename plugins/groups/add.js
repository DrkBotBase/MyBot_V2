module.exports = {
  cmd: ['add'],
  category: 'groups',
  desc: 'añade usuarios a un grupo.',
  register: true,
  group: true,
  admin: true,
  botAdmin: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, User}) {
    let users = m.quoted
      ? m.quoted.sender
      : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await myBot.groupParticipantsUpdate(m.chat, [users], "add");
    m.reply(myLang("group").add
        .replace("{}", users)
        .replace("@s.whatsapp.net", "")
    );
    User.counter(m.sender, { usage: 1 });
  }
};