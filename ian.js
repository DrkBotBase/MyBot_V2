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
const moment = require('moment-timezone')
const { JSDOM } = require('jsdom')
const speed = require('performance-now')
const { performance } = require('perf_hooks')
const gis = require('g-i-s')
const { Primbon } = require('scrape-primbon')
const primbon = new Primbon()
const simpleGit = require('simple-git')
const git = simpleGit()
const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom } = require('./lib/myfunc')
const { yta, ytv } = require('./lib/newdown')
const { log, pint, bgPint } = require('./lib/colores');
const { menu } = require('./src/assets/menu')
const Config = require('./config');

// Language
const Language = require('./language');
const LangU = Language.getString('updater');
const LangG = Language.getString('global');
const LangErr = Language.getString('err');

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
            timezone: "America/Bogota"
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
        if (!isBotAdmins) return m.reply(`Lo siento no soy Admin T_T`)
        let gclink = (`https://chat.whatsapp.com/`+await myBot.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return m.reply(`Link de éste grupo detectado.`)
        if (isAdmins) return m.reply(`Te he detectado enviando enlaces, pero como eres Admin pos no hay problema 😅`)
        if (isCreator) return m.reply(`Mi señor creador, pará usted no hay restricciones.`)
        m.reply(`「 ANTI LINK 」\n\n😧 te he detectado enviando un enlace de grupo, lo sentimos, serás expulsado!`)
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
  case 'alive': {
    anu = '✪〘 *FUNCIONANDO* 〙✪'
    let btn = [
      {urlButton: {
        displayText: 'Source Code',
        url: 'https://github.com/'
      }}
    ]
    myBot.sendButLoc(m.chat, anu, myBot.user.name, global.thumb, btn)
  }
  break
  case 'menu': {
    anu = menu(prefix, pushname)
    let buttons = [
      { buttonId: 'menu', buttonText: { displayText: 'MENU' }, type: 1 },
      { buttonId: 'owner', buttonText: { displayText: 'OWNER' }, type: 1 },
      { buttonId: 'sc', buttonText: { displayText: 'GITHUB' }, type: 1 }
    ]
    await myBot.sendButImage(m.chat, global.thumb, anu, myBot.user.name, buttons)
  }
  break
  /*case 'setmenu': {
    if (!isCreator) throw mess.owner
    let setbot = db.data.settings[botNumber]
    if (args[0] === 'templateImage'){
                setbot.templateImage = true
                setbot.templateVideo = false
                setbot.templateGif = false
                setbot.templateMsg = false
                setbot.templateLocation = false
                m.reply(mess.success)
    } else if (args[0] === 'templateVideo'){
                setbot.templateImage = false
                setbot.templateVideo = true
                setbot.templateGif = false
                setbot.templateMsg = false
                setbot.templateLocation = false
                m.reply(mess.success)
    } else if (args[0] === 'templateGif'){
                setbot.templateImage = false
                setbot.templateVideo = false
                setbot.templateGif = true
                setbot.templateMsg = false
                setbot.templateLocation = false
                m.reply(mess.success)
    } else if (args[0] === 'templateMessage'){
                setbot.templateImage = false
                setbot.templateVideo = false
                setbot.templateGif = false
                setbot.templateMsg = true
                setbot.templateLocation = false
                m.reply(mess.success)
    } else if (args[0] === 'templateLocation'){
                setbot.templateImage = false
                setbot.templateVideo = false
                setbot.templateGif = false
                setbot.templateMsg = false
                setbot.templateLocation = true
                m.reply(mess.success)
    } else {
                let sections = [
                {
                title: "CHANGE MENU BOT",
                rows: [
                {title: "Template Image", rowId: `setmenu templateImage`, description: `Change menu bot to Template Image`},
                {title: "Template Video", rowId: `setmenu templateVideo`, description: `Change menu bot to Template Video`},
                {title: "Template Gif", rowId: `setmenu templateGif`, description: `Change menu bot to Template Gif`},
                {title: "Template Message", rowId: `setmenu templateMessage`, description: `Change menu bot to Template Message`},
                {title: "Template Location", rowId: `setmenu templateLocation`, description: `Change menu bot to Template Location`}
                ]
                },
                ]
                myBot.sendListMsg(m.chat, `Please select the menu you want to change!`, myBot.user.name, `Hello Owner !`, `Click Here`, sections, m)
                }
  }*/
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
    m.reply('*No olvides dar estrellas*\n\n*Script:* https://github.com\n*Paypal:* https://www.paypal.me')
  }
  break
