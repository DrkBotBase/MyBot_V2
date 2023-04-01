module.exports = {
  cmd: ['demote'],
  category: 'groups',
  desc: 'remueve admin a un usuario.',
  register: true,
  group: true,
  admin: true,
  botAdmin: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, prefix, User}) {
    let users = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (users.replace(/\D/g, "") == "")
			return await myBot.sendText(m.chat, `Example: ${prefix}demote @0`, m, {
				mentions: ["0@s.whatsapp.net"],
			});
    await myBot.groupParticipantsUpdate(m.chat, [users], "demote");
    m.reply(myLang("group").prom
      .replace("{}", users)
      .replace("@s.whatsapp.net", "")
    );
    User.counter(m.sender, { usage: 1 });
  }
};