/*
  Copyright (C) 2022
  DrkBot-MD - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

require('./config')
const { proto, generateWAMessage, areJidsSameUser, generateWAMessageFromContent, MessageType } = require('@adiwajshing/baileys')
const fs = require('fs')
const util = require('util')
const { exec, spawn, execSync } = require("child_process")
const axios = require('axios')
const path = require('path')
const os = require('os')
const speed = require('performance-now')
const { performance } = require('perf_hooks')
const simpleGit = require('simple-git')
const fetch = require('node-fetch')
const git = simpleGit()
const { formatp, isUrl, sleep, clockString, runtime, getBuffer, fetchJson, jsonformat, format, parseMention, getRandom, pickRandom, modifyLetter } = require('./lib/myfunc')
//const { yta, ytv } = require('./lib/y2mate')
const { log, pint, bgPint } = require('./lib/colores');
const { menu, butTemplate, rules } = require('./plugins/menu')
const Config = require('./config');
const { youtubedlv2, youtubeSearch, tiktokdlv2, googleImage, savefrom } = require('@bochilteam/scraper')
const { y1s, expandUrl, wallpaper } = require('./lib/scraper')

// Language
const myLang = require('./language').getString


module.exports = myBot = async (myBot, m, chatUpdate, store) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        var botName = Config.BOT_NAME
        const prefix = Config.HANDLER.match(/\[(\W*)\]/)[1][0]
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
        
        // New Functions BD
        const { User, addUserKey, totalHit } = require('./src/data')
        const regUser = User.check(m.sender)
        const checkUser = User.show(m.sender)
        const { keysAll, _unlock, _puntosMas, _puntosMenos } = require('./src/keys')
	
        // Group
        const groupMetadata = m.isGroup ? await myBot.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const groupOwner = m.isGroup ? groupMetadata.owner : ''
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const isPremium = global.premium.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false

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

	// reset users every 12 hours
        let cron = require('node-cron')
        cron.schedule('00 12 * * *', () => {
            log(pint('Reseted Data', 'yellow.'))
        }, {
            scheduled: true,
            timezone: global.timeZone
        })

	  // Anti Link
  /*if (budy.match(`chat.whatsapp.com`)) {
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
        
      // Mute Chat
    if (db.data.chats[m.chat].mute && !isAdmins && !isCreator) {
      return
    }*/

        // Respon Cmd with media
        if (isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString('base64'))) {
        let hash = m.msg.fileSha256.toString('base64')
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

      this.game = this.game ? this.game : {}
	    let room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
	    if (room) {
  	    let ok
  	    let isWin = !1
  	    let isTie = !1
  	    let isSurrender = !1
  	    if (!/^([1-9]|(me)?rendirse|off|siguiente)$/i.test(m.text)) return
  	    isSurrender = !/^[1-9]$/.test(m.text)
  	    if (m.sender !== room.game.currentTurn) {
  	      if (!isSurrender) return !0
  	    }
	    if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
  	    m.reply({
    	    '-3': 'Juego Terminado',
    	    '-2': 'Invalido',
    	    '-1': 'Posición Invalida',
    	    0: 'Posición Invalida',
  	    }[ok])
  	    return !0
	    }
	    if (m.sender === room.game.winner) isWin = true
	    else if (room.game.board === 511) isTie = true
	    let arr = room.game.render().map(v => {
  	    return {
  	    X: '❌',
  	    O: '⭕',
  	    1: '1️⃣',
  	    2: '2️⃣',
  	    3: '3️⃣',
  	    4: '4️⃣',
  	    5: '5️⃣',
  	    6: '6️⃣',
  	    7: '7️⃣',
  	    8: '8️⃣',
  	    9: '9️⃣',
  	    }[v]
	    })
	    if (isSurrender) {
	      room.game._currentTurn = m.sender === room.game.playerX
	      isWin = true
	    }
	    let winner = isSurrender ? room.game.currentTurn : room.game.winner
	    let str = `Sala ID: ${room.id}

${BOX.ini.replace('{}','*JUGADORES')}
❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}
${BOX.end}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

${isWin ? `El jugador @${winner.split('@')[0]} es el ganador.` 
: isTie ? 'Empate.\nJuego Terminado' 
: `Turno de: *${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]}*)`}

Escriba *rendirse* para admitir la derrota.`.trim()
  	    if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
  	    room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
  	    if (room.x !== room.o) await myBot.sendText(room.x, str, m, { mentions: parseMention(str) } )
  	    await myBot.sendText(room.o, str, m, { mentions: parseMention(str) } )
  	    if (isTie || isWin) {
  	      delete this.game[room.id]
  	    }
	    }
	    
	    // ACERTIJO
	  let similarity = require('similarity')
    let threshold = 0.72
	  /*id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^ⷮ/i.test(m.quoted.text)) return !0
    this.mstekateki = this.mstekateki ? this.mstekateki : {}
    if (!(id in this.mstekateki)) return m.reply('Ese acertijo ya ha terminado!')
    if (m.quoted.id == this.mstekateki[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.mstekateki[id][1]))
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.response.toLowerCase().trim()) {
            //global.db.data.users[m.sender].exp += this.tekateki[id][2]
            m.reply(`*Respuesta correcta!*`)
            clearTimeout(this.tekateki[id][2])
            delete this.mstekateki[id]
        } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold) m.reply(`Casi lo logras!`)
        else m.reply('Respuesta incorrecta!')
    }*/
	    