// CONVERTER

  case 'sticker': {
    if (!quoted) return m.reply(`Responder video/imagen ${prefix + command} name sticker`)
    if (text.length > 0){
      name = text
    } else {
      name = global.packname
    }
    if (/image/.test(mime)) {
      m.reply(LangG.wait)
      let media = await quoted.download()
      let encmedia = await myBot.sendImageAsSticker(m.chat, media, m, { packname: name, author: global.author })
      await fs.unlinkSync(encmedia)
    } else if (/video/.test(mime)) {
      m.reply(LangG.wait)
      if ((quoted.msg || quoted).seconds > 11) return m.reply('Máximo 10 segundos!')
      let media = await quoted.download()
      let encmedia = await myBot.sendVideoAsSticker(m.chat, media, m, { packname: name, author: global.author })
      await fs.unlinkSync(encmedia)
    } else {
      m.reply(`Responder video/imagen ${prefix + command} name sticker\nDuración del video 1-10 segundos`)
    }
  }
  break
  case 'toaudio': {
    if (!quoted) return m.reply('*Responde un video*')
    if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply(`*Ejemplo:* ${prefix + command}`)
    m.reply(LangG.wait)
    let media = await quoted.download()
    let { toAudio } = require('./lib/converter')
    let audio = await toAudio(media, 'mp4')
    myBot.sendMessage(m.chat, {audio: audio, mimetype: 'audio/mpeg'}, { quoted : m })
  }
  break
  case 'tomp4': {
    if (!quoted) return m.reply('*Responder Sticker*')
    if (!/webp/.test(mime)) return m.reply(`*Ejemplo:* ${prefix + command}`)
    m.reply(LangG.wait)
		let { webp2mp4File } = require('./lib/uploader')
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    let webpToMp4 = await webp2mp4File(media)
    await myBot.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: 'Convert Webp To Video' } }, { quoted: m })
    await fs.unlinkSync(media)
  }
  break
  case 'toimg': {
    if (!quoted) return m.reply('*Responde Un Sticker*')
    if (!/webp/.test(mime)) return m.reply(`*Ejemplo:* ${prefix + command}`)
    m.reply(LangG.wait)
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
    if (!quoted) return m.reply('*Responder Video o Sticker*')
    if (!/webp/.test(mime)) return m.reply(`*Ejemplo:* ${prefix + command}`)
    m.reply(LangG.wait)
		let { webp2mp4File } = require('./lib/uploader')
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    let webpToMp4 = await webp2mp4File(media)
    await myBot.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: 'Convert To Video' }, gifPlayback: true }, { quoted: m })
    await fs.unlinkSync(media)
  }
  break
  case 'emojimix': {
    if (!text) return m.reply(`*Ejemplo:* ${prefix + command} 😅+🤔`)
    let [emoji1, emoji2] = text.split`+`
    let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
    for (let res of anu.results) {
      let encmedia = await myBot.sendImageAsSticker(m.chat, res.url, m, { packname: global.packname, author: global.author, categories: res.tags })
      await fs.unlinkSync(encmedia)
		}
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
        m.reply(LangG.wait)
        let media = await myBot.downloadAndSaveMediaMessage(quoted)
        let ran = getRandom('.mp3')
        exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
          fs.unlinkSync(media)
          if (err) return m.reply(err)
          let buff = fs.readFileSync(ran)
          myBot.sendMessage(m.chat, { audio: buff, mimetype: 'audio/mpeg' }, { quoted : m })
          fs.unlinkSync(ran)
        })
      } else m.reply(`Responda al audio que desea modificar *${prefix + command}*`)
    } catch (e) {
      m.reply(e)
    }
  break
