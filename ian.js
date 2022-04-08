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
const chalk = require('chalk')
const { exec, spawn, execSync } = require("child_process")
const axios = require('axios')
const path = require('path')
const os = require('os')
const moment = require('moment-timezone')
const { JSDOM } = require('jsdom')
const speed = require('performance-now')
const { performance } = require('perf_hooks')
const { Primbon } = require('scrape-primbon')
const primbon = new Primbon()
const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom } = require('./lib/myfunc')
const { menu } = require('./src/assets/menu')
const log = console.log;

// read database
let kuismath = db.data.game.math = []
let vote = db.data.others.vote = []

module.exports = myBot = async (myBot, m, chatUpdate, store) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? global.prefix
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
            console.error(err)
        }
	    
        // Public & Self
        if (!myBot.public) {
            if (!m.key.fromMe) return
        }

        /* Push Message To Console && Auto Read
        if (m.message) {
            myBot.sendReadReceipt(m.chat, m.sender, [m.key.id])
            log(chalk.black(chalk.bgWhite('[ PESAN ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> Dari'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> Di'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
        }*/
	
	// reset limit every 12 hours
        let cron = require('node-cron')
        cron.schedule('00 12 * * *', () => {
            let user = Object.keys(global.db.data.users)
            let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
            for (let jid of user) global.db.data.users[jid].limit = limitUser
            log('Reseted Limit')
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
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
        m.reply(`「 ANTI LINK 」\n\n😧 te he detectado enviando un enlace de grupo, lo sentimos, serás expulsado!`)
        if (!isBotAdmins) return m.reply(`Lo siento no soy Admin T_T`)
        let gclink = (`https://chat.whatsapp.com/`+await myBot.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return m.reply(`Link de éste grupo detectado.`)
        if (isAdmins) return m.reply(`Te he detectado enviando enlaces, pero como eres Admin pos no hay problema 😅`)
        if (isCreator) return m.reply(`Mi señor creador, pará usted no hay restricciones.`)
        myBot.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      }
    }
        
      // Mute Chat
    if (db.data.chats[m.chat].mute && !isAdmins && !isCreator) {
      return
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
/* ########## COMMANDS ##########*/
  case 'afk': {
    let user = global.db.data.users[m.sender]
    user.afkTime = + new Date
    user.afkReason = text
     m.reply(`${m.pushName} Telah Afk${text ? ': ' + text : ''}`)
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
    m.reply('*No olvides dar estrellas*\n\n*Script:* https://github.com\n*Paypal:* https://www.paypal.me')
  }
  break/*
  case 'math': {
    if (kuismath.hasOwnProperty(m.sender.split('@')[0])) throw "¡Todavía hay sesiones sin terminar!"
    let { genMath, modes } = require('./src/math')
    if (!text) throw `Mode: ${Object.keys(modes).join(' | ')}\nEjemplo: ${prefix}math medium`
    let result = await genMath(text.toLowerCase())
    myBot.sendText(m.chat, `*¿Cuál es el resultado de: ${result.soal.toLowerCase()}*?\n\nHora: ${(result.waktu / 1000).toFixed(2)} segundo`, m).then(() => {
      kuismath[m.sender.split('@')[0]] = result.jawaban
    })
    await sleep(result.waktu)
    if (kuismath.hasOwnProperty(m.sender.split('@')[0])) {
      log("Responder: " + result.jawaban)
      m.reply("El tiempo se ha acabado\nRespuesta: " + kuismath[m.sender.split('@')[0]])
      delete kuismath[m.sender.split('@')[0]]
    }
  }
  break*/
  case 'sticker': case 's': {
    if (!quoted) throw `Responder video/imagen ${prefix + command}`
    m.reply(mess.wait)
    if (/image/.test(mime)) {
      let media = await quoted.download()
      let encmedia = await myBot.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
      await fs.unlinkSync(encmedia)
    } else if (/video/.test(mime)) {
      if ((quoted.msg || quoted).seconds > 11) return m.reply('Máximo 10 segundos!')
      let media = await quoted.download()
      let encmedia = await myBot.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
      await fs.unlinkSync(encmedia)
    } else {
      throw `Responder video/imagen ${prefix + command}\nDuración del video 1-10 segundos`
    }
  }
  break
  case 'emojimix': {
    if (!text) throw `Ejemplo: ${prefix + command} 😅+🤔`
    let [emoji1, emoji2] = text.split`+`
    let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
    for (let res of anu.results) {
      let encmedia = await myBot.sendImageAsSticker(m.chat, res.url, m, { packname: global.packname, author: global.author, categories: res.tags })
      await fs.unlinkSync(encmedia)
		}
	}
	break
  case 'yt': {
    if (!text) throw `Que deseas busacar?\nEjemplo: ${prefix + command} Blinding Live`
    let yts = require("yt-search")
    let search = await yts(text)
    let teks = 'YouTube Search\n\nResultado de: *'+text+'*\n\n'
    //let no = 1
    search.all.map((video) => {
      teks += '*' + video.title + '* - ' + video.url + '\n'
    });
    /*
    for (let i of search.all) {
      teks += `⭔ #: ${no++}\n⭔ Type : ${i.type}\n⭔ Video ID : ${i.videoId}\n⭔ Title : ${i.title}\n⭔ Views : ${i.views}\n⭔ Duration : ${i.timestamp}\n⭔ Upload At : ${i.ago}\n⭔ Author : ${i.author.name}\n⭔ Url : ${i.url}\n\n─────────────────\n\n`
    }
    */
    myBot.sendMessage(m.chat, { image: { url: search.all[0].thumbnail },  caption: teks }, { quoted: m })
  }
  break
  case 'song': {
    let { yta } = require('./lib/y2mate')
    if (!text) throw `Ejemplo: ${prefix + command} https://youtu.be/83RUhxsfLWs`
    let quality = args[1] ? args[1] : '128kbps'
    let media = await yta(text, quality)
    if (media.filesize >= 100000) return m.reply('Archivo demasiado grande '+util.format(media))
    myBot.sendImage(m.chat, media.thumb, `⭔ Título : ${media.title}\n⭔ Tamaño: ${media.filesizeF}\n⭔ Url: ${isUrl(text)}\n⭔ Ext: MP3\n⭔ Resolución: ${args[1] || '128kbps'}`, m)
    myBot.sendMessage(m.chat, { audio: { url: media.dl_link }, mimetype: 'audio/mpeg', fileName: `${media.title}.mp3` }, { quoted: m })
  }
  break
  case 'video': {
    let { ytv } = require('./lib/y2mate')
    if (!text) throw `Ejemplo: ${prefix + command} https://youtu.be/KRaWnd3LJfs`
    let quality = args[1] ? args[1] : '360p'
    let media = await ytv(text, quality)
    if (media.filesize >= 100000) return m.reply('Archivo demasiado grande '+util.format(media))
    myBot.sendMessage(m.chat, { video: { url: media.dl_link }, mimetype: 'video/mp4', fileName: `${media.title}.mp4`, caption: `⭔ Título: ${media.title}\n⭔ Tamaño: ${media.filesizeF}\n⭔ Url: ${isUrl(text)}\n⭔ Ext: MP3\n⭔ Resolución: ${args[1] || '360p'}` }, { quoted: m })
  }
  break
  case 'wallpaper': {
    if (!text) throw 'Que deseas buscar?'
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
    myBot.sendMessage(m.chat, buttonMessage, { quoted: m })
  }
  break
  case 'ebinary': {
    if (!m.quoted.text && !text) throw `Enviar/responder texto ${prefix + command}`
    let { eBinary } = require('./lib/binary')
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    let eb = await eBinary(teks)
    m.reply(eb)
  }
  break
  case 'dbinary': {
    if (!m.quoted.text && !text) throw `Enviar/responder texto ${prefix + command}`
    let { dBinary } = require('./lib/binary')
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    let db = await dBinary(teks)
    m.reply(db)
  }
  break
/* ########## COMMANDS ##########*/

/* ########## FOR GROUPS ##########*/
/*
  case 'chat': {
 //   if (!isCreator) throw mess.owner
    if (!q) throw 'Option:\n1. mute\n2. unmute\n3. archive\n4. unarchive\n5. read\n6. unread\n7. delete'
    if (args[0] === 'mute') {
      myBot.groupSettingUpdate(m.chat, 'announcement')
    } else if (args[0] === 'unmute') {
      myBot.groupSettingUpdate(m.chat, 'not_announcement')
    } else if (args[0] === 'archive') {
      myBot.chatModify({  archive: true }, m.chat, []).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
    } else if (args[0] === 'unarchive') {
      myBot.chatModify({ archive: false }, m.chat, []).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
    } else if (args[0] === 'read') {
      myBot.chatModify({ markRead: true }, m.chat, []).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
    } else if (args[0] === 'unread') {
      myBot.chatModify({ markRead: false }, m.chat, []).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
    } else if (args[0] === 'delete') {
      myBot.chatModify({ clear: { message: { id: m.quoted.id, fromMe: true }} }, m.chat, []).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
    }
  }
  break*/
  case 'pareja': {
    if (!m.isGroup) throw mess.group
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
    if (!m.isGroup) throw mess.group
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
    if (!m.isGroup) throw mess.group
    if (!isBotAdmins) throw mess.botAdmin
    if (!isAdmins) throw mess.admin
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
      await myBot.sendButtonText(m.chat, buttons, `DrkBot`, myBot.user.name, m)
    }
  }
  break
  case 'kick': {
		if (!m.isGroup) throw mess.group
    if (!isBotAdmins) throw mess.botAdmin
    if (!isAdmins) throw mess.admin
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'remove').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
	case 'add': {
		if (!m.isGroup) throw mess.group
    if (!isBotAdmins) throw mess.botAdmin
    if (!isAdmins) throw mess.admin
		let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'add').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
	case 'promote': {
		if (!m.isGroup) throw mess.group
    if (!isBotAdmins) throw mess.botAdmin
    if (!isAdmins) throw mess.admin
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
	case 'demote': {
		if (!m.isGroup) throw mess.group
    if (!isBotAdmins) throw mess.botAdmin
    if (!isAdmins) throw mess.admin
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
  case 'tagall': {
    if (!m.isGroup) throw mess.group
    if (!isBotAdmins) throw mess.botAdmin
    if (!isAdmins) throw mess.admin

    const ini = "╔══✪〘 *REPORTENSE* 〙✪══\n"
    const end = "╚══✪〘 *DrkBot* 〙✪══"

    let mesaj = `➲ *Mensaje:* ${q ? q : ''}\n\n`
    for (let mem of participants) {
      mesaj += `${global.sp} @${mem.id.split('@')[0]}\n`
      tga = `${ini}${mesaj}${end}`
    }
    myBot.sendMessage(m.chat, { text: tga, mentions: participants.map(a => a.id) }, { quoted: m })
  }
  break
  case 'hidetag': {
    if (!m.isGroup) throw mess.group
    if (!isBotAdmins) throw mess.botAdmin
    if (!isAdmins) throw mess.admin
    myBot.sendMessage(m.chat, { text : q ? q : '' , mentions: participants.map(a => a.id)}, { quoted: m })
  }
  break
  case 'linkgroup': {
    if (!m.isGroup) throw mess.group
    const inviteCode = await myBot.groupInviteCode(m.chat)
    const { subject } = await myBot.groupMetadata(m.chat)
    const caption = `*Nombre del Grupo:* *${subject}*\n\n*Link del grupo:* https://chat.whatsapp.com/${inviteCode}`
    try { pic = await myBot.profilePictureUrl(m.chat, 'image') } catch (e) { pic = global.thumb }
    myBot.sendImage(m.chat, pic, caption, m)
  }
  break
/* ########## END GROUPS ##########*/
// ===== CAMBIO =====
/*
  case 'halah': case 'hilih': case 'huluh': case 'heleh': case 'holoh':
    if (!m.quoted && !text) throw `Kirim/reply text dengan caption ${prefix + command}`
    ter = command[1].toLowerCase()
    tex = m.quoted ? m.quoted.text ? m.quoted.text : q ? q : m.text : q ? q : m.text
    m.reply(tex.replace(/[aiueo]/g, ter).replace(/[AIUEO]/g, ter.toUpperCase())
  break
*/
// ===== =====
 
  case 'react': {
    if (!isCreator) throw mess.owner
    reactionMessage = {
      react: {
        text: args[0],
        key: { remoteJid: m.chat, fromMe: true, id: quoted.id }
      }
    }
    myBot.sendMessage(m.chat, reactionMessage)
  }
  break  
  case 'join': {
    if (!isCreator) throw mess.owner
    if (!text) throw 'Necesito el enlace de invitación!'
    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) throw 'Link Invalido!'
    m.reply(mess.wait)
    let result = args[0].split('https://chat.whatsapp.com/')[1]
    await myBot.groupAcceptInvite(result).then((res) => {
      myBot.sendMessage(res.gid, `Hola soy *${myBot.user.name}*\n\n_🛡️ Fui invitado por @${m.sender.split("@")[0]} para unirme al grupo_\n\nEscriban ${prefix}alive para empezar.`)
      m.reply(jsonformat(res))
    }).catch((err) => m.reply(jsonformat(err)))
  }
  break
/*
	case 'juzamma': {
		if (args[0] === 'pdf') {
	  	m.reply(mess.wait)
	  	myBot.sendMessage(m.chat, {document: {url: 'https://fatiharridho.my.id/database/islam/juz-amma-arab-latin-indonesia.pdf'}, mimetype: 'application/pdf', fileName: 'juz-amma-arab-latin-indonesia.pdf'}, {quoted:m})
		} else if (args[0] === 'docx') {
		  m.reply(mess.wait)
	  	myBot.sendMessage(m.chat, {document: {url: 'https://fatiharridho.my.id/database/islam/juz-amma-arab-latin-indonesia.docx'}, mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileName: 'juz-amma-arab-latin-indonesia.docx'}, {quoted:m})
		} else if (args[0] === 'pptx') {
	  	m.reply(mess.wait)
	  	myBot.sendMessage(m.chat, {document: {url: 'https://fatiharridho.my.id/database/islam/juz-amma-arab-latin-indonesia.pptx'}, mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', fileName: 'juz-amma-arab-latin-indonesia.pptx'}, {quoted:m})
		} else if (args[0] === 'xlsx') {
	  	m.reply(mess.wait)
	  	myBot.sendMessage(m.chat, {document: {url: 'https://fatiharridho.my.id/database/islam/juz-amma-arab-latin-indonesia.xlsx'}, mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName: 'juz-amma-arab-latin-indonesia.xlsx'}, {quoted:m})
		} else {
	  	m.reply(`Mau format apa ? Example : ${prefix + command} pdf
    Format yang tersedia : pdf, docx, pptx, xlsx`)
  	}
	}
	break
*/
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
        m.reply(mess.wait)
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
  case 'setcmd': {
    if (!isCreator) throw mess.owner
    if (!m.quoted) throw 'Responde un mensaje!'
    if (!m.quoted.fileSha256) throw 'SHA256 falta el hash'
    if (!text) throw `Que comando?`
    
    let hash = m.quoted.fileSha256.toString('base64')
    if (global.db.data.sticker[hash] && global.db.data.sticker[hash].locked) throw 'You have no permission to change this sticker command'
    global.db.data.sticker[hash] = {
      text,
      mentionedJid: m.mentionedJid,
      creator: m.sender,
      at: + new Date,
      locked: false,
    }
    m.reply(`Hecho!`)
  }
  break
  case 'delcmd': {
    if (!isCreator) throw mess.owner
    let hash = m.quoted.fileSha256.toString('base64')
    if (!hash) throw `Falta el hash`
    if (global.db.data.sticker[hash] && global.db.data.sticker[hash].locked) throw 'You have no permission to delete this sticker command'              
    delete global.db.data.sticker[hash]
    m.reply(`Hecho!`)
  }
  break
  case 'listcmd': {
    if (!isCreator) throw mess.owner
    let teks = `
*Lista de Hash*
Info: *bold* hash is Locked
${Object.entries(global.db.data.sticker).map(([key, value], index) => `${index + 1}. ${value.locked ? `*${key}*` : key} : ${value.text}`).join('\n')}
`.trim()
    myBot.sendText(m.chat, teks, m, { mentions: Object.values(global.db.data.sticker).map(x => x.mentionedJid).reduce((a,b) => [...a, ...b], []) })
  }
  break
  case 'lockcmd': {
    if (!isCreator) throw mess.owner
    if (!m.quoted) throw 'Reply Pesan!'
    if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
    let hash = m.quoted.fileSha256.toString('base64')
    if (!(hash in global.db.data.sticker)) throw 'Hash not found in database'
    global.db.data.sticker[hash].locked = !/^un/i.test(command)
    m.reply('Done!')
  }
  break
  case 'addmsg': {
    if (!isCreator) throw mess.owner
    if (!m.quoted) throw 'Responda el mensaje que quiere guardar en la base de datos'
    if (!text) throw `Ejemolo: ${prefix + command} nombre`
    let msgs = global.db.data.database
    if (text.toLowerCase() in msgs) throw `'${text}' ha sido guardado en la lista de mensajes`
    msgs[text.toLowerCase()] = quoted.fakeObj
    m.reply(`Mensaje agregado con éxito en la lista de mensajes como '${text}'

Acceder con: ${prefix}getmsg ${text}

Ver lista de mensajes con ${prefix}listmsg`)
  }
  break
  case 'getmsg': {
    if (!isCreator) throw mess.owner
    if (!text) throw `Ejemplo: ${prefix + command} nombre\n\nVer lista de mensajes con: ${prefix}listmsg`
    let msgs = global.db.data.database
    if (!(text.toLowerCase() in msgs)) throw `'${text}' no aparece en la lista de mensajes`
    myBot.copyNForward(m.chat, msgs[text.toLowerCase()], true)
  }
  break
  case 'listmsg': {
    if (!isCreator) throw mess.owner
    let msgs = JSON.parse(fs.readFileSync('./src/database.json'))
	  let seplit = Object.entries(global.db.data.database).map(([nama, isi]) => { return { nama, ...isi } })
		let teks = '「 LIST DATABASE 」\n\n'
		for (let i of seplit) {
		  teks += `⬡ *Nombre:* ${i.nama}\n⬡ *Tipo:* ${getContentType(i.message).replace(/Message/i, '')}\n────────────────────────\n\n`
    }
	  m.reply(teks)
	}
	break
  case 'delmsg': case 'deletemsg': {
    if (!isCreator) throw mess.owner
    let msgs = global.db.data.database
    if (!(text.toLowerCase() in msgs)) return m.reply(`'${text}' no aparece en la lista de mensajes`)
		delete msgs[text.toLowerCase()]
		m.reply(`Eliminado con éxito '${text}' de la lista de mensajes`)
  }
	break

/* ########## FOR OWNER ##########*/
	case 'public': {
    if (!isCreator) throw mess.owner
    myBot.public = true
    m.reply('Sukse Change To Public Usage')
  }
  break
  case 'self': {
    if (!isCreator) throw mess.owner
    myBot.public = false
    m.reply('Sukses Change To Self Usage')
  }
  break
  /*case 'speedtest': {
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
  break*/
  case 'block': {
		if (!isCreator) throw mess.owner
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.updateBlockStatus(users, 'block').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
  case 'unblock': {
		if (!isCreator) throw mess.owner
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await myBot.updateBlockStatus(users, 'unblock').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
  case 'bc': case 'broadcast': case 'bcall': {
    if (!isCreator) throw mess.owner
    if (!text) throw `Que quieres enviar?\n\nEjemplo: ${prefix + command} text`
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
    if (!isCreator) throw mess.owner
    if (!text) throw `Que quieres enviar?\n\nEjemplo: ${prefix + command} text`
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
  case 'ping': case 'botstatus': {
		if (!isCreator) throw mess.owner
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

*TIEMPO DE EJECUCIÓN*
${runtime(process.uptime())}

💻 *INFO SERVER*
_RAM:_ ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

_MEMORIA NodeJS_

${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`.trim()
    m.reply(respon)
  }
  break
  case 'owner': {
    myBot.sendContact(m.chat, global.owner, m)
  }
  break
  case 'alive': {
    anu = '✪〘 *FUNCIONANDO* 〙✪'
    let btn = [{
      urlButton: {
        displayText: 'Source Code',
        url: 'https://github.com'
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
    myBot.send5ButImg(m.chat, anu, 'DrkBot', global.thumb, btn)
  }
  break
  case 'menu': {
    anu = menu(prefix, pushname)
    let btn = [{
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
    myBot.send5ButImg(m.chat, anu, myBot.user.name, global.thumb, btn)
  }


  default:
    if (budy.startsWith('=>')) {
      if (!isCreator) return m.reply(mess.owner)
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
      if (!isCreator) return m.reply(mess.owner)
      try {
        let evaled = await eval(budy.slice(2))
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
        await m.reply(evaled)
      } catch (err) {
        await m.reply(String(err))
      }
    }
    
    if (budy.startsWith('$')) {
      if (!isCreator) return m.reply(mess.owner)
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
  m.reply(util.format(err))
}
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
