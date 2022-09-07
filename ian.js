/*
  Copyright (C) 2022
  DrkBot-MD - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

require('./config')
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs')
const util = require('util')
const { exec, spawn, execSync } = require("child_process")
const axios = require('axios')
const path = require('path')
const os = require('os')
const speed = require('performance-now')
const { performance } = require('perf_hooks')
const simpleGit = require('simple-git')
const git = simpleGit()
const { formatp, isUrl, sleep, clockString, runtime, fetchJson, jsonformat, format, parseMention, getRandom } = require('./lib/myfunc')
const { yta, ytv } = require('./lib/y2mate')
const { log, pint, bgPint } = require('./lib/colores');
const { menu } = require('./src/assets/menu')
const Config = require('./config');
const { youtubedlv2, youtubeSearch, tiktokdlv2 } = require('@bochilteam/scraper')

// Language
const myLang = require('./language').getString

// read database
let kuismath = db.data.game.math = []
let vote = db.data.others.vote = []

module.exports = myBot = async (myBot, m, chatUpdate, store) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        var prefix = Config.HANDLER.match(/\[(\W*)\]/)[1][0]
        var botName = Config.BOT_NAME
        const isCmd = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const pushname = m.pushName || "No Name"
        const botNumber = await myBot.decodeJid(myBot.user.id)
        const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const itsMe = m.sender == botNumber ? true : false
        const text = q = args.join(" ")
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
	
        // Group
        const groupMetadata = m.isGroup ? await myBot.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const groupOwner = m.isGroup ? groupMetadata.owner : ''
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const isPremium = isCreator || global.premium.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false
	
	
	try {
            let isNumber = x => typeof x === 'number' && !isNaN(x)
            let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.afkTime)) user.afkTime = -1
                if (!('afkReason' in user)) user.afkReason = ''
                if (!isNumber(user.limit)) user.limit = limitUser
            } else global.db.data.users[m.sender] = {
                afkTime: -1,
                afkReason: '',
                limit: limitUser,
            }
    
            let chats = global.db.data.chats[m.chat]
            if (typeof chats !== 'object') global.db.data.chats[m.chat] = {}
            if (chats) {
                if (!('mute' in chats)) chats.mute = false
                if (!('antilink' in chats)) chats.antilink = false
            } else global.db.data.chats[m.chat] = {
                mute: false,
                antilink: false,
            }
      let setting = global.db.data.settings[botNumber]
      if (typeof setting !== 'object') global.db.data.settings[botNumber] = {}
      if (setting) {
        if (!isNumber(setting.status)) setting.status = 0
        if (!('autobio' in setting)) setting.autobio = false
      } else global.db.data.settings[botNumber] = {
        status: 0,
        autobio: false,
      }
	} catch (err) {
	  log(pint(err, 'red.'))
  }

        // Public & Self
        if (!myBot.public) {
            if (!m.key.fromMe) return
        }

       //  Push Message To Console && Auto Read
        if (m.message) {
          if (Config.READ === 'true') {
            myBot.sendReadReceipt(m.chat, m.sender, [m.key.id])
          }
          if (Config.MSG_CONSOLE === 'true') {
            log(
              pint(bgPint((new Date), 'white'), 'black.') + '\n' +
              pint(bgPint('[ NUEVO MENSAJE ]', 'white'), 'black.') + '\n' +
              pint(bgPint(budy, 'blue'), 'white.') + '\n' +
              pint('=> Sender: ', 'magenta') + pint(pushname) + ' ' + pint(m.sender, 'yellow') + '\n' +
              pint('=> To: ', 'blue') + ' ' + pint(m.isGroup ? pushname : 'Chat Privado') + ' ' + pint(m.chat) + '\n\n'
            )
          }
        }
	
	// reset limit every 12 hours
        let cron = require('node-cron')
        cron.schedule('00 12 * * *', () => {
            let user = Object.keys(global.db.data.users)
            let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
            for (let jid of user) global.db.data.users[jid].limit = limitUser
            log(pint('Reseted Limit', 'yellow.'))
        }, {
            scheduled: true,
            timezone: global.timeZone
        })
        
	// auto set bio
	if (db.data.settings[botNumber].autobio) {
	    let setting = global.db.data.settings[botNumber]
	    if (new Date() * 1 - setting.status > 1000) {
		let uptime = await runtime(process.uptime())
		await myBot.setStatus(`${myBot.user.name} | Runtime : ${runtime(uptime)}`)
		setting.status = new Date() * 1
	    }
	}
	    
	  // Anti Link
    if (db.data.chats[m.chat].antilink) {
      if (budy.match(`chat.whatsapp.com`)) {
        if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
        let gclink = (`https://chat.whatsapp.com/`+await myBot.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isCreator) return m.reply(myLang('antilink').own)
        if (isAdmins) return m.reply(myLang('antilink').admin)
        if (isgclink) return m.reply(myLang('antilink').detect)
        m.reply(myLang('antilink').msg)
        await sleep(3000)
        myBot.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      }
    }
        
      // Mute Chat
    if (db.data.chats[m.chat].mute && !isAdmins && !isCreator) {
      return
    }
    
    if (kuismath.hasOwnProperty(m.sender.split('@')[0]) && isCmd) {
      kuis = true
      jawaban = kuismath[m.sender.split('@')[0]]
            if (budy.toLowerCase() == jawaban) {
                await m.reply(`🎮 Kuis Matematika  🎮\n\nJawaban Benar 🎉\n\nIngin bermain lagi? kirim ${prefix}math mode`)
                delete kuismath[m.sender.split('@')[0]]
            } else m.reply('*Jawaban Salah!*')
        }

        // Respon Cmd with media
        if (isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString('base64') in global.db.data.sticker)) {
        let hash = global.db.data.sticker[m.msg.fileSha256.toString('base64')]
        let { text, mentionedJid } = hash
        let messages = await generateWAMessage(m.chat, { text: text, mentions: mentionedJid }, {
            userJid: myBot.user.id,
            quoted: m.quoted && m.quoted.fakeObj
        })
        messages.key.fromMe = areJidsSameUser(m.sender, myBot.user.id)
        messages.key.id = m.key.id
        messages.pushName = m.pushName
        if (m.isGroup) messages.participant = m.sender
        let msg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append'
        }
        myBot.ev.emit('messages.upsert', msg)
        }
        
        let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
        for (let jid of mentionUser) {
          let user = global.db.data.users[jid]
          if (!user) continue
          let afkTime = user.afkTime
          if (!afkTime || afkTime < 0) continue
          let reason = user.afkReason || ''
          m.reply(`
Jangan tag dia!
Dia sedang AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}
Selama ${clockString(new Date - afkTime)}
`.trim())
        }

        if (db.data.users[m.sender].afkTime > -1) {
            let user = global.db.data.users[m.sender]
            m.reply(`
Kamu berhenti AFK${user.afkReason ? ' setelah ' + user.afkReason : ''}
Selama ${clockString(new Date - user.afkTime)}
`.trim())
            user.afkTime = -1
            user.afkReason = ''
        }

// ======== INICIO COMANDOS ========
switch(command) {
  case 'owner': {
    myBot.sendContact(m.chat, global.owner, m)
  }
  break
  case 'setmenu': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (args[0] === 'image'){
      global.typeMenu = 'image'
      m.reply(myLang('global').success)
    } else if (args[0] === 'template'){
      global.typeMenu = 'template'
      m.reply(myLang('global').success)
    } else if (args[0] === 'location'){
      global.typeMenu = 'location'
      m.reply(myLang('global').success)
    }
  }
  break
  case 'alive': {
    anu = myLang('alive').msg
    myBot.sendButtonLoc(m.chat, global.thumb, anu, myBot.user.name, 'MENU', 'menu')
  }break
  case 'menu': {
    anu = menu(prefix, pushname, botName)
    let buttons = [
      { buttonId: 'menu', buttonText: { displayText: 'MENU' }, type: 1 },
      { buttonId: 'owner', buttonText: { displayText: 'OWNER' }, type: 1 },
      { buttonId: 'sc', buttonText: { displayText: 'GITHUB' }, type: 1 }
    ]

    let btn = [
      {urlButton: {
        displayText: 'Source Code',
        url: `${sourceCode}`
      }},
      {callButton: {
        displayText: 'Number Phone Owner',
        phoneNumber: `+${global.owner}`
      }},
      {quickReplyButton: {
        displayText: 'Menu',
        id: 'menu'
      }},
      {quickReplyButton: {
        displayText: 'Contact Owner',
        id: 'owner'}},
      {quickReplyButton: {
          displayText: 'GitHub',
          id: 'sc'}}
    ]
    if(global.typeMenu === 'image') {
      myBot.sendButImage(m.chat, global.thumb, anu, myBot.user.name, buttons)
    } else if(global.typeMenu === 'template') {
      myBot.send5ButImg(m.chat, anu, myBot.user.name, global.thumb, btn)
    } else if(global.typeMenu === 'location') {
      myBot.sendButtonLoc(m.chat, global.thumb, anu, myBot.user.name, 'MENU', 'menu')
    }
  }
  break
  case 'donar':{
    txtt = `Hola *${pushname}*\nVEO QUE QUIERES DONAR\nPuedes hacerlo por medio de las siguientes formas disponibles`
    ftext = 'Tu donasión será muy valiosa'

    let buttons = [
      { buttonId: `${prefix}ppal`, buttonText: { displayText: 'Paypal' }, type: 1 },
      { buttonId: `${prefix}nqui`, buttonText: { displayText: 'Nequi' }, type: 1 },
      { buttonId: `${prefix}dvplata`, buttonText: { displayText: 'DaviPlata' }, type: 1 }
    ]
    await myBot.sendButtonText(m.chat, buttons, txtt, ftext, m)
  }
  break
  case 'sc': {
    m.reply(`*${myLang('sc').msg}*\n\n*Script:* ${sourceCode}`)
  }
  break
// CONVERTER

  case 'sticker': {
    if (!quoted) return m.reply(myLang('sticker').quot.replace('{}', prefix+command))
    if (text.length > 0){
      name = text
    } else {
      name = botName
    }
    if (/image/.test(mime)) {
      m.reply(myLang('global').wait)
      let media = await quoted.download()
      let encmedia = await myBot.sendImageAsSticker(m.chat, media, m, { packname: name, author: global.author })
      await fs.unlinkSync(encmedia)
     } else if (/webp/.test(mime)) {
      m.reply(myLang('global').wait)
      let media = await quoted.download()
      let encmedia = await myBot.sendImageAsSticker(m.chat, media, m, { packname: name, author: global.author })
      await fs.unlinkSync(encmedia)
    } else if (/video/.test(mime)) {
      m.reply(myLang('global').wait)
      if ((quoted.msg || quoted).seconds > 11) return m.reply(myLang('sticker').time_wait)
      let media = await quoted.download()
      let encmedia = await myBot.sendVideoAsSticker(m.chat, media, m, { packname: name, author: global.author })
      await fs.unlinkSync(encmedia)
    } else {
      m.reply(myLang('sticker').end.replace('{}', prefix+command))
    }
  }
  break
  case 'toaudio': {
    if (!quoted) return m.reply(myLang('to_audio').quot)
    if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply(myLang('to_audio').q_audio)
    m.reply(myLang('global').wait)
    let media = await quoted.download()
    let { toAudio } = require('./lib/converter')
    let audio = await toAudio(media, 'mp4')
    myBot.sendMessage(m.chat, {audio: audio, mimetype: 'audio/mpeg'}, { quoted : m })
  }
  break
  case 'tomp4': {
    if (!quoted) return m.reply(myLang('to_mp4').quot)
    if (!/webp/.test(mime)) return m.reply(myLang('to_mp4').q_video)
    m.reply(myLang('global').wait)
		let { webp2mp4File } = require('./lib/uploader')
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    let webpToMp4 = await webp2mp4File(media)
    await myBot.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: myLang('global').by.replace('{}', botName) } }, { quoted: m })
    await fs.unlinkSync(media)
  }
  break
  case 'toimg': {
    if (!quoted) return m.reply(myLang('to_img').quot)
    if (!/webp/.test(mime)) return m.reply(myLang('to_img').q_img)
    m.reply(myLang('global').wait)
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    let ran = await getRandom('.png')
    exec(`ffmpeg -i ${media} ${ran}`, (err) => {
      fs.unlinkSync(media)
      if (err) m.reply(err)
      let buffer = fs.readFileSync(ran)
      myBot.sendMessage(m.chat, { image: buffer }, { quoted: m })
      fs.unlinkSync(ran)
    })
  }
  break
  case 'togif': {
    if (!quoted) return m.reply(myLang('to_gif').quot)
    if (!/webp/.test(mime) && !/video/.test(mime)) return m.reply(myLang('to_gif').q_gif)
    m.reply(myLang('global').wait)
		let { webp2mp4File } = require('./lib/uploader')
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    let webpToMp4 = await webp2mp4File(media)
    await myBot.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: myLang('global').by.replace('{}', botName) }, gifPlayback: true }, { quoted: m })
    await fs.unlinkSync(media)
  }
  break
  case 'tourl': {
    m.reply(myLang('global').wait)
		let { UploadFileUgu, webp2mp4File, TelegraPh } = require('./lib/uploader')
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    if (/image/.test(mime)) {
    let anu = await TelegraPh(media)
      m.reply(util.format(anu))
    } else if (!/image/.test(mime)) {
      let anu = await UploadFileUgu(media)
      m.reply(util.format(anu))
    }
    await fs.unlinkSync(media)
  }
  break
  case 'emojimix': {
    if (!text) return m.reply(myLang('emojimix').msg.replace('{}', prefix+command))
    let [emoji1, emoji2] = text.split`+`
    let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
    for (let res of anu.results) {
      let encmedia = await myBot.sendImageAsSticker(m.chat, res.url, m, { packname: botName, author: global.author, categories: res.tags })
      await fs.unlinkSync(encmedia)
		}
	}
	break
	case 'attp': case 'ttp': {
    if (!text) return m.reply(myLang('attp').msg.replace('{}', prefix+command))
    await myBot.sendMedia(m.chat, `https://xteam.xyz/${command}?file&text=${text}`, 'Bot', 'MD', m, {asSticker: true})
  }
  break
  case 'trt': {
    if (!m.quoted && !text) return m.reply(myLang('trt').quot)
    const translatte = require('translatte')
    var split = text.split(' ')
    de = split[0]
    para = split[1]
    translatte(m.quoted.text, {
      from: !de ? 'auto' : de,
      to: !para ? 'en' : para
    }).then(res => {
      msg = '▶️ ' + myLang('trt').from + '```' + de + '```\n'
          + '◀️ ' + myLang('trt').to + '```' + para + '```\n'
          + '🔎 ' + myLang('trt').res + '```' + res.text + '```'
      myBot.sendText(m.chat, msg)
    }).catch(err => {
        m.reply(myLang('global').err)
    });
  }break
  case 'removebg': {
    if (!/image/.test(mime)) return m.reply(myLang('removebg').msg.replace('{}', prefix+command))
    let { removeBackgroundFromImageFile, RemoveBgError } = require('remove.bg')
    let apirnobg = ['HBbdxnge4BVXJwqhcAHqVC', 'uHUYM1Wo4QcrFsqGbWoMr2zi', 'qySfrLUKRQejaMoJ54LHpShB']
    let apinobg = apirnobg[Math.floor(Math.random() * apirnobg.length)]
    hmm = await './src/remobg-'+getRandom('')
    localFile = await myBot.downloadAndSaveMediaMessage(quoted, hmm)
    outputFile = await './src/hremo-'+getRandom('.png')
    m.reply(myLang('global').wait)
    removeBackgroundFromImageFile({
      path: localFile,
      apiKey: apinobg,
      size: "regular",
      type: "auto",
      scale: "100%",
      outputFile 
    }).then(async (result) => {
      myBot.sendMessage(m.chat, {image: fs.readFileSync(outputFile), caption: myLang('global').by.replace('{}', botName) }, { quoted : m })
      await fs.unlinkSync(localFile)
      await fs.unlinkSync(outputFile)
    }).catch((error) => {
      fs.unlinkSync(localFile)
      if(error[0].code === 'insufficient_credits') m.reply(myLang('removebg').err)
      throw 'Cambiar ApiKey removebg!'
    });
	}
	break
  case 'bass': case 'blown': case 'deep': case 'earrape': case 'fast': case 'fat': case 'nightcore': case 'reverse': case 'robot': case 'slow': case 'smooth': case 'tupai':
    try {
      let set
      if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
      if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
      if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
      if (/earrape/.test(command)) set = '-af volume=12'
      if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
      if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
      if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
      if (/reverse/.test(command)) set = '-filter_complex "areverse"'
      if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
      if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
      if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
      if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
      if (/audio/.test(mime)) {
        m.reply(myLang('global').wait)
        let media = await myBot.downloadAndSaveMediaMessage(quoted)
        let ran = getRandom('.mp3')
        exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
          fs.unlinkSync(media)
          if (err) return m.reply(err)
          let buff = fs.readFileSync(ran)
          myBot.sendMessage(m.chat, { audio: buff, mimetype: 'audio/mpeg' }, { quoted : m })
          fs.unlinkSync(ran)
        })
      } else m.reply(myLang('voz_modify').msg)
    } catch (e) {
      throw e
    }
  break
// DOWNLOADS
  case 'play': {
    if (!text) return m.reply(myLang('play').msg.replace('{}', prefix+command))
    try {
      m.reply(myLang('global').wait)
      ytm = await youtubeSearch(text)
      let { thumbnail, title, url } = ytm.video[0]
      let buttons = [
        { buttonId: `song ${url}`, buttonText: { displayText: 'AUDIO' }, type: 1 },
        { buttonId: `video ${url}`, buttonText: { displayText: 'VIDEO' }, type: 1 }
      ]
      myBot.sendButImage(m.chat, thumbnail, `*${title}*`, myBot.user.name, buttons)
    } catch (e) { throw e }
  }break
  case 'ttdl': {
    if (!text) return m.reply(myLang('ttdl').msg.replace('{}', prefix+command))
    try {
      m.reply(myLang('global').wait)
      let { video } = await tiktokdlv2(text)
      await myBot.sendMessage(m.chat, { video: { url: video.no_watermark }, mimetype: 'video/mp4', fileName: `tiktokdl.mp4`, caption: myLang('global').by.replace('{}', botName) }, { quoted: m })
    } catch (e) { throw e }
  }break
  case 'yts': {
    if (!text) return m.reply(myLang('yts').msg.replace('{}', prefix+command))
    try {
      search = await youtubeSearch(text)
      let teks = myLang('yts').res +' *'+text+'*\n\n'
      search.video.map((video) => {
        teks += '*' + video.title + '* - ' + video.url + '\n'
      });
      myBot.sendImage(m.chat, search.video[0].thumbnail, teks)
    } catch (e) { throw e }
  }
  break
  case 'song': {
    if (!text) return m.reply(myLang('song').msg.replace('{}', prefix))
    try {
      m.reply(myLang('global').wait)
      let ytm = await youtubedlv2(urls[text - 1])
      let link = await ytm.audio['128kbps'].download()
      let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
      let tinyUrl = tiny.data;
      if (ytm.filesize >= 100000) return myBot.sendImage(m.chat, ytm.thumb, myLang('song').big_size.replace('{}', tinyUrl), m)
      //if(!Number(ytm.fileSizeH.split(' MB')[0])) return m.reply(myLang('song').no_size)
      await myBot.sendImage(m.chat, ytm.thumbnail, myLang('song').caption.replace('{}', ytm.title).replace('{}', ytm.fileSizeH).replace('{}', ytm.quality), m)
      await myBot.sendMessage(m.chat, { audio: { url: link }, mimetype: 'audio/mpeg', fileName: `${ytm.title}.mp3` }, { quoted: m })
    } catch (e){
      throw e
      m.reply(myLang('global').err)
    }
  }
  break
  case 'video': {
    if (!text) return m.reply(myLang('video').msg.replace('{}', prefix))
    try {
      m.reply(myLang('global').wait)
      let ytm = await youtubedlv2(urls[text - 1])
      let link = await ytm.video['360p'].download()
      let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
      let tinyUrl = tiny.data;
      if (ytm.filesize >= 100000) return myBot.sendImage(m.chat, ytm.thumbnail, myLang('video').big_size.replace('{}', tinyUrl), m)
      //if(!Number(ytm.fileSizeH.split(' MB')[0])) return m.reply(myLang('song').no_size)
      await myBot.sendMessage(m.chat, { video: { url: link }, mimetype: 'video/mp4', fileName: `${ytm.title}.mp4`, caption: myLang('video').caption.replace('{}', ytm.title) }, { quoted: m })
    } catch (e) {
      throw e
      m.reply(myLang('global').err)
    }
  }
  break
  case 'getmusic': {
    if (!text) return m.reply(myLang('get_down').msg.replace('{}', prefix+command))
    if (!m.quoted) return m.reply(myLang('get_down').quot)
    if (!m.quoted.isBaileys) return m.reply(myLang('get_down').no_me)
		let urls = quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
    if (!urls) return m.reply(myLang('get_down').quot)
    m.reply(myLang('global').wait)
    let ytm = await youtubedlv2(urls[text - 1])
    let link = await ytm.audio['128kbps'].download()
    let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
    let tinyUrl = tiny.data;
    if (ytm.filesize >= 100000) return myBot.sendImage(m.chat, ytm.thumb, myLang('song').big_size.replace('{}', ytm.link), m)
    //if(!Number(ytm.fileSizeH.split(' MB')[0])) return m.reply(myLang('song').no_size)
    await myBot.sendImage(m.chat, ytm.thumbnail, myLang('song').caption.replace('{}', ytm.title).replace('{}', ytm.fileSizeH).replace('{}', ytm.quality), m)
    await myBot.sendMessage(m.chat, { audio: { url: link }, mimetype: 'audio/mpeg', fileName: `${ytm.title}.mp3` }, { quoted: m })
  }
  break
  case 'getvideo': {
    if (!text) return m.reply(myLang('get_down').msg.replace('{}', prefix+command))
    if (!m.quoted) return m.reply(myLang('get_down').quot)
    if (!m.quoted.isBaileys) return m.reply(myLang('get_down').no_me)
		let urls = quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
    if (!urls) return m.reply(myLang('get_down').quot)
    m.reply(myLang('global').wait)
    let ytm = await youtubedlv2(urls[text - 1])
    let link = await ytm.video['360p'].download()
    let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
    let tinyUrl = tiny.data;
    if (ytm.filesize >= 100000) return myBot.sendImage(m.chat, ytm.thumbnail, myLang('video').big_size.replace('{}', ytm.link), m)
    //if(!Number(ytm.fileSizeH.split(' MB')[0])) return m.reply(myLang('song').no_size)
    await myBot.sendMessage(m.chat, { video: { url: link }, mimetype: 'video/mp4', fileName: `${ytm.title}.mp4`, caption: myLang('video').caption.replace('{}', ytm.title) }, { quoted: m })
  }
  break
  /*case 'fbdl': {
    if(!args[0]) return m.reply(myLang('fbdl').msg.replace('{}', prefix))
    try {
      m.reply(myLang('global').wait)
      let res = await savefrom(args[0])
      let url = res[0].sd.url
      myBot.sendMessage(m.chat, { video: { url }, caption: myLang('global').by.replace('{}', botName) }, { quoted: m })
    } catch (e) {
      m.reply(myLang('global').err)
    }
  }
  break*/
  case 'waifu': case 'neko': {
    res = await fetchJson(`https://api.waifu.pics/nsfw/${command}`)
     let buttons = [
      { buttonId: command, buttonText: { displayText: '➡️' }, type: 1 }
    ]
    myBot.sendButImage(m.chat, res.url, myLang('global').by.replace('{}', botName), myBot.user.name, buttons)
  }break
  case 'wallpaper': {
    if (!text) return m.reply(myLang('img').msg.replace('{}', prefix+command))
    try {
      let { wallpaper } = require('./lib/scraper')
      anu = await wallpaper(text)
      result = anu[Math.floor(Math.random() * anu.length)]
      let buttons = [
        {buttonId: `wallpaper ${text}`, buttonText: {displayText: '➡️'}, type: 1}
      ]
      let buttonMessage = {
        image: { url: result.image[0] },
        caption: `*-----「 ${botName} 」-----*`,
        footer: myBot.user.name,
        buttons: buttons,
        headerType: 4
      }
      await myBot.sendMessage(m.chat, buttonMessage, { quoted: m })
    } catch (e) { throw e }
  }
  break
  case 'img': {
    if (!text) return m.reply(myLang('img').msg.replace('{}', prefix+command))
    let gis = require('async-g-i-s');
    try {
      const results = await gis(text);
      let rndImg = results[Math.floor(Math.random() * results.length)].url
      
      let buttons = [
          {buttonId: `img ${text}`, buttonText: {displayText: '️➡️'}, type: 1}
      ]
      let buttonMessage = {
        image: { url: rndImg },
        caption: `*-----「 ${botName} 」-----*`,
        footer: myBot.user.name,
        buttons: buttons,
        headerType: 4
      }
      await myBot.sendMessage(m.chat, buttonMessage, { quoted: m })
    } catch (e) {
      await m.reply(myLang('global').msg.err);
    }
  }
  break
  case 'calc': {
    if (!text) return m.reply(myLang('calc').msg)
    let val = text
      .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π|pi/gi, 'Math.PI')
      .replace(/e/gi, 'Math.E')
      .replace(/\/+/g, '/')
      .replace(/\++/g, '+')
      .replace(/-+/g, '-')
    let format = val
      .replace(/Math\.PI/g, 'π')
      .replace(/Math\.E/g, 'e')
      .replace(/\//g, '÷')
      .replace(/\*×/g, '×')
    try {
      let result = (new Function('return ' + val))()
      if (!result) throw result
      myBot.sendText(m.chat, `${format} = _${result}_`, m)
    } catch (e) {
      if (e == undefined) return m.reply(myLang('calc').err)
    }
  }
  break
