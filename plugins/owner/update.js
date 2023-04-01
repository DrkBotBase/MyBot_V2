const simpleGit = require("simple-git");
const git = simpleGit();
const { exec } = require("child_process");
let Config = require("../../config");
module.exports = {
  cmd: ['update'],
  category: 'owner',
  desc: 'actualiza el bot directamente desde su repositorio.',
  owner: true,
  check: { pts: null },
  async handler(m, {myBot, args, myLang}) {
    if(args[0] == "now") {
      await git.fetch();
      let commits = await git.log([
        Config.BRANCH + "..origin/" + Config.BRANCH,
      ]);
      if (commits.total === 0) {
        myBot.sendMessage(m.chat, { text: myLang("updater").UPDATE });
      } else {
        git.pull(async (err, update) => {
          if (update && update.summary.changes) {
            myBot.sendMessage(m.chat, {text: myLang("updater").UPDATED_LOCAL});
            exec("npm install").stderr.pipe(process.stderr);
          } else if (err) {
            myBot.sendMessage(m.chat, {text: "*Error:*\n```" + err + "```"});
          }
        });
      }
    } else {
      await git.fetch();
      let commits = await git.log([
        Config.BRANCH + "..origin/" + Config.BRANCH,
      ]);
      if (commits.total === 0) {
        myBot.sendMessage(m.chat, { text: myLang("updater").UPDATE });
      } else {
        let degisiklikler = myLang("updater").NEW_UPDATE;
        commits["all"].map((commit) => {
          degisiklikler += "🔸 [" + commit.date.substring(0, 10) + "]: " +
          commit.message + " <" + commit.author_name + ">\n";
        });
        myBot.sendMessage(m.chat, { text: degisiklikler + "```" });
      }
    }
  }
};