// ======== INICIO COMANDOS ========
switch(command) {
  // ======== REGISTRO DB ========
	case 'reg': {
	  if (m.isGroup) return m.reply(myLang('reg').msg)
	  if (regUser === true) return m.reply(myLang('reg').check)
    new User(m.sender, pushname)
    m.reply(myLang('reg').ok)
	}break
	case 'profile': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    let message = '*ID: '+checkUser.id+'*\n'+
      '*Número:* '+checkUser.number.split('@')[0]+'\n'+
      '*Nombre:* '+checkUser.name+'\n'+
      '*Puntos:* '+checkUser.points+'\n'+
      '*Uso del Bot:* '+checkUser.use+'\n'+
      '*Reportes:* '+checkUser.report;
    if (!m.isGroup) {
      message += '\n*Keys:* '+jsonformat(checkUser.keys).replace(/"/g, '*').replace(/,/g, '');
    }
    m.reply(message)
	}break
	case 'rules': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
	  myBot.sendImage(m.chat, rulesImg, rules)
    User.counter(m.sender, {usage: 1})
	}break
	case 'kill': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (args[0] === 'add') {
      User.change(args[1] + "@s.whatsapp.net", {block: true});
    } else if (args[0] === 'del') {
      User.change(args[1] + "@s.whatsapp.net", {block: false});
    }
    User.counter(m.sender, {usage: 1})
	}break
  case 'owner': {
    myBot.sendContact(m.chat, global.owner, m)
    User.counter(m.sender, {usage: 1})
  }break
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
    } else {
      let sections = [
        {
          title: 'OPCIONES DE CAMBIO DE MENÚ',
          rows: [
            {title: "Menú Image", rowId: `setmenu image`, description: `Menú con imagen`},
            {title: "Menú Location", rowId: `setmenu location`, description: `Menú Pequeño`},
            {title: "Menú Template", rowId: `setmenu template`, description: `Menú Botones Template`}
            ]
        },
        ]
      myBot.sendListMsg(m.chat, 'Selecciona el tipo de Munú del Bot', myBot.user.name, `Hola ${pushname}`, '⬆️', sections, m)
    }
    User.counter(m.sender, {usage: 1})
  }break
  case 'alive': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    anu = await modifyLetter(myLang('alive').msg)
    myBot.sendButtonLoc(m.chat, global.thumb, anu, myBot.user.name, 'MENU', 'menu')
    User.counter(m.sender, {usage: 1})
  }break
  case 'menu': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    anu = menu(prefix, pushname, botName, totalHit())
    linkS = ['https://youtu.be/13aBcRrL0oE','https://youtu.be/e-fA-gBCkj0','https://youtu.be/CQLsdm1ZYAw','https://youtu.be/Bznxx12Ptl0','https://youtu.be/u9LH_y159sg','https://youtu.be/HhjHYkPQ8F0','https://youtu.be/nPvuNsRccVw','https://youtu.be/KRaWnd3LJfs','https://youtu.be/KBtk5FUeJbk','https://youtu.be/ZaflNU45bVY','https://youtu.be/D9G1VOjN_84']
    let enlace = {contextInfo: {externalAdReply: {title: 'MUSICA SELECCIONADA',body: 'Link :)',sourceUrl: linkS[Math.floor(linkS.length * Math.random())],thumbnail: global.miniRobot}}}
    if(global.typeMenu === 'image') {
      myBot.sendButton(m.chat, anu, myBot.user.name, global.thumb, [['MENU','menu'],['OWNER','owner'],['GITHUB','sc']], m, enlace)
    } else if(global.typeMenu === 'template') {
      myBot.send5ButImg(m.chat, anu, myBot.user.name, global.thumb, butTemplate)
    } else if(global.typeMenu === 'location') {
      myBot.sendButtonLoc(m.chat, global.thumb, anu, myBot.user.name, 'REGLAS', 'rules')
    }
    User.counter(m.sender, {usage: 1})
  }break
  case 'donar': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    txtt = `Hola *${pushname}*\nVEO QUE QUIERES DONAR\nPuedes hacerlo por medio de las siguientes formas disponibles`
    ftext = 'Tu donasión será muy valiosa'

    let buttons = [
      { buttonId: `${prefix}ppal`, buttonText: { displayText: 'Paypal' }, type: 1 },
      { buttonId: `${prefix}nqui`, buttonText: { displayText: 'Nequi' }, type: 1 },
      { buttonId: `${prefix}dvplata`, buttonText: { displayText: 'DaviPlata' }, type: 1 }
    ]
    await myBot.sendButtonText(m.chat, buttons, txtt, ftext, m)
    User.counter(m.sender, {usage: 1})
  }break
  case 'sc': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    let texto = `*@${m.sender.split`@`[0]}*\n\n*${myLang('sc').msg}*`
    let aa = { quoted: m, userJid: myBot.user.id }
    let prep = generateWAMessageFromContent(m.chat, { extendedTextMessage: { text: texto, contextInfo: { externalAdReply: { title: 'Official GitHub', body: null, thumbnail: thumb, sourceUrl: sourceCode }, mentionedJid: [m.sender]}}}, aa)    
    myBot.relayMessage(m.chat, prep.message, { messageId: prep.key.id, mentions: [m.sender] })
    User.counter(m.sender, {usage: 1})
  }break