// DOWNLOADS
  case 'yt': {
    if (!text) return m.reply(`Que deseas busacar?\n*Ejemplo:* ${prefix + command} Blinding Live`)
    try {
      let yts = require("yt-search")
      let search = await yts(text)
      let teks = 'YouTube Search\n\nResultado de: *'+text+'*\n\n'
      search.all.map((video) => {
        teks += '*' + video.title + '* - ' + video.url + '\n'
      });
      myBot.sendMessage(m.chat, { image: { url: search.all[0].thumbnail },  caption: teks }, { quoted: m })
    } catch (e) { log(pint(e, 'pink')) }
  }
  break
  case 'song': {
    if(!text) return m.reply(`*Necesito el link.*\nEjemplo: ${prefix}song https://youtu.be/Z6L4u2i97Rw`)
    try {
      m.reply(LangG.wait)
      ytm = await yta(text)
      if(Number(ytm.size.split(' MB')[0]) >= 99.00) return myBot.sendImage(m.chat, ytm.thumb, `*Link* : ${ytm.link}\n\n🤖 Descarga no permitida por whatsapp.\nDescargalo manual.`, m)
      await myBot.sendImage(m.chat, ytm.thumb, `⭔ Título: ${ytm.title}\n⭔ Tamaño: ${ytm.size}\n⭔ Ext: ${ytm.tipe}`, m)
      await myBot.sendMessage(m.chat, { audio: { url: ytm.link }, mimetype: 'audio/mpeg', fileName: `${ytm.title}.mp3` }, { quoted: m })
    } catch {
      m.reply('🤖 Parece que tenemos un error.')
    }
  }
  break
  case 'video': {
    //const ytdl = require('ytdl-core');
    if(!text) return m.reply(`*Necesito el link.*\nEjemplo: ${prefix}video https://youtu.be/KRaWnd3LJfs`)
    try {
      m.reply(LangG.wait)
      ytm = await ytv(text)
      if(Number(ytm.size.split(' MB')[0]) >= 99.00) return myBot.sendImage(m.chat, ytm.thumb, `*Link* : ${ytm.link}\n\n🤖 Descarga no permitida por whatsapp.\nDescargalo manual.`, m)
      await myBot.sendMessage(m.chat, { video: { url: ytm.link }, mimetype: 'video/mp4', fileName: `${ytm.title}.mp4`, caption: `⭔ Título: ${ytm.title}` }, { quoted: m })
    } catch {
      m.reply('🤖 Parece que tenemos un error.')
    }
  }
  break
  case 'wallpaper': {
    if (!text) return m.reply('Que deseas buscar?')
    try {
      let { wallpaper } = require('./lib/scraper')
      anu = await wallpaper(text)
      result = anu[Math.floor(Math.random() * anu.length)]
      let buttons = [
        {buttonId: `wallpaper ${text}`, buttonText: {displayText: 'Siguiente'}, type: 1}
      ]
      let buttonMessage = {
        image: { url: result.image[0] },
        caption: `⭔ Título: ${result.title}\n⭔ Categoría: ${result.type}\n⭔ Detalle: ${result.source}\n⭔ Url: ${result.image[2] || result.image[1] || result.image[0]}`,
        footer: myBot.user.name,
        buttons: buttons,
        headerType: 4
      }
      await myBot.sendMessage(m.chat, buttonMessage, { quoted: m })
    } catch (e) { log(pint(e, 'pink')) }
  }
  break
  case '2wallpaper': {
    if (!text) return m.reply(`*Ejemplo:* ${prefix + command} Mia Khalifa`)
    res = gis(`wallpaper 4k ${text}`, google)
    async function google(error, result){
      if (error){
        await m.reply('🤖 Parece que tenemos un error.');
      } else {
        var gugWp = result
        var randomWp =  gugWp[Math.floor(Math.random() * gugWp.length)].url
        let buttons = [
          {buttonId: `2wallpaper ${text}`, buttonText: {displayText: 'Siguiente'}, type: 1}
        ]
        let buttonMessage = {
          image: { url: randomWp },
          caption: `*-----「 ${botName} 」-----*`,
          footer: myBot.user.name,
          buttons: buttons,
          headerType: 4
        }
        await myBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      }
    }
  }
  break
  case 'img': {
    if (!text) return m.reply(`*Ejemplo:* ${prefix + command} Mia Khalifa`)
    res = gis(`${text}`, google)
    async function google(error, result){
      if (error){
        await m.reply('🤖 Parece que tenemos un error.');
      } else {
        var gugWp = result
        var randomWp =  gugWp[Math.floor(Math.random() * gugWp.length)].url
        let buttons = [
          {buttonId: `img ${text}`, buttonText: {displayText: 'Siguiente'}, type: 1}
        ]
        let buttonMessage = {
          image: { url: randomWp },
          caption: `*-----「 ${botName} 」-----*`,
          footer: myBot.user.name,
          buttons: buttons,
          headerType: 4
        }
        await myBot.sendMessage(m.chat, buttonMessage, { quoted: m })
      }
    }
  }
  break
  case 'calc': {
    if (!text) return m.reply('que operación matematica deseas realizar?')
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
      if (e == undefined) log('contenido?')
      m.reply('Formato incorrecto, solo 0-9 y Símbolos soportados -, +, *, /, ×, ÷, π, e, (, )')
    }
  }
  break