// TOOLS
  case 'ebinary': {
    if (!m.quoted && !text) return m.reply(myLang('binary').encode.replace('{}', prefix+command))
    let { eBinary } = require('./lib/binary')
    teks = text ? text : m.quoted.text
    m.reply( await eBinary(teks) )
  }
  break
  case 'dbinary': {
    if (!m.quoted) return m.reply(myLang('binary').decode.replace('{}', prefix+command))
    let { dBinary } = require('./lib/binary')
    m.reply( await dBinary(m.quoted.text) )
  }
  break
  case 'bot': {
    if (!text) return m.reply(myLang('ia').msg)
    let lang = Config.LANG.toLowerCase()
    await axios.get(`https://api.simsimi.net/v2/?text=${text}&lc=${lang}&cf=true`).then((response) => {
    try{
      const { text } = response.data.messages[0]
      if (text ==='Roberto' || text === 'maite' || text === 'Luis Mario.' || text === 'Ricardo milos\n') {
        m.reply('🤖 ' + myLang('ia').name.replace('{}', botName))
      }	else {
        m.reply('🤖 ' + text)
      }
    } catch (err) {
      throw err
    }
    })
  }
  break
  case 'bin': {
    if (!text) return m.reply(myLang('bin').msg)
    await axios.get(`https://lookup.binlist.net/${args[0]}`).then(async (response) => {
    json = response.data
    m.reply(
      `💳 *BIN:* ${args[0]}\n` + 
    	' *TYPE:*\n' + 
    	json.scheme + '\n' + 
    	json.type + '\n' + 
      json.brand + '\n' + 
      ' *COUNTRY:*\n' + 
      json.country.emoji + ' ' + 
      json.country.name + '\n' + 
      json.country.currency + '\n' + 
      ' *BANK:*\n' + 
      json.bank.name
    )
  })
  }break
  case 'cambio': {
    if (!text) return m.reply(myLang('exchange').msg)
    key = 'bcab649da87b8cc8e5f000d0'
    if (!key) throw ('Falta la key!')
    if (text.includes(',') && verify(text) == 2) {
    	var split = text.split(',')
    	a = split[0].trim()
    	b = split[1].trim()
    	am = split[2].trim()
    }
    else {
     return m.reply(myLang('exchange').err)
    }
    await axios.get(`https://v6.exchangerate-api.com/v6/${key}/pair/${a}/${b}/${am}`).then(async (response) => {
      var {conversion_rate, conversion_result} = response.data
    	var msg = `✅\n\n💲 *${a.toUpperCase()}:* ${conversion_rate} ${b.toUpperCase()}\n🟰 *${b.toUpperCase()}:* ${conversion_result}`
    	m.reply(msg)
    })
    function verify(str) {
      let letra = ','
      let arreglo=[]
      str= str.split('');
      str.map(n => {
        if(n.toLowerCase() === letra){
          arreglo.push(n)
        }
      })
      return arreglo.length
    }
  }break
  case 'price': {
    if (!text) return m.reply('Token?¹')
    key = '1be6e707f54766812254c65612a60298080cf7b26c2ef6ea9e6ea0b0b11b8890'
    if (!key) throw m.reply('Falta la key!')
    await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${text.toLowerCase()}&tsyms=USD,COP&api_key={${key}}`).then(async (response) => {
      var {USD, COP} = response.data
    	var msg = `*Token:* ${text.toUpperCase()}\n\n*USD:* ${USD}\n*COP:* ${COP}`
    	m.reply(msg)
    })
  }break
  case 'shazam': {
    if (/image/.test(mime)) return m.reply(myLang('shazam').image)
    if (/video/.test(mime)) return m.reply(myLang('shazam').video.replace('{}',prefix+command))
    const acrcloud = require("acrcloud")
    const acr = new acrcloud({ 
        host: "identify-eu-west-1.acrcloud.com",
        access_key: "a7982a1f271fc390f3a69cb5bac04498",
        access_secret: "QPbD6UOnfawRtUiH88lzKx7edUaX20I0erUWCoCW"
    })
    m.reply(myLang('global').wait)
    let sampleq = await quoted.download()
    acr.identify(sampleq).then(async (res) => {
    m.reply(
    `🎶 ${res.metadata.music[0].title}\n`+
    `🎤 ${res.metadata.music[0].artists[0].name}\n`+
    `💽 ${res.metadata.music[0].album.name}\n`+
    `📆 ${res.metadata.music[0].release_date}`
    )
    })
  }break
// FOR GROUPS
  case 'love': {
    if (!m.isGroup) return m.reply(myLang('global').group)
    let member = participants.map(u => u.id)
    let me = m.sender
    let rnd = member[Math.floor(Math.random() * member.length)]
    let jawab = `👫 \n@${me.split('@')[0]} ❤️ @${rnd.split('@')[0]}`
    let ments = [me, rnd]
    let buttons = [
      { buttonId: 'love', buttonText: { displayText: '👩‍❤️‍👨' }, type: 1 }
    ]
    await myBot.sendButtonText(m.chat, buttons, jawab, myBot.user.name, m, {mentions: ments})
  }
  break
  case 'mute': {
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
    if (args[0] === "on") {
      myBot.groupSettingUpdate(m.chat, 'announcement')
      m.reply(myLang('mute').on.replace('{}',pushname))
    } else if (args[0] === "off") {
      myBot.groupSettingUpdate(m.chat, 'not_announcement')
      m.reply(myLang('mute').off.replace('{}',pushname))
    } else {
      let buttons = [
        { buttonId: 'mute on', buttonText: { displayText: 'On' }, type: 1 },
        { buttonId: 'mute off', buttonText: { displayText: 'Off' }, type: 1 }
      ]
      await myBot.sendButtonText(m.chat, buttons, `${botName}`, myBot.user.name, m)
    }
  }
  break
  case 'antilink': {
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
    if (args[0] === "on") {
      db.data.chats[m.chat].antilink = true
      m.reply(myLang('antilink').on)
    } else if (args[0] === "off") {
      db.data.chats[m.chat].antilink = false
      m.reply(myLang('antilink').off)
    } else {
      let buttons = [
        { buttonId: 'antilink on', buttonText: { displayText: 'ON' }, type: 1 },
        { buttonId: 'antilink off', buttonText: { displayText: 'OFF' }, type: 1 }
      ]
      await myBot.sendButtonText(m.chat, buttons, `MOD ANTILINK`, myBot.user.name, m)
    }
  }
  break
	case 'add': {
		if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
		let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'add')
		m.reply(myLang('group').add.replace('{}',users).replace('@s.whatsapp.net',''))
	}
	break
  case 'kick': {
		if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'remove')
		m.reply(myLang('group').kick.replace('{}',users).replace('@s.whatsapp.net',''))
	}
	break
	case 'promote': {
		if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'promote')
		m.reply(myLang('group').prom.replace('{}',users).replace('@s.whatsapp.net',''))
	}
	break
	case 'demote': {
		if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'demote')
		m.reply(myLang('group').dem.replace('{}',users).replace('@s.whatsapp.net',''))
	}
	break
  case 'tagall': {
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)

    let ini = `╔═✪〘 *${myLang('group').tag.msg_a}* 〙✪═\n`
    let mesaj = `➲ *${myLang('group').tag.msg_b}:* ${q ? q : ''}\n\n`
    let end = `╚═✪〘 *${botName}* 〙✪═`

    for (let mem of participants) {
      mesaj += `${global.sp} @${mem.id.split('@')[0]}\n`
      tga = `${ini}${mesaj}${end}`
    }
    myBot.sendMessage(m.chat, { text: tga, mentions: participants.map(a => a.id) }, { quoted: m })
  }
  break
  case 'hdt': {
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
    myBot.sendMessage(m.chat, { text: q ? q : '' , mentions: participants.map(a => a.id)}, { quoted: m })
  }
  break
  case'linkgroup': {
    if (!m.isGroup) return m.reply(myLang('global').group)
    const inviteCode = await myBot.groupInviteCode(m.chat)
    const { subject } = await myBot.groupMetadata(m.chat)
    const caption = myLang('group').link_grup.replace('{}',subject).replace('{}',inviteCode)
    try { pic = await myBot.profilePictureUrl(m.chat, 'image') } catch (e) { pic = global.thumb }
    myBot.sendImage(m.chat, pic, caption, m)
  }
  break
// END GROUPS
// FOR OWNER
  case 'join': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (!text) return m.reply(myLang('own').join.link)
    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) m.reply(myLang('own').join.link_err)
    m.reply(myLang('global').wait)
    let result = args[0].split('https://chat.whatsapp.com/')[1]
    await myBot.groupAcceptInvite(result).then((res) => m.reply(myLang('own').join.ok)).catch((err) => m.reply(myLang('own').join.err))
  }
  break
	case 'public': {
    if (!isCreator) return m.reply(myLang('global').owner)
    myBot.public = true
    m.reply(myLang('own').public)
  }
  break
  case 'self': {
    if (!isCreator) return m.reply(myLang('global').owner)
    myBot.public = false
    m.reply(myLang('own').self)
  }
  break
  case 'py': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (!text) return m.reply('a quien voy a saludar?')
    const pythonProcess = await spawn('python', ['saludo.py'])
    let pythonResponse = ''

    pythonProcess.stdout.on('data', function(data) {
    	pythonResponse += data.toString()
    })
    pythonProcess.stdout.on('end', function() {
    	m.reply(pythonResponse)
    })
    pythonProcess.stdin.write(text)
    pythonProcess.stdin.end()
 }break
  case 'speedtest': {
    if (!isCreator) return m.reply(myLang('global').owner)
    m.reply('Prueba de velocidad...')
    let cp = require('child_process')
    let { promisify } = require('util')
    let exec = promisify(cp.exec).bind(cp)
    let o
    try {
      o = await exec('python speed.py')
    } catch (e) {
      o = e
    } finally {
    let { stdout, stderr } = o
    if (stdout.trim()) m.reply(stdout)
    if (stderr.trim()) m.reply(stderr)
    }
  }
  break
  case 'update': {
    if (!isCreator) return m.reply(myLang('global').owner)
    await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
      myBot.sendMessage(m.chat, { text: myLang('updater').UPDATE })
    } else {
      var degisiklikler = myLang('updater').NEW_UPDATE
      commits['all'].map(
        (commit) => {
          degisiklikler += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
        }
      );
      myBot.sendMessage(m.chat, { text: degisiklikler + '```' })
    }
  }break
  case 'actualizar': {
    if (!isCreator) return m.reply(myLang('global').owner)
    await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
      myBot.sendMessage(m.chat, { text: myLang('updater').UPDATE })
    } else {
      git.pull((async (err, update) => {
        if(update && update.summary.changes) {
          myBot.sendMessage(m.chat , { text: myLang('updater').UPDATED_LOCAL });
              exec('npm install').stderr.pipe(process.stderr);
        } else if (err) {
          myBot.sendMessage(m.chat, { text: '*Error:*\n```' + err + '```' })
        }
      }));
    }
  }break
  case 'block': {
		if (!isCreator) return m.reply(myLang('global').owner)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.updateBlockStatus(users, 'block').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
  case 'unblock': {
		if (!isCreator) return m.reply(myLang('global').owner)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.updateBlockStatus(users, 'unblock').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
  case 'bc': case 'broadcast': case 'bcall': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (!text) return m.reply(`Que quieres enviar?\n\nEjemplo: ${prefix + command} text`)
    let anu = await store.chats.all().map(v => v.id)
    m.reply(`Enviar difusión a ${anu.length} chat.\nTiempo de envio ${anu.length * 1.5} segundos.`)
    for (let yoi of anu) {
      await sleep(1500)
      let btn = [{
        urlButton: {
          displayText: 'Source Code',
          url: 'https://github.com/ianvanh'
        }
      }, {
        callButton: {
          displayText: 'Number Phone Owner',
          phoneNumber: '+57 350-877-0421'
        }
      }, {
        quickReplyButton: {
          displayText: 'Menu',
          id: 'menu'
        }
      }, {
        quickReplyButton: {
          displayText: 'Contact Owner',
          id: 'owner'
        }  
      }, {
        quickReplyButton: {
          displayText: 'GitHub',
          id: 'sc'
        }
      }]
      let txt = `「 Difusor Bot 」\n\n${text}`
      myBot.send5ButImg(yoi, txt, myBot.user.name, global.thumb, btn)
    }
    m.reply('Difusion Enviada')
  }
  break
  case 'bcgc': case 'bcgroup': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (!text) return m.reply(`Que quieres enviar?\n\nEjemplo: ${prefix + command} text`)
    let getGroups = await myBot.groupFetchAllParticipating()
    let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
    let anu = groups.map(v => v.id)
    m.reply(`Enviar difusión a ${anu.length} grupos.\nTiempo de envio ${anu.length * 1.5} segundos.`)
    for (let i of anu) {
      await sleep(1500)
      let btn = [{
        urlButton: {
          displayText: 'Source Code',
          url: 'https://github.com/ianvanh'
        }
      }, {
        callButton: {
          displayText: 'Number Phone Owner',
          phoneNumber: '+57 350-877-0421'
        }
      }, {
        quickReplyButton: {
          displayText: 'Menu',
          id: 'menu'
        }
      }, {
        quickReplyButton: {
          displayText: 'Contact Owner',
          id: 'owner'
        }  
      }, {
        quickReplyButton: {
          displayText: 'GitHub',
          id: 'sc'
        }
      }]
      let txt = `「 Difusor Bot 」\n\n${text}`
      myBot.send5ButImg(i, txt, myBot.user.name, global.thumb, btn)
    }
    m.reply('Difusion Enviada')
  }
  break
  case 'ping': case 'status': {
		if (!isCreator) return m.reply(myLang('global').owner)
    const used = process.memoryUsage()
    const cpus = os.cpus().map(cpu => {
      cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
	  	return cpu
    })
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
      last.total += cpu.total
      last.speed += cpu.speed / length
      last.times.user += cpu.times.user
      last.times.nice += cpu.times.nice
      last.times.sys += cpu.times.sys
      last.times.idle += cpu.times.idle
      last.times.irq += cpu.times.irq
      return last
    }, {
      speed: 0,
      total: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0
      }
    })
    let timestamp = speed()
    let latensi = speed() - timestamp
    neww = performance.now()
    oldd = performance.now()
    respon = `
*VELOCIDAD DE RESPUESTA*
_Segundos:_ ${latensi.toFixed(4)}
_Milisegundos:_ ${oldd - neww}

💻 *INFO SERVER*
_RAM:_ ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

_MEMORIA NodeJS_

${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`.trim()
    if (command === 'ping') {
      m.reply(respon)
    } else if (command === 'status') {
      m.reply(`*TIEMPO DE EJECUCIÓN*
${runtime(process.uptime())}`)
    }
  }
  break

  default:
    if (budy.startsWith('=>')) {
      if (!isCreator) return m.reply(myLang('global').owner)
      function Return(sul) {
        sat = JSON.stringify(sul, null, 2)
        bang = util.format(sat)
        if (sat == undefined) {
          bang = util.format(sul)
        }
      return m.reply(bang)
      }
      try {
        m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
      } catch (e) {
        m.reply(String(e))
      }
    }
    
    if (budy.startsWith('>')) {
      if (!isCreator) return m.reply(myLang('global').owner)
      try {
        let evaled = await eval(budy.slice(2))
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
        await m.reply(evaled)
      } catch (err) {
        await m.reply(String(err))
      }
    }
    
    if (budy.startsWith('$')) {
      if (!isCreator) return m.reply(myLang('global').owner)
      exec(budy.slice(2), (err, stdout) => {
        if(err) return m.reply(err)
        if (stdout) return m.reply(stdout)
      })
    }
		
		if (m.chat.endsWith('@s.whatsapp.net') && isCmd) {
      this.anonymous = this.anonymous ? this.anonymous : {}
      let room = Object.values(this.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')
      if (room) {
        if (/^.*(next|leave|start)/.test(m.text)) return
        if (['.next', '.leave', '.stop', '.start', 'Cari Partner', 'Keluar', 'Lanjut', 'Stop'].includes(m.text)) return
        let other = [room.a, room.b].find(user => user !== m.sender)
        m.copyNForward(other, true, m.quoted && m.quoted.fromMe ? {
          contextInfo: {
            ...m.msg.contextInfo,
            forwardingScore: 0,
            isForwarded: true,
            participant: other
          }
        } : {})
      }
      return !0
    }
    
    if (isCmd && budy.toLowerCase() != undefined) {
      if (m.chat.endsWith('broadcast')) return
      if (m.isBaileys) return
      let msgs = global.db.data.database
      if (!(budy.toLowerCase() in msgs)) return
      myBot.copyNForward(m.chat, msgs[budy.toLowerCase()], true)
		}
}
    } catch (err) {
      if (Config.LOG == 'false') return
      myBot.sendMessage(myBot.user.id, { text: `*-- ${myLang('err').msgReport} [ ${botName} ] --*\n` +
        '*Error:* ```' + err + '```'
      })
    }
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	log(pint(`Update ${__filename}`, 'orange.'))
	delete require.cache[file]
	require(file)
})