// CONVERTER
  case 'sticker': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!quoted) return m.reply(myLang('sticker').quot.replace('{}', prefix+command))
    if (text.length > 0){
      name = text
    } else {
      name = botName
    }
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    if (/image|webp/.test(mime)) {
      let media = await quoted.download()
      let encmedia = await myBot.sendImageAsSticker(m.chat, media, m, { packname: name, author: global.author })
      await fs.unlinkSync(encmedia)
    } else if (/video/.test(mime)) {
      if ((quoted.msg || quoted).seconds > 11) return m.reply(myLang('sticker').time_wait)
      let media = await quoted.download()
      let encmedia = await myBot.sendVideoAsSticker(m.chat, media, m, { packname: name, author: global.author })
      await fs.unlinkSync(encmedia)
    } else {
      m.reply(myLang('sticker').end.replace('{}', prefix+command))
    }
    User.counter(m.sender, {usage: 1})
  }break
  case 'toaudio': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!quoted) return m.reply(myLang('to_audio').quot)
    if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply(myLang('to_audio').q_audio)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    let media = await quoted.download()
    let { toAudio } = require('./lib/converter')
    let audio = await toAudio(media, 'mp4')
    myBot.sendMessage(m.chat, {audio: audio, mimetype: 'audio/mpeg'}, { quoted : m })
    User.counter(m.sender, {usage: 1})
  }break
  case 'tomp4': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!quoted) return m.reply(myLang('to_mp4').quot)
    if (!/webp/.test(mime)) return m.reply(myLang('to_mp4').q_video)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
		let { webp2mp4File } = require('./lib/uploader')
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    let webpToMp4 = await webp2mp4File(media)
    await myBot.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: myLang('global').by.replace('{}', botName) } }, { quoted: m })
    await fs.unlinkSync(media)
    User.counter(m.sender, {usage: 1})
  }break
  case 'toimg': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!quoted) return m.reply(myLang('to_img').quot)
    if (!/webp/.test(mime)) return m.reply(myLang('to_img').q_img)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    let ran = await getRandom('.png')
    exec(`ffmpeg -i ${media} ${ran}`, (err) => {
      fs.unlinkSync(media)
      if (err) m.reply(err)
      let buffer = fs.readFileSync(ran)
      myBot.sendMessage(m.chat, { image: buffer }, { quoted: m })
      fs.unlinkSync(ran)
    })
    User.counter(m.sender, {usage: 1})
  }break
  case 'togif': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!quoted) return m.reply(myLang('to_gif').quot)
    if (!/webp/.test(mime) && !/video/.test(mime)) return m.reply(myLang('to_gif').q_gif)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
		let { webp2mp4File } = require('./lib/uploader')
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    let webpToMp4 = await webp2mp4File(media)
    await myBot.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: myLang('global').by.replace('{}', botName) }, gifPlayback: true }, { quoted: m })
    await fs.unlinkSync(media)
    User.counter(m.sender, {usage: 1})
  }break
  case 'tourl': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
		let { UploadFileUgu, webp2mp4File, TelegraPh } = require('./lib/uploader')
    let media = await myBot.downloadAndSaveMediaMessage(quoted)
    if (/image|audio/.test(mime)) {
    let anu = await TelegraPh(media)
      m.reply(util.format(anu))
    } else if (/video/.test(mime)) {
      if ((quoted.msg || quoted).seconds > 11) return m.reply(myLang('sticker').time_wait)
      let anu = await TelegraPh(media)
      m.reply(util.format(anu))
    } else {
      m.reply(myLang('removebg').err)
    }
    await fs.unlinkSync(media)
    User.counter(m.sender, {usage: 1})
  }break
  case 'emojimix': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('emojimix').msg.replace('{}', prefix+command))
    let [emoji1, emoji2] = text.split`+`
    let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
    for (let res of anu.results) {
      let encmedia = await myBot.sendImageAsSticker(m.chat, res.url, m, { packname: botName, author: global.author, categories: res.tags })
      await fs.unlinkSync(encmedia)
		}
	  User.counter(m.sender, {usage: 1})
  }break
  case 'trt': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
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
    User.counter(m.sender, {usage: 1})
  }break
  case 'removebg': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!/image/.test(mime)) return m.reply(myLang('removebg').msg.replace('{}', prefix+command))
    let { removeBackgroundFromImageFile, RemoveBgError } = require('remove.bg')
    let apirnobg = ['HBbdxnge4BVXJwqhcAHqVC', 'uHUYM1Wo4QcrFsqGbWoMr2zi', 'qySfrLUKRQejaMoJ54LHpShB']
    let apinobg = apirnobg[Math.floor(Math.random() * apirnobg.length)]
    hmm = await './src/remobg-'+getRandom('')
    localFile = await myBot.downloadAndSaveMediaMessage(quoted, hmm)
    outputFile = await './src/hremo-'+getRandom('.png')
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    removeBackgroundFromImageFile({
      path: localFile,
      apiKey: apinobg,
      size: "regular",
      type: "auto",
      scale: "100%",
      outputFile 
    }).then(async (result) => {
      myBot.sendMessage(m.chat, {image: fs.readFileSync(outputFile), caption: myLang('global').by.replace('{}', botName) }, { quoted : m })
	    User.counter(m.sender, {usage: 1})
      await fs.unlinkSync(localFile)
      await fs.unlinkSync(outputFile)
    }).catch((error) => {
      fs.unlinkSync(localFile)
      if(error[0].code === 'insufficient_credits') {
        m.reply(myLang('removebg').err)
        myBot.sendText(global.owner+'@s.whatsapp.net', 'Cambiar ApiKey removebg!')
      }
    });
  }break
  case 'bass': case 'blown': case 'deep': case 'earrape': case 'fast': case 'fat': case 'nightcore': case 'reverse': case 'robot': case 'slow': case 'smooth': case 'tupai':
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
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
        let media = await myBot.downloadAndSaveMediaMessage(quoted)
        let ran = getRandom('.mp3')
        exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
          fs.unlinkSync(media)
          if (err) return m.reply(err)
          let buff = fs.readFileSync(ran)
          myBot.sendMessage(m.chat, { audio: buff, mimetype: 'audio/mpeg' }, { quoted : m })
          User.counter(m.sender, {usage: 1})
          fs.unlinkSync(ran)
        })
      } else m.reply(myLang('voz_modify').msg)
    } catch (e) {
      throw e
    }
  break
