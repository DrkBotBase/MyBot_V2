const fs = require("fs");
const { removeBackgroundFromImageFile } = require("remove.bg");
let { getRandom } = require("../../lib/myfunc");
module.exports = {
  cmd: ['removebg'],
  owner: true,
  ignored: true,
  category: 'tools',
  desc: 'remueve fondo a imagenes.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, mime, prefix, command, User}) {
    if(!/image/.test(mime)) return m.reply(myLang("removebg").msg.replace("{}", prefix + command));
    let keyBg = ["HBbdxnge4BVXJwqhcAHqVC", "uHUYM1Wo4QcrFsqGbWoMr2zi", "qySfrLUKRQejaMoJ54LHpShB"];
    let apinobg = keyBg[Math.floor(Math.random() * keyBg.length)];
    hmm = (await "./src/remobg-") + getRandom("");
    localFile = await myBot.downloadAndSaveMediaMessage(m.quoted, hmm);
    outputFile = (await "./src/hremo-") + getRandom(".png");
    myBot.sendReact(m.chat, "🕒", m.key);
    removeBackgroundFromImageFile({
      path: localFile,
      apiKey: apinobg,
      size: "regular",
      type: "auto",
      scale: "100%",
      outputFile,
    }).then(async (result) => {
      myBot.sendMessage(m.chat, {
        image: fs.readFileSync(outputFile),
        caption: myLang("global").by.replace("{}", botName),
      }, { quoted: m });
      User.counter(m.sender, { usage: 1 });
      await fs.unlinkSync(localFile);
      await fs.unlinkSync(outputFile);
    }).catch((error) => {
      fs.unlinkSync(localFile);
      if (error[0].code === "insufficient_credits") {
        m.reply(myLang("removebg").err);
        myBot.sendText(global.owner + "@s.whatsapp.net","Cambiar ApiKey removebg!");
      }
    });
  }
};