// TOOLS
  case 'ebinary': {
    if (!m.quoted.text && !text) return m.reply(`Enviar/responder texto ${prefix + command}`)
    let { eBinary } = require('./lib/binary')
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    let eb = await eBinary(teks)
    m.reply(eb)
  }
  break
  case 'dbinary': {
    if (!m.quoted.text && !text) return m.reply(`Enviar/responder texto ${prefix + command}`)
    let { dBinary } = require('./lib/binary')
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    let db = await dBinary(teks)
    m.reply(db)
  }
  break
  case 'bot': {
    if (!text) return m.reply("🤖 *Si aquí estoy*")
    await axios.get(`https://api.simsimi.net/v2/?text=${text}&lc=es&cf=true`).then((response) => {
    try{
      const { text } = response.data.messages[0]
      if (text ==='Roberto' || text === 'maite' || text === 'Luis Mario.' || text === 'Ricardo milos\n') {
        m.reply('🤖 ' + `mi nombre es ${botName}`)
      }	else {
        m.reply('🤖 ' + text)
      }
    } catch (err) {
      log(pint(err, 'red.'))
    }
    })
  }
  break
  case 'bin': {
    if (!text) return m.reply('Necesito el BIN')
    await axios.get(`https://lookup.binlist.net/${args[0]}`).then(async (response) => {
    json = response.data
    m.reply(
      `💳 *BIN:* ${args[0]}\n` + 
    	' *TIPO:*\n' + 
    	json.scheme + '\n' + 
    	json.type + '\n' + 
      json.brand + '\n' + 
      ' *PAIS:*\n' + 
      json.country.emoji + ' ' + 
      json.country.name + '\n' + 
      json.country.currency + '\n' + 
      ' *BANCO:*\n' + 
      json.bank.name
    )
  })
  }break
  case 'cambio': {
    if (!text) return m.reply('Ingresa divisas y valor a convertir.\n*Ejemplo:* usd,cop,1')
    key = 'bcab649da87b8cc8e5f000d0'
    if (!key) return m.reply('Falta la key!')
    if (text.includes(',') && verify(text) == 2) {
    	var split = text.split(',')
    	a = split[0].trim()
    	b = split[1].trim()
    	am = split[2].trim()
    }
    else {
     return m.reply('Hay un error, Ejemplo: *usd,cop,1*')
    }
    await axios.get(`https://v6.exchangerate-api.com/v6/${key}/pair/${a}/${b}/${am}`).then(async (response) => {
      var {conversion_rate, conversion_result} = response.data
    	var msg = `*RESULTADO*\n\n*Precio ${a.toUpperCase()}:* ${conversion_rate} ${b.toUpperCase()}\n*${b.toUpperCase()}:* ${conversion_result}`
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
    if (!text) return m.reply('Ingresa el Token!')
    key = '1be6e707f54766812254c65612a60298080cf7b26c2ef6ea9e6ea0b0b11b8890'
    if (!key) return m.reply('Falta la key!')
    await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${text.toLowerCase()}&tsyms=USD,COP&api_key={${key}}`).then(async (response) => {
      var {USD, COP} = response.data
    	var msg = `*Token:* ${text.toUpperCase()}\n\n*USD:* ${USD}\n*COP:* ${COP}`
    	m.reply(msg)
    })
  }break
  case 'shazam': {
    if (/image/.test(mime)) return m.reply('*No se pueden analizar imagenes, solo audio!*')
    if (/video/.test(mime)) return m.reply(`*No se pueden analizar videos, solo audio!\nSi quieres analizar el audio de este video primero conviertelo con el comando ${prefix}toaudio y despues si puedes usar ${prefix + command}*`)
    const acrcloud = require("acrcloud")
    const acr = new acrcloud({ 
        host: "identify-eu-west-1.acrcloud.com",
        access_key: "a7982a1f271fc390f3a69cb5bac04498",
        access_secret: "QPbD6UOnfawRtUiH88lzKx7edUaX20I0erUWCoCW"
    })
    m.reply(LangG.wait)
    let sampleq = await quoted.download()
    acr.identify(sampleq).then(async (res) => {
    m.reply(
    `*Nombre:* ${res.metadata.music[0].title}\n`+
    `*Artista:* ${res.metadata.music[0].artists[0].name}\n`+
    `*Album:* ${res.metadata.music[0].album.name}\n`+
    `*Fecha:* ${res.metadata.music[0].release_date}`
    )
    })
  }break
// FOR GROUPS
  case 'love': {
    if (!m.isGroup) return m.reply(LangG.group)
    let member = participants.map(u => u.id)
    let me = m.sender
    let rnd = member[Math.floor(Math.random() * member.length)]
    let jawab = `👫 Tu pareja es\n@${me.split('@')[0]} ❤️ @${rnd.split('@')[0]}`
    let ments = [me, rnd]
    let buttons = [
      { buttonId: 'pareja', buttonText: { displayText: 'pareja' }, type: 1 }
    ]
    await myBot.sendButtonText(m.chat, buttons, jawab, myBot.user.name, m, {mentions: ments})
  }
  break
  case 'inventado': {
    if (!m.isGroup) return m.reply(LangG.group)
    let member = participants.map(u => u.id)
    let orang = member[Math.floor(Math.random() * member.length)]
    let jodoh = member[Math.floor(Math.random() * member.length)]
    let jawab = `Inventado 💖 No olvides que el impuesto es 1 🐤\n@${orang.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`
    let menst = [orang, jodoh]
    let buttons = [
      { buttonId: 'inventado', buttonText: { displayText: 'pareja' }, type: 1 }
    ]
    await myBot.sendButtonText(m.chat, buttons, jawab, myBot.user.name, m, {mentions: menst})
  }
  break
  case 'mute': {
    if (!m.isGroup) return m.reply(LangG.group)
    if (!isBotAdmins) return m.reply(LangG.botAdmin)
    if (!isAdmins) return m.reply(LangG.admin)
    if (args[0] === "on") {
      myBot.groupSettingUpdate(m.chat, 'announcement')
      m.reply(`El Admin *${pushname}* ha silenciado este grupo!\nAhora sólo los administradores pueden envíar mensajes.`)
    } else if (args[0] === "off") {
      myBot.groupSettingUpdate(m.chat, 'not_announcement')
      m.reply(`El Admin *${pushname}* ha abierto este grupo!\nAhora todos pueden envíar mensajes.`)
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
    if (!m.isGroup) return m.reply(LangG.group)
    if (!isBotAdmins) return m.reply(LangG.botAdmin)
    if (!isAdmins) return m.reply(LangG.admin)
    if (args[0] === "on") {
      if (db.data.chats[m.chat].antilink) return m.reply(`Anteriormente activo`)
      db.data.chats[m.chat].antilink = true
      m.reply('*Antilink Activado*')
    } else if (args[0] === "off") {
      if (!db.data.chats[m.chat].antilink) return m.reply(`Anteriormente inactivo`)
      db.data.chats[m.chat].antilink = false
      m.reply('*Antilink Desactivado*')
    } else {
      let buttons = [
        { buttonId: 'antilink on', buttonText: { displayText: 'ON' }, type: 1 },
        { buttonId: 'antilink off', buttonText: { displayText: 'OFF' }, type: 1 }
      ]
      await myBot.sendButtonText(m.chat, buttons, `MOD ANTILINK`, myBot.user.name, m)
    }
  }
  break
  case 'kick': {
		if (!m.isGroup) return m.reply(LangG.group)
    if (!isBotAdmins) return m.reply(LangG.botAdmin)
    if (!isAdmins) return m.reply(LangG.admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'remove').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
	case 'add': {
		if (!m.isGroup) return m.reply(LangG.group)
    if (!isBotAdmins) return m.reply(LangG.botAdmin)
    if (!isAdmins) return m.reply(LangG.admin)
		let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'add').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
	case 'promote': {
		if (!m.isGroup) return m.reply(LangG.group)
    if (!isBotAdmins) return m.reply(LangG.botAdmin)
    if (!isAdmins) return m.reply(LangG.admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
	case 'demote': {
		if (!m.isGroup) return m.reply(LangG.group)
    if (!isBotAdmins) return m.reply(LangG.botAdmin)
    if (!isAdmins) return m.reply(LangG.admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
  case 'tagall': {
    if (!m.isGroup) return m.reply(LangG.group)
    if (!isBotAdmins) return m.reply(LangG.botAdmin)
    if (!isAdmins) return m.reply(LangG.admin)

    let ini = "╔══✪〘 *REPORTENSE* 〙✪══\n"
    let mesaj = `➲ *Mensaje:* ${q ? q : ''}\n\n`
    let end = `╚══✪〘 *${botName}* 〙✪══`

    for (let mem of participants) {
      mesaj += `${global.sp} @${mem.id.split('@')[0]}\n`
      tga = `${ini}${mesaj}${end}`
    }
    myBot.sendMessage(m.chat, { text: tga, mentions: participants.map(a => a.id) }, { quoted: m })
  }
  break
  case 'hdt': {
    if (!m.isGroup) return m.reply(LangG.group)
    if (!isBotAdmins) return m.reply(LangG.botAdmin)
    if (!isAdmins) return m.reply(LangG.admin)
    myBot.sendMessage(m.chat, { text: q ? q : '' , mentions: participants.map(a => a.id)}, { quoted: m })
  }
  break
  case'linkgroup': {
    if (!m.isGroup) return m.reply(LangG.group)
    const inviteCode = await myBot.groupInviteCode(m.chat)
    const { subject } = await myBot.groupMetadata(m.chat)
    const caption = `*Nombre del Grupo:* *${subject}*\n\n*Link del grupo:* https://chat.whatsapp.com/${inviteCode}`
    try { pic = await myBot.profilePictureUrl(m.chat, 'image') } catch (e) { pic = global.thumb }
    myBot.sendImage(m.chat, pic, caption, m)
  }
  break
// END GROUPS
  case 'join': {
    if (!isCreator) return m.reply(LangG.owner)
    if (!text) return m.reply('Necesito el enlace de invitación!')
    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) m.reply('Link Invalido!')
    m.reply(LangG.wait)
    let result = args[0].split('https://chat.whatsapp.com/')[1]
    await myBot.groupAcceptInvite(result).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
  }
  break
// FOR OWNER
  case 'react': {
    if (!isCreator) return m.reply(LangG.owner)
      reactionMessage = {
        react: {
          text: args[0],
          key: { remoteJid: m.chat, fromMe: false, id: quoted.id }
        }
      }
      myBot.sendMessage(m.chat, reactionMessage)
  }
  break  
	case 'public': {
    if (!isCreator) return m.reply(LangG.owner)
    myBot.public = true
    m.reply('Sukse Change To Public Usage')
  }
  break
  case 'self': {
    if (!isCreator) return m.reply(LangG.owner)
    myBot.public = false
    m.reply('Sukses Change To Self Usage')
  }
  break
  case 'py': {
    if (!isCreator) return m.reply(LangG.owner)
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
    if (!isCreator) return m.reply(LangG.owner)
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
    if (!isCreator) return m.reply(LangG.owner)
    await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
      myBot.sendMessage(m.chat, { text: LangU.UPDATE })
    } else {
      var degisiklikler = LangU.NEW_UPDATE;
      commits['all'].map(
        (commit) => {
          degisiklikler += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
        }
      );
      myBot.sendMessage(m.chat, { text: degisiklikler + '```' })
    }
  }break
  case 'actualizar': {
    if (!isCreator) return m.reply(LangG.owner)
    await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
      myBot.sendMessage(m.chat, { text: LangU.UPDATE })
    } else {
      git.pull((async (err, update) => {
        if(update && update.summary.changes) {
          myBot.sendMessage(m.chat , { text: updater.UPDATED_LOCAL });
              exec('npm install').stderr.pipe(process.stderr);
        } else if (err) {
          myBot.sendMessage(m.chat, { text: '*Error:*\n```' + err + '```' })
        }
      }));
    }
  }break
  case 'block': {
		if (!isCreator) return m.reply(LangG.owner)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.updateBlockStatus(users, 'block').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
  case 'unblock': {
		if (!isCreator) return m.reply(LangG.owner)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.updateBlockStatus(users, 'unblock').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
  case 'bc': case 'broadcast': case 'bcall': {
    if (!isCreator) return m.reply(LangG.owner)
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
    if (!isCreator) return m.reply(LangG.owner)
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
		if (!isCreator) return m.reply(LangG.owner)
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
      if (!isCreator) return m.reply(LangG.owner)
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
      if (!isCreator) return m.reply(LangG.owner)
      try {
        let evaled = await eval(budy.slice(2))
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
        await m.reply(evaled)
      } catch (err) {
        await m.reply(String(err))
      }
    }
    
    if (budy.startsWith('$')) {
      if (!isCreator) return m.reply(LangG.owner)
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
      //m.reply(util.format(err))
      myBot.sendMessage(myBot.user.id, { text: `*-- ${LangErr.msgReport} [ ${botName} ] --*\n` +
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