// DOWNLOADS
  case 'play': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('play').msg.replace('{}', prefix+command))
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try {
      ytm = await youtubeSearch(text)
      let { thumbnail, title, url } = ytm.video[0]
      let buttons = [
        { buttonId: `song ${url}`, buttonText: { displayText: 'AUDIO' }, type: 1 },
        { buttonId: `video ${url}`, buttonText: { displayText: 'VIDEO' }, type: 1 }
      ]
      myBot.sendButImage(m.chat, thumbnail, `*${title}*`, myBot.user.name, buttons)
      User.counter(m.sender, {usage: 1})
    } catch (e) {
      throw e
      m.reply(myLang('global').err)
    }
  }break
  case 'ttdl': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('ttdl').msg.replace('{}', prefix+command))
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try {
      let { video } = await tiktokdlv2(text)
      await myBot.sendMessage(m.chat, { video: { url: video.no_watermark }, mimetype: 'video/mp4', fileName: `tiktokdl.mp4`, caption: myLang('global').by.replace('{}', botName) }, { quoted: m })
      User.counter(m.sender, {usage: 1})
    } catch (e) {
      throw e
      m.reply(myLang('global').err)
    }
  }break
  case 'yts': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('yts').msg.replace('{}', prefix+command))
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try {
      search = await youtubeSearch(text)
      let teks = myLang('yts').res +' *'+text+'*\n\n'
      search.video.map((video) => {
        teks += '*' + video.title + '* - ' + video.url + '\n'
      });
      myBot.sendImage(m.chat, search.video[0].thumbnail, teks)
      User.counter(m.sender, {usage: 1})
    } catch (e) {
      throw e
      m.reply(myLang('global').err)
    }
  }break
  case 'song': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('song').msg.replace('{}', prefix))
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    /*let down = await y1s('mp3', await expandUrl(text))
    if(!down.status) return m.reply(myLang('global').err)
    let tsize = down.size.split(' ')[1]
    let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${down.dlink}`);
    if(!down.dlink) return m.reply(myLang('global').err)
    if(down.size.split('.')[0].split(' ')[0] > 150 && tsize != 'KB' || tsize == "GB") return myBot.sendImage(m.chat, down.thumbnail, myLang('video').big_size.replace('{}', tiny.data), m)
    await myBot.sendMessage(m.chat, { audio: { url: down.dlink }, mimetype: 'audio/mpeg', fileName: `${down.title}.mp3`}, {quoted: m})*/
    try{
      let ytm = await youtubedlv2(text)
      let link = await ytm.audio['128kbps'].download()
      await myBot.sendMessage(m.chat, { audio: { url: link }, mimetype: 'audio/mpeg', fileName: `${ytm.title}.mp3` }, { quoted: m })
      User.counter(m.sender, {usage: 1})
    } catch (e) {
      throw e
      m.reply(myLang('global').err)
    }
  }break
  case 'video': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('video').msg.replace('{}', prefix))
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    /*let down = await y1s('mp4', await expandUrl(text))
    if(!down.status) return m.reply(myLang('global').err)
    let tsize = down.size.split(' ')[1]
    let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${down.dlink}`);
    if(!down.dlink) return m.reply(myLang('global').err)
    if(down.size.split('.')[0].split(' ')[0] > 150 && tsize != 'KB' || tsize == "GB") return myBot.sendImage(m.chat, down.thumbnail, myLang('video').big_size.replace('{}', tiny.data), m)
    await myBot.sendMessage(m.chat, { video: { url: down.dlink }, mimetype: "video/mp4", fileName: down.title, caption: myLang('video').caption.replace('{}', down.title) }, {quoted: m})*/
    try {
      const ytm = await youtubedlv2(text)
      const link = await ytm.video['360p'].download()
      await myBot.sendMessage(m.chat, { video: { url: link }, mimetype: 'video/mp4', fileName: `${ytm.title}.mp4`, caption: myLang('video').caption.replace('{}', ytm.title) }, { quoted: m })
      User.counter(m.sender, {usage: 1})
    } catch (e) {
      throw e
      m.reply(myLang('global').err)
    }
  }break
  case 'getmusic': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('get_down').msg.replace('{}', prefix+command))
    if (!m.quoted) return m.reply(myLang('get_down').quot)
    if (!m.quoted.isBaileys) return m.reply(myLang('get_down').no_me)
		let urls = quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
    if (!urls) return m.reply(myLang('get_down').quot)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    /*let down = await y1s('mp3', urls[text - 1])
    if(!down.status) return m.reply(myLang('global').err)
    let tsize = down.size.split(' ')[1]
    let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${down.dlink}`);
    if(!down.dlink) return m.reply(myLang('global').err)
    if(down.size.split('.')[0].split(' ')[0] > 150 && tsize != 'KB' || tsize == "GB") return myBot.sendImage(m.chat, down.thumbnail, myLang('video').big_size.replace('{}', tiny.data), m)
    await myBot.sendImage(m.chat, down.thumbnail, myLang('song').caption.replace('{}', down.title).replace('{}', down.size).replace('{}', down.fquality), m)
    await myBot.sendMessage(m.chat, {document: {url: down.dlink}, mimetype: 'audio/mpeg', fileName: `${down.title}.mp3`}, {quoted: m})*/
    try {
      let ytm = await youtubedlv2(urls[text - 1])
      let link = await ytm.audio['128kbps'].download()
      await myBot.sendMessage(m.chat, { audio: { url: link }, mimetype: 'audio/mpeg', fileName: `${ytm.title}.mp3` }, { quoted: m })
      User.counter(m.sender, {usage: 1})
    } catch (e) {
      throw e
      m.reply(myLang('global').err)
    }
  }break
  case 'getvideo': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('get_down').msg.replace('{}', prefix+command))
    if (!m.quoted) return m.reply(myLang('get_down').quot)
    if (!m.quoted.isBaileys) return m.reply(myLang('get_down').no_me)
		let urls = quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
    if (!urls) return m.reply(myLang('get_down').quot)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    /*let down = await y1s('mp4', urls[text - 1])
    if(!down.status) return m.reply(myLang('global').err)
    let tsize = down.size.split(' ')[1]
    let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${down.dlink}`);
    if(!down.dlink) return m.reply(myLang('global').err)
    if(down.size.split('.')[0].split(' ')[0] > 150 && tsize != 'KB' || tsize == "GB") return myBot.sendImage(m.chat, down.thumbnail, myLang('video').big_size.replace('{}', tiny.data), m)
    await myBot.sendMessage(m.chat, { video: { url: down.dlink }, mimetype: "video/mp4", fileName: down.title, caption: myLang('video').caption.replace('{}', down.title) }, {quoted: m})*/
    try {
      let ytm = await youtubedlv2(urls[text - 1])
      let link = await ytm.video['360p'].download()
      User.counter(m.sender, {usage: 1})
    } catch (e) {
      throw e
      m.reply(myLang('global').err)
    }
  }break
  case 'waifu': case 'neko': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try {
      res = await fetchJson(`https://api.waifu.pics/nsfw/${command}`)
      let buttons = [
        { buttonId: command, buttonText: { displayText: '➡️' }, type: 1 }
      ]
      myBot.sendButImage(m.chat, res.url, myLang('global').by.replace('{}', botName), myBot.user.name, buttons)
      User.counter(m.sender, {usage: 1})
    } catch {
      m.reply(myLang('global').msg.err);
    }
  }break
  case 'wallpaper': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('img').msg.replace('{}', prefix+command))
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try {
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
      User.counter(m.sender, {usage: 1})
    } catch { m.reply(myLang('global').msg.err) }
  }break
  case 'img': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(myLang('img').msg.replace('{}', prefix+command))
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try {
      let res = await googleImage(text);
      let rndImg = await res[Math.floor(Math.random() * res.length)]
      
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
      User.counter(m.sender, {usage: 1})
    } catch { m.reply(myLang('global').msg.err); }
  }break
  case 'ssweb': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply('Necesito la url.')
    const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
    if (!regex.test(text)) return m.reply('Necesito una url valida.')
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    let img = await fetchJson(`https://api.apiflash.com/v1/urltoimage?access_key=9260ae15ebae448692cae6a5809c6e85&full_page=true&format=png&response_type=json&url=${text}`)
    myBot.sendImage(m.chat, img.url, 'DrkBot', m)
    User.counter(m.sender, {usage: 1})
  }break
  case 'calc': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
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
      User.counter(m.sender, {usage: 1})
    } catch (e) {
      if (e == undefined) return m.reply(myLang('calc').err)
    }
  }break
