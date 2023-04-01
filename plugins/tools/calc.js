module.exports = {
  cmd: ['calc'],
  category: 'tools',
  desc: 'realiza operaciones matematicas.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, User}) {
    if (!text) return m.reply(myLang("calc").msg);
    let val = text
      .replace(/[^0-9\-+*\/().]/g, "")
      .replace(/(\d+\.\d+)|(\d+)/g, function(match) {
        return parseFloat(match);
      })
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π|pi/gi, "Math.PI")
      .replace(/e/gi, "Math.E");
    let format = val
      .replace(/Math\.PI/g, "π")
      .replace(/Math\.E/g, "e")
      .replace(/\//g, "÷")
      .replace(/\*×/g, "×");
    let result = new Function("return " + val)();
    result = parseFloat(result.toFixed(2));
    myBot.sendText(m.chat, `${format} = [ *${result}* ]`, m);
    User.counter(m.sender, { usage: 1 });
  }
};