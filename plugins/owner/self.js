module.exports = {
  cmd: ['self', 'public'],
  category: 'owner',
  desc: 'modo de uso del bot.',
  owner: true,
  check: { pts: null },
  async handler(m, {command, myBot, myLang}){
    if(command == "self") {
      myBot.public = false;
      m.reply(myLang("own").self);
    } else if(command == "public") {
      myBot.public = true;
      m.reply(myLang("own").public);
    }
  }
}