// TOOLS
  case 'ebinary': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!m.quoted && !text) return m.reply(myLang('binary').encode.replace('{}', prefix+command))
    let { eBinary } = require('./lib/binary')
    teks = text ? text : m.quoted.text
    m.reply( await eBinary(teks) )
    User.counter(m.sender, {usage: 1})
  }break
  case 'dbinary': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!m.quoted) return m.reply(myLang('binary').decode.replace('{}', prefix+command))
    let { dBinary } = require('./lib/binary')
    m.reply( await dBinary(m.quoted.text) )
    User.counter(m.sender, {usage: 1})
  }break
  case 'bot': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
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
      User.counter(m.sender, {usage: 1})
    } catch (err) { m.reply(myLang('global').err) }
    })
  }break
  case 'gpt': {
    //myBot.sendMessage(m.chat, {react: {text: '🚧', key: m.key}})
    //return myBot.sendImage(m.chat, global.maintenance, '⚠️', m)
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (checkUser.points < 3000) return m.reply(myLang('ia').gpt_no_points.replace('{}', 3000 - checkUser.points))
    
    msg = 'Ingrese o responda solo texto.'
    if (/audio/.test(mime)) return m.reply(msg)
    if (/image/.test(mime)) return m.reply(msg)
    if (/video/.test(mime)) return m.reply(msg)
    if (!m.quoted && !text) return m.reply(myLang('ia').gpt_msg)
    
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try {
      const { Configuration, OpenAIApi } = require("openai");
  
      const configuration = new Configuration({
        apiKey: process.env.OPEN_AI_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text ? text : m.quoted.text,
        temperature: 0.5,
        max_tokens: 500,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["You:"],
      });
      myBot.sendMessage(m.chat, { text: response.data.choices[0].text.trim() }, { quoted: m })
      User.counter(m.sender, {usage: 1})
    } catch { m.reply(myLang('global').msg.err) }
  }break
  case 'bin': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
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
    User.counter(m.sender, {usage: 1})
  }break
  case 'cambio': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
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
    User.counter(m.sender, {usage: 1})
  }break
  case 'price': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply('Token?')
    key = '1be6e707f54766812254c65612a60298080cf7b26c2ef6ea9e6ea0b0b11b8890'
    if (!key) throw m.reply('Falta la key!')
    await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${text.toLowerCase()}&tsyms=USD,COP&api_key={${key}}`).then(async (response) => {
      var {USD, COP} = response.data
    	var msg = `*Token:* ${text.toUpperCase()}\n\n*USD:* ${USD}\n*COP:* ${COP}`
    	m.reply(msg)
    })
    User.counter(m.sender, {usage: 1})
  }break
  case 'shazam': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (/image/.test(mime)) return m.reply(myLang('shazam').image)
    if (/video/.test(mime)) return m.reply(myLang('shazam').video.replace('{}',prefix+command))
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try {
      const acrcloud = require("acrcloud")
      const acr = new acrcloud({ 
          host: "identify-eu-west-1.acrcloud.com",
          access_key: "a7982a1f271fc390f3a69cb5bac04498",
          access_secret: "QPbD6UOnfawRtUiH88lzKx7edUaX20I0erUWCoCW"
      })
      let sampleq = await quoted.download()
      acr.identify(sampleq).then(async (res) => {
      m.reply(
      `🎶 ${res.metadata.music[0].title}\n`+
      `🎤 ${res.metadata.music[0].artists[0].name}\n`+
      `💽 ${res.metadata.music[0].album.name}\n`+
      `📆 ${res.metadata.music[0].release_date}`
      )
      })
      User.counter(m.sender, {usage: 1})
    } catch (e) { m.reply(myLang('global').err) }
  }break
// FOR GROUPS
  // GAMES
  case 'dados': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    let da = ['./src/media/1.webp', './src/media/2.webp', './src/media/3.webp', './src/media/4.webp', './src/media/5.webp', './src/media/6.webp'];
    let res = pickRandom(da)
    if (res === './src/media/1.webp') {
      await myBot.sendMedia(m.chat, res, 'Bot', 'MD', m, {asSticker: true})
      User.counter(m.sender, {usage: 1, cash: 2})
    } else if (res === './src/media/2.webp') {
      await myBot.sendMedia(m.chat, res, 'Bot', 'MD', m, {asSticker: true})
      User.counter(m.sender, {usage: 1, cash: 4})
    } else if (res === './src/media/3.webp') {
      await myBot.sendMedia(m.chat, res, 'Bot', 'MD', m, {asSticker: true})
      User.counter(m.sender, {usage: 1, cash: 6})
    } else if (res === './src/media/4.webp') {
      await myBot.sendMedia(m.chat, res, 'Bot', 'MD', m, {asSticker: true})
      User.counter(m.sender, {usage: 1, cash: 8})
    } else if (res === './src/media/5.webp') {
      await myBot.sendMedia(m.chat, res, 'Bot', 'MD', m, {asSticker: true})
      User.counter(m.sender, {usage: 1, cash: 10})
    } else if (res === './src/media/6.webp') {
      await myBot.sendMedia(m.chat, res, 'Bot', 'MD', m, {asSticker: true})
      User.counter(m.sender, {usage: 1, cash: 12})
    }
  }break
  case 'ppt': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!text) return m.reply(`Seleccione piedra/papel/tijera\n\nEjemplo : *${prefix + command}* piedra`)
    const choices = ['piedra', 'papel', 'tijera'];
    while (!choices.includes(text)) {
      return m.reply('Opción inválida. Elije: piedra, papel o tijera')
    }
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    if (text === computerChoice) {
      m.reply(`EMPATE\nTu: ${text} -- 🤖: ${computerChoice}`)
      User.counter(m.sender, {usage: 1, cash: 10})
    } else if (text === "piedra" && computerChoice === "tijera" ||
               text === "papel" && computerChoice === "piedra" ||
               text === "tijera" && computerChoice === "papel") {
      m.reply(`🥳 *GANASTE 20 PUNTOS*\nTu: ${text} -- 🤖: ${computerChoice}`)
      User.counter(m.sender, {usage: 1, cash: 20})
    } else {
      m.reply(`😭 *PERDISTE 20 PUNTOS*\nTu: ${text} -- 🤖: ${computerChoice}`)
      User.counter(m.sender, {usage: 1, cash: -20})
    }
  }break
  case 'slot': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    const suits = ['💎', '♠️', '♣️', '❤️', '💤'];
    let d = '', r = '', k = '';
    for (let i = 0; i < 9; i++) {
      let suit = suits[Math.floor(Math.random() * suits.length)];
      if (i < 3) {
        d += ` ${suit} `;
      } else if (i < 6) {
        r += ` ${suit} `;
      } else {
        k += ` ${suit} `;
      }
    }
    const slt = (lineA, lineB, lineC, msg) => {
      return `${msg}
