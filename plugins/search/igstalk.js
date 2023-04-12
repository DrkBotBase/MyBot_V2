const axios = require('axios');
const cheerio = require('cheerio');
let Config = require("../../config");
module.exports = {
  cmd: ['igstalk', 'igstalk2'],
  category: 'search',
  desc: 'obten informacion de usuarios de instagram.',
  register: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang, text, User, command}) {
    if (!text) return m.reply("Necesito el nombre de usuario a buscar!")
    if(command == "igstalk") {
      myBot.sendReact(m.chat, "🕒", m.key);
      let { status, creator, username, fullName, profilePicUrl, biography, followsCount, followedByCount, mediaCount, isPrivate } = await igstalk(text)
      console.log( await igstalk(text) )
      if(status !== true) return m.reply(myLang("global").err);
      msg = `*Username:* ${username}\n`
      msg += `*Name:* ${fullName}\n`
      msg += `*Biography:* ${biography || 'Not Found'}\n`
      msg += `*Followers:* ${followsCount}\n`
      msg += `*Following:* ${followedByCount}\n`
      msg += `*Posting:* ${mediaCount}\n`
      msg += `*Private:* ${isPrivate ? 'Private' : 'Public'}\n`
      msg += `*Link:* https://instagram.com/${username}\n\n`
      msg += `*Plugin by:* ${creator}\n`
      msg += `*${Config.BOT_NAME}*`
      myBot.sendImage(m.chat, `https://cdn.instanavigation.com/?${profilePicUrl}`, msg, m)
      User.counter(m.sender, { usage: 1 });
    } else if(command == "igstalk2") {
      myBot.sendReact(m.chat, "🕒", m.key);
      let { status, creator, avatar, username, post, followers, following } = await igstalk2(text)
      if(status == true) {
        msg = `*Username:* ${username}\n`
        msg += `*Followers:* ${followers}\n`
        msg += `*Following:* ${following}\n`
        msg += `*Posting:* ${post}\n`
        msg += `*Link:* https://instagram.com/${username}\n\n`
        msg += `*Plugin by:* ${creator}\n`
        msg += `*${Config.BOT_NAME}*`
        myBot.sendImage(m.chat, avatar, msg, m)
        User.counter(m.sender, { usage: 1 });
      } else {
        m.reply(myLang("global").err);
      }
    }
  }
};

async function igstalk(user) {
  try {
    let { data } = await axios.get(`https://instanavigation.com/user-profile/${user}`)
    let $ = cheerio.load(data)
    let str = $('profile-page[v-bind\\:user-info-prop]').attr('v-bind:user-info-prop');
    let userInfoObj = JSON.parse(str);
    if(userInfoObj.id == undefined) return 'user not found';
    return ({status: true, creator: '©ianvanh', ...userInfoObj})
  } catch (e) {
    return ({status: false,creator: '©ianvanh', message: 'internal error, try again'})
  } 
}

async function igstalk2(user) {
  try {
    let { data } = await axios.get(`https://insta-stories-viewer.com/es/${user}`)
    let $ = cheerio.load(data)
    let result = {
      creator: '©ianvanh',
      avatar: $('div.profile__header > div.profile__header-left > div.profile__avatar > div.profile__avatar-inner > img.profile__avatar-pic').attr('src'),
      username: $('div.profile__header > div.profile__header-right > h1.profile__nickname').text().trim().split(" ")[0],
      post: $('div.profile__header > div.profile__header-right > ul.profile__stats > li.profile__stats-item > span.profile__stats-posts').text(),
      followers: $('div.profile__header > div.profile__header-right > ul.profile__stats > li.profile__stats-item > span.profile__stats-followers').text(),
      following: $('div.profile__header > div.profile__header-right > ul.profile__stats > li.profile__stats-item > span.profile__stats-follows').text()
    }
    console.log(result)
    return ({status: true, ...result})
  } catch (e) {
    return ({status: false, message: 'internal error, try again'})
  } 
}