──────
${lineA}
${lineB}
${lineC}
──────
🔮𝉃𝜄𝜐𝉃𝜍𝜅𝉃𝛾🔮`
    }
    picas = ' ♠️  ♠️  ♠️ '
    diamond = ' 💎  💎  💎 '
    heart = ' ❤️  ❤️  ❤️ '
    clover = ' ♣️  ♣️  ♣️ '
    zzz = ' 💤  💤  💤 '
    if (d == picas || r == picas || k == picas) {
      User.counter(m.sender, {usage: 1, cash: 50})
      myBot.sendText(m.chat, slt(d, r, k, '🥳 *GANASTE 50 PUNTOS*'), m)
    } else if (d == diamond || r == diamond || k == diamond) {
      User.counter(m.sender, {usage: 1, cash: 100})
      myBot.sendText(m.chat, slt(d, r, k, '🥳 *GANASTE 100 PUNTOS*'), m)
    } else if (d == heart || r == heart || k == heart) {
      User.counter(m.sender, {usage: 1, cash: 20})
      myBot.sendText(m.chat, slt(d, r, k, '🥳 *GANASTE 20 PUNTOS*'), m)
    } else if (d == clover || r == clover || k == clover) {
      User.counter(m.sender, {usage: 1, cash: 20})
      myBot.sendText(m.chat, slt(d, r, k, '🥳 *GANASTE 20 PUNTOS*'), m)
    } else if (d == zzz || r == zzz || k == zzz) {
      myBot.sendText(m.chat, slt(d, r, k, '🥶 *BLOQUEADO*'), m)
      User.change(m.sender, {block: true})
    } else {
      User.counter(m.sender, {usage: 1, cash: -20})
      myBot.sendMessage(m.chat, { text: slt(d, r, k, '😭 *PERDISTE 20 PUNTOS*') }, { quoted: m })
      await sleep(2000)
      myBot.sendMessage(m.sender, { text: pickRandom(keysAll) }, { quoted: m })
    }
  }break
  case 'ttt': {
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!text) return m.reply('Necesitas un nombre para la sala.')
    let TicTacToe = require("./lib/tictactoe")
    this.game = this.game ? this.game : {}
    if (Object.values(this.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return m.reply('Todavía estás en un juego.')
    let room = Object.values(this.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
    if (room) {
      //m.reply('Contrincante encontrado!')
      room.o = m.chat
      room.game.playerO = m.sender
      room.state = 'PLAYING'
      let arr = room.game.render().map(v => {
        return {
          X: '❌',
          O: '⭕',
          1: '1️⃣',
          2: '2️⃣',
          3: '3️⃣',
          4: '4️⃣',
          5: '5️⃣',
          6: '6️⃣',
          7: '7️⃣',
          8: '8️⃣',
          9: '9️⃣',
        }[v]
      })
      let str = `Sala ID: ${room.id}

${BOX.ini.replace('{}','*JUGADORES*')}
❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}
${BOX.end}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

Turno de *@${room.game.currentTurn.split('@')[0]}*

Escriba *rendirse* para admitir la derrota.`
      if (room.x !== room.o) await myBot.sendText(room.x, str, m, { mentions: parseMention(str) } )
      await myBot.sendText(room.o, str, m, { mentions: parseMention(str) } )
    } else {
      room = {
        id: 'tictactoe-' + (+new Date),
        x: m.chat,
        o: '',
        game: new TicTacToe(m.sender, 'o'),
        state: 'WAITING'
      }
      if (text) room.name = text
      //m.reply('Esperando contrincante\n\n' + (text ? `Para aceptar el reto escriba: *${prefix}${command} ${text}*` : ''))
      imgLogo = 'https://store-images.s-microsoft.com/image/apps.2005.14057826194083709.67242c47-4fd7-4f1a-9dd6-5d93f6cc10df.f80f14c0-72ab-46ff-86cd-9d801c8e04e8?mode=scale&q=90&h=300&w=300'
      anu = `Esperando contrincante.\n\nPara aceptar reto toca el boton de abajo.`
      myBot.sendButtonLoc(m.chat, imgLogo, anu, 'Juego TicTacToe', 'ACEPTAR JUEGO', `${prefix}${command} ${text}`)
      this.game[room.id] = room
    }
  }break
  case 'delttt': {
    this.game = this.game ? this.game : {}
    try {
      if (this.game) {
        delete this.game
        myBot.sendText(m.chat, 'Sesión de TicTacToe eliminada con éxito', m)
      } else if (!this.game) {
        m.reply('No hay session activa.')
      } else return m.reply('?')
    } catch (e) {
      m.reply('Tenemos un error.')
    }
  }break
  case 'unlock': {
    if (!args[0]) return m.reply('Necesito la Key.')
    if (_unlock.includes(args[0])) {
      User.change(m.sender, {block: false});
      m.reply(`Usaste satisfactoriamente la Key *${args[0]}* para desbloquearte, sigue jugando y acumulando Keys.`)
    } else {
      m.reply('Sigue intentando :(')
    }
  }break
  case 'key': {
    if (!m.quoted && !args[0]) return m.reply('Envia la key o respondela')
    teks = args[0] ? args[0] : m.quoted.text
    if (isNaN(teks) || !Number.isInteger(Number(teks))) {
      m.reply('El formato de la key es invalido');
      return;
    }
    if (_unlock.includes(teks)) {
      return m.reply(`La Key ${teks} es válida para desbloqueo.`);
    }
    let keyData;
    if (_puntosMas.includes(teks)) {
      keyData = { points: 20, message: `La Key ${teks} es válida por +20 puntos.` };
    } else if (_puntosMenos.includes(teks)) {
      keyData = { points: -20, message: `La Key ${teks} es válida por -20 puntos.` };
    }
    if (keyData) {
      if (addUserKey(m.sender, teks) === false) {
        return m.reply(`La llave *[ ${teks} ]* ha alcanzado el límite máximo de usos`);
      }
      User.counter(m.sender, { cash: keyData.points });
      m.reply(keyData.message);
    } else {
      m.reply('Key no válida');
    }
  }break
// END GAMES
  case 'gay': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!m.quoted) return m.reply(myLang('gay').quot)
    await myBot.sendMessage(m.chat, { video: fs.readFileSync('./src/media/gay.mp4'), caption: myLang('gay').msg.replace('{}', '+'+m.quoted.sender.split('@')[0]).replace('{}',Math.floor(100*Math.random())), gifPlayback: true, mentions: m.quoted.sender }, { quoted: m })
    User.counter(m.sender, {usage: 1})
  }break
  case 'love': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
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
    User.counter(m.sender, {usage: 1})
  }break
  case 'mute': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
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
    User.counter(m.sender, {usage: 1})
  }break
  case 'antilink': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
    if (args[0] === "on") {
      //db.data.chats[m.chat].antilink = true
      m.reply(myLang('antilink').on)
    } else if (args[0] === "off") {
      //db.data.chats[m.chat].antilink = false
      m.reply(myLang('antilink').off)
    } else {
      let buttons = [
        { buttonId: 'antilink on', buttonText: { displayText: 'ON' }, type: 1 },
        { buttonId: 'antilink off', buttonText: { displayText: 'OFF' }, type: 1 }
      ]
      await myBot.sendButtonText(m.chat, buttons, `MOD ANTILINK`, myBot.user.name, m)
    }
    User.counter(m.sender, {usage: 1})
  }break
	case 'add': {
	  if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
		if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins || !isCreator) return m.reply(myLang('global').admin)
		let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'add')
		m.reply(myLang('group').add.replace('{}',users).replace('@s.whatsapp.net',''))
	  User.counter(m.sender, {usage: 1})
	}break
  case 'kick': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
		if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'remove')
		m.reply(myLang('group').kick.replace('{}',users).replace('@s.whatsapp.net',''))
	  User.counter(m.sender, {usage: 1})
  }break
	case 'promote': {
	  if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
	  if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
		if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'promote')
		m.reply(myLang('group').prom.replace('{}',users).replace('@s.whatsapp.net',''))
	  User.counter(m.sender, {usage: 1})
	}break
	case 'demote': {
	  if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
	  if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
		if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'demote')
		m.reply(myLang('group').dem.replace('{}',users).replace('@s.whatsapp.net',''))
	  User.counter(m.sender, {usage: 1})
	}break
  case 'tagall': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)

    let ini = `${BOX.ini.replace('{}',myLang('group').tag.msg_a)}\n`
    let mesaj = `➲ *${myLang('group').tag.msg_b}:* ${q ? q : ''}\n\n`
    let end = `${BOX.end.replace('{}', botName)}`

    for (let mem of participants) {
      mesaj += `${BOX.med} @${mem.id.split('@')[0]}\n`
      tga = `${ini}${mesaj}${end}`
    }
    myBot.sendMessage(m.chat, { text: tga, mentions: participants.map(a => a.id) }, { quoted: m })
    User.counter(m.sender, {usage: 1})
  }break
  case 'hdt': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    if (!isAdmins) return m.reply(myLang('global').admin)
    myBot.sendMessage(m.chat, { text: q ? q : '' , mentions: participants.map(a => a.id)}, { quoted: m })
    User.counter(m.sender, {usage: 1})
  }break
  case 'groupinfo': {
    if (regUser === false) return m.reply(myLang('global').noReg.replace('{}', prefix))
    if (checkUser.block === true) return m.reply('Estas Bloqueado.')
    if (checkUser.points <= 0) return m.reply(myLang('global').no_points)
    if (!m.isGroup) return m.reply(myLang('global').group)
    if (!isBotAdmins) return m.reply(myLang('global').botAdmin)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    try { pp = await myBot.profilePictureUrl(m.chat, 'image') } catch (e) { pp = global.thumb }
    let groupAdmins = participants.filter(p => p.admin) 
    let { infoGroup } = require('./plugins/group_info')
    anu = infoGroup(
      await myBot.groupInviteCode(m.chat), //groupCode
      groupMetadata.subject, // groupName
      groupMetadata.desc?.toString(), // groupDesc
      participants.length, // groupParticipants
      groupOwner.split('@')[0], // groupCreator
      groupAdmins.map((v, i) => `${global.BOX.med} @${v.id.split('@')[0]}`).join('\n') // groupAdmins
    )
    await myBot.sendButton(m.chat, ' ', anu, pp, [['𝗠 𝗘 𝗡 𝗨', 'menu']], m, { mentions: [...groupAdmins.map(v => v.id), owner] })
    User.counter(m.sender, {usage: 1})
  }break
// END GROUPS
// FOR OWNER
  case 'whatgroup': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (!text) return m.reply(myLang('own').join.link)
    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) m.reply(myLang('own').join.link_err)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    let result = args[0].split('https://chat.whatsapp.com/')[1]
    let code = await myBot.groupGetInviteInfo(result)
    try { pic = await myBot.profilePictureUrl(code.id, 'image') } catch (e) { pic = global.thumb }
    msg = `Nombre: ${code.subject}
Creador: ${code.owner.split('@')[0]}
Tamaño: ${code.size}
Desc: ${!code.desc ? 'No hay descriction' : code.desc}`
    myBot.sendImage(m.chat, pic, msg)
    User.counter(m.sender, {usage: 1})
  }break
  case 'join': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (!text) return m.reply(myLang('own').join.link)
    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) m.reply(myLang('own').join.link_err)
    myBot.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})
    let result = args[0].split('https://chat.whatsapp.com/')[1]
    await myBot.groupAcceptInvite(result).then((res) => m.reply(myLang('own').join.ok)).catch((err) => m.reply(myLang('own').join.err))
    User.counter(m.sender, {usage: 1})
  }break
	case 'public': {
    if (!isCreator) return m.reply(myLang('global').owner)
    myBot.public = true
    m.reply(myLang('own').public)
    User.counter(m.sender, {usage: 1})
	}break
  case 'self': {
    if (!isCreator) return m.reply(myLang('global').owner)
    myBot.public = false
    m.reply(myLang('own').self)
    User.counter(m.sender, {usage: 1})
  }break
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
   User.counter(m.sender, {usage: 1})
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
    User.counter(m.sender, {usage: 1})
  }break
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
    User.counter(m.sender, {usage: 1})
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
    User.counter(m.sender, {usage: 1})
  }break
  case 'block': {
		if (!isCreator) return m.reply(myLang('global').owner)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.updateBlockStatus(users, 'block').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	  User.counter(m.sender, {usage: 1})
  }break
  case 'unblock': {
		if (!isCreator) return m.reply(myLang('global').owner)
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.updateBlockStatus(users, 'unblock').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	  User.counter(m.sender, {usage: 1})
  }break
  case 'bc': case 'broadcast': case 'bcall': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (!text) return m.reply(`Que quieres enviar?\n\nEjemplo: ${prefix + command} text`)
    try {
      imgbc = await quoted.download()
    } catch {
      imgbc = global.thumb
    }
    dbOld = JSON.parse(fs.readFileSync("./src/people.json"))
    let anu = await Object.keys(dbOld).map(i => dbOld[i].phone )
    m.reply(`Enviar difusión a ${anu.length} chat.\nTiempo de envio ${anu.length * 1.5} segundos.`)
    for (let i of anu) {
      await sleep(1500)
      let txt = `「 Difusor Bot 」\n\n${text}`
      myBot.sendButtonLoc(i, imgbc, txt, myBot.user.name, 'MENU', 'menu')
    }
    m.reply('Difusion Enviada')
    User.counter(m.sender, {usage: 1})
  }break
  case 'bgc': case 'bcgroup': {
    if (!isCreator) return m.reply(myLang('global').owner)
    if (!text) return m.reply(`Que quieres enviar?\n\nEjemplo: ${prefix + command} text`)
    try {
      imgbc = await quoted.download()
    } catch {
      imgbc = global.thumb
    }
    let getGroups = await myBot.groupFetchAllParticipating()
    let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
    let anu = groups.map(v => v.id)
    m.reply(`Enviar difusión a ${anu.length} grupos.\nTiempo de envio ${anu.length * 1.5} segundos.`)
    for (let i of anu) {
      await sleep(1500)
      let txt = `「 Difusor Bot 」\n\n${text}`
      myBot.sendButtonLoc(i, imgbc, txt, myBot.user.name, 'MENU', 'menu')
    }
    m.reply('Difusion Enviada')
    User.counter(m.sender, {usage: 1})
  }break
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
      m.reply(`*𝚃𝙸𝙴𝙼𝙿𝙾 𝙳𝙴 𝙴𝙹𝙴𝙲𝚄𝙲𝙸Ó𝙽*
${runtime(process.uptime())}`)
    }
  }break


case 'test': {
  if (!isCreator) return m.reply(myLang('global').owner)
  /*
    const ftroli ={key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "status@broadcast"}, "message": {orderMessage: {itemCount: 10,status: 200, thumbnail: await myBot.reSize(thumb, 100, 100), surface: 200, message: `${author}`, orderTitle: 'Dylan', sellerJid: 'https://github.com/GataNina-Li/GataBot-MD'}}, contextInfo: {"forwardingScore":999,"isForwarded":true},sendEphemeral: true}
		const fdoc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: `${author}`,jpegThumbnail: await myBot.reSize(thumb, 100, 100)}}}
		const fvn = {key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})},message: { "audioMessage": {"mimetype":"audio/ogg; codecs=opus","seconds":210,"ptt": "true"}} } 
		const fgclink = {key: {participant: "0@s.whatsapp.net","remoteJid": "0@s.whatsapp.net"},"message": {"groupInviteMessage": {"groupJid": "573046793853@g.us","inviteCode": "K5zmLhri8aGIB8ieUCnsyJ","groupName": `${author}`, "caption": `${author}`, 'jpegThumbnail': await myBot.reSize(thumb, 100, 100)}}}
		const ftextt = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})}, message: { "extendedTextMessage": {"text":`${author}`, "title": `${botName}`, 'jpegThumbnail': await myBot.reSize(thumb, 100, 100)}}}
    const ftoko = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? {remoteJid: "status@broadcast" } : {})}, message: { "productMessage": { "product": { "productImage":{ "mimetype": "image/jpeg", "jpegThumbnail": await myBot.reSize(thumb, 100, 100)},"title": `${author}`, "description": `${botName}`, "currencyCode": "COP", "priceAmount1000": "1000000", "retailerId": `${author}`, "productImageCount": 1}, "businessOwnerJid": `0@s.whatsapp.net`}}} 
		const fgif = {key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})},message: {"videoMessage": { "title":`${author}`, "h": `Hmm`,'seconds': '359996400', 'gifPlayback': 'true', 'caption': `${author}`, 'jpegThumbnail': await myBot.reSize(thumb, 100, 100)}}}
		const fvideo = {key: { fromMe: false,participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) },message: { "videoMessage": { "title":`${author}`, "h": `Hmm`,'seconds': '359996400', 'caption': `${author}`, 'jpegThumbnail': await myBot.reSize(thumb, 100, 100)}}}
		const floc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {locationMessage: {name: `${author}`,jpegThumbnail: await myBot.reSize(thumb, 100, 100)}}}
		const floc2 = {key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) }, message: { "liveLocationMessage": { "title": `${author}`,"h": `Hmm`, 'jpegThumbnail': await myBot.reSize(thumb, 100, 100)}}}
		
    myBot.sendMessage(m.chat, { text: 'Test Context' }, { quoted: ftroli })
*/
/*
let texto = `*[❗] @${m.sender.split`@`[0]} 𝙰𝙶𝚄𝙰𝚁𝙳𝙴 𝚄𝙽 𝙼𝙾𝙼𝙴𝙽𝚃𝙾*`
let aa = { quoted: m, userJid: myBot.user.id }
let prep = generateWAMessageFromContent(m.chat, { extendedTextMessage: { text: texto, contextInfo: { externalAdReply: { title: 'DrkBot', body: null, thumbnail: thumb, sourceUrl: 'https://github.com/DrkBotBase' }, mentionedJid: [m.sender]}}}, aa)    
myBot.relayMessage(m.chat, prep.message, { messageId: prep.key.id, mentions: [m.sender] })
*/
//let p = await fg.tiktok(args[0]) 
//let buttons = [{ buttonText: { displayText: '♫ 𝙰𝚄𝙳𝙸𝙾 ♫' }, buttonId: `${usedPrefix}tomp3` }]
//let te = `*𝚄𝚂𝙴𝚁𝙽𝙰𝙼𝙴:* ${p.author || 'Indefinido'}`
//await myBot.sendMessage(m.chat, { text: 'Test Context' }, { quoted: m })
//await myBot.sendMessage(m.chat, { text: { url: p.nowm}, caption: te, footer: wm, buttons }, { quoted: m })  
/*
let timeout = 60000
let mstekateki = {}
    let id = m.chat
    if (id in mstekateki) {
        myBot.sendText(m.chat, 'Todavía hay acertijos sin responder en este chat', mstekateki[id][0])
        return false
    }
    let tekateki = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`))
    let json = tekateki[Math.floor(Math.random() * tekateki.length)]
    let _clue = json.response
    let clue = _clue.replace(/[A-Za-z]/g, '_')
    let caption = `
ⷮ *${json.question}*

*• Tiempo:* ${(timeout / 1000).toFixed(2)} segundos`
    mstekateki[id] = [
       await myBot.sendText(m.chat, caption, m),
        json,
        setTimeout(async () => {
            if (mstekateki[id]) await myBot.sendText(m.chat, `Se acabó el tiempo!\n*Respuesta:* ${json.response}`, mstekateki[id][0])
            delete mstekateki[id]
        }, timeout)
    ]
*/
try {
  imgbc = await quoted.download()
} catch {
  imgbc = global.thumb
}
myBot.sendMessageModify(m.chat, text ? text : '🤖 DrkBot el mejor', null, {
   title: global.author,
   largeThumb: true,
   thumbnail: imgbc,
   url: 'https://chat.whatsapp.com/GxjXaj3SxNDAWh8oMQ5bkg'
})

}break






  default:
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
    
    if (isCmd && budy.toLowerCase() != undefined) {
      if (m.chat.endsWith('broadcast')) return
      if (m.isBaileys) return
      //let msgs = global.db.data.database
      let msgs = checkUser
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