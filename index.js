/*
  Copyright (C) 2022
  DrkBot-MD - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

require('./config')
const { default: myBotConnect, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const { state, saveState } = useSingleFileAuthState(`./lib/sess.json`)
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const yargs = require('yargs/yargs')
const FileType = require('file-type')
const path = require('path')
const _ = require('lodash')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/myfunc')
const { log, pint, bgPint } = require('./lib/colores');
const Config = require('./config');

var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./lib/lowdb')
}

const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')

global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
      new mongoDB(opts['db']) :
      new JSONFile(`src/database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

// save database every 5 minutes
if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
}, 300 * 1000)

async function startMybot() {
    const myBot = myBotConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ["DrkBot", "Safari", "13.0.0"],
        auth: state
    })

    store.bind(myBot.ev)
    
    // anticall auto block
    myBot.ws.on('CB:call', async (json) => {
      const callerId = json.content[0].attrs['call-creator']
      if (json.content[0].tag == 'offer') {
        let owIan = await myBot.sendContact(callerId, global.owner)
        myBot.sendMessage(callerId, { text: `Sistema de bloqueo por llamadas!\nSi quieres ser desbloqueado contacta a mi creador!`}, { quoted : owIan })
        await sleep(8000)
        await myBot.updateBlockStatus(callerId, "block")
      }
    })

    myBot.ev.on('messages.upsert', async chatUpdate => {
        //log(JSON.stringify(chatUpdate, undefined, 2))
        try {
          mek = chatUpdate.messages[0]
          if (!mek.message) return
          mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
          if (mek.key && mek.key.remoteJid === 'status@broadcast') return
          if (!myBot.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
          if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
          if (Config.ONLINE === 'online'){
            await myBot.sendPresenceUpdate('available', mek.key.id);
          } else if (Config.ONLINE === 'offline'){
            await myBot.sendPresenceUpdate('unavailable', mek.key.id);
          }
          m = smsg(myBot, mek, store)
          require("./ian")(myBot, m, chatUpdate, store)
        } catch (err) {
          log(pint(err, 'red.'))
        }
    })

    myBot.ev.on('group-participants.update', async (anu) => {
        try {
            let metadata = await myBot.groupMetadata(anu.id)
            let participants = anu.participants
            for (let num of participants) {
                // Get Profile Picture User
                try {
                    ppuser = await myBot.profilePictureUrl(num, 'image')
                } catch {
                    ppuser = fs.readFileSync('./lib/imgProfile.jpg')
                }
                // Get Profile Picture Group
                try {
                    ppgroup = await myBot.profilePictureUrl(anu.id, 'image')
                } catch {
                    ppgroup = fs.readFileSync('./lib/imgProfile.jpg')
                }

                if (anu.action == 'add') {
                  teks = `??????????????? *NUEVO USUARIO* ????????????\n?????? *Nombre:* @${num.split('@')[0]}\n??????????????? *DrkBot* ????????????`
                  myBot.sendMessage(anu.id, { image: { url: ppuser }, contextInfo: { mentionedJid: [num] }, caption: teks })
                } else if (anu.action == 'remove') {
                  teks = `??????????????? *SE FUE* ????????????\n?????? *Nombre:* @${num.split('@')[0]}\n??????????????? *DrkBot* ????????????`
                  myBot.sendMessage(anu.id, { image: { url: ppuser }, contextInfo: { mentionedJid: [num] }, caption: teks })
                }
            }
        } catch (err) {
            log(pint(err, 'red.'))
        }
    })
	
    // Setting
    myBot.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    myBot.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = myBot.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    myBot.getName = (jid, withoutContact  = false) => {
        id = myBot.decodeJid(jid)
        withoutContact = myBot.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = myBot.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === myBot.decodeJid(myBot.user.id) ?
            myBot.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    myBot.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await myBot.getName(i + '@s.whatsapp.net'),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await myBot.getName(i + '@s.whatsapp.net')}\nFN:${await myBot.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Tel\nitem2.EMAIL;type=INTERNET:drkbot@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/iand_tv\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Colombia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
	    })
	}
	myBot.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }
    
    myBot.setStatus = (status) => {
        myBot.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
	if (Config.WORKTYPE === 'private'){
    myBot.public = false
	} else if (Config.WORKTYPE === 'public'){
    myBot.public = true
	}
    let wtMyBot = myBot.public == true ? ' Publico' : ' Privado'
    log(pint('???? DrkBot Modo' + wtMyBot, '.'));
    log(pint(
      '[copyright By: Ian]\n' + 
      'Prohibida su venta\n' +
      'Chatea con ??Ian\n' +
      'Wats 573508770421\n\n', '#d30092'
      ));

    myBot.serializeM = (m) => smsg(myBot, m, store)

    myBot.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update	    
        if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { log(`Archivo de sesi??n corrupto, elimine la sesi??n y vuelva a escanear.`); myBot.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { log("Conexi??n cerrada, reconectando...."); startMybot(); }
            else if (reason === DisconnectReason.connectionLost) { log("Conexi??n perdida del servidor, reconectando..."); startMybot(); }
            else if (reason === DisconnectReason.connectionReplaced) { log("Conexi??n reemplazada, otra nueva sesi??n abierta, cierre la sesi??n actual primero."); myBot.logout(); }
            else if (reason === DisconnectReason.loggedOut) { log(`Dispositivo cerrado, escanee nuevamente y ejecute.`); myBot.logout(); }
            else if (reason === DisconnectReason.restartRequired) { log("Reinicio requerido, reiniciando..."); startMybot(); }
            else if (reason === DisconnectReason.timedOut) { log("Se agot?? el tiempo de espera de la conexi??n, reconectando..."); startMybot(); }
            //else myBot.end(`Unknown DisconnectReason: ${reason}|${connection}`)
            else {
              log(`Unknown DisconnectReason: ${reason}|${connection}`); startMybot();
            }
        }
        log('Connected...', update)
    })

    myBot.ev.on('creds.update', saveState)

    // Add Other

    /**
     *
     * @param {*} jid
     * @param {*} url
     * @param {*} caption
     * @param {*} quoted
     * @param {*} options
     */
    myBot.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
        return myBot.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
        return myBot.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
        return myBot.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
        return myBot.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
        return myBot.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
    }

    /** Send Button 5 Image
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} image
     * @param [*] button
     * @param {*} options
     * @returns
     */
    myBot.send5ButImg = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
      let message = await prepareWAMessageMedia({ image: img }, { upload: myBot.waUploadToServer })
      var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
          hydratedTemplate: {
            imageMessage: message.imageMessage,
            "hydratedContentText": text,
            "hydratedFooterText": footer,
            "hydratedButtons": but
          }
        }
      }), options)
      myBot.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /** Send Button 5 Video
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} Gif
     * @param [*] button
     * @param {*} options
     * @returns
     */
    myBot.send5ButVid = async (jid , text = '' , footer = '', vid, but = [], options = {}) =>{
      let message = await prepareWAMessageMedia({ video: vid }, { upload: myBot.waUploadToServer })
      var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        videoMessage: message.videoMessage,
            "hydratedContentText": text,
            "hydratedFooterText": footer,
            "hydratedButtons": but
          }
        }
      }), options)
      myBot.relayMessage(jid, template.message, { messageId: template.key.id })
    }
 
    /** Send Button 5 Video
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} VideoGif
     * @param [*] button
     * @param {*} options
     * @returns
     */
    myBot.send5ButGif = async (jid , text = '' , footer = '', gif, but = [], options = {}) =>{
      let message = await prepareWAMessageMedia({ video: gif, gifPlayback: true }, { upload: myBot.waUploadToServer })
      var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
          hydratedTemplate: {
            videoMessage: message.videoMessage,
            "hydratedContentText": text,
            "hydratedFooterText": footer,
            "hydratedButtons": but
          }
        }
      }), options)
      myBot.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} buttons 
     * @param {*} caption 
     * @param {*} footer 
     * @param {*} quoted 
     * @param {*} options 
     */
    myBot.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
        let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        }
        myBot.sendMessage(jid, buttonMessage, { quoted, ...options })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} buttons 
     * @param {*} options 
     * @returns 
     */
    myBot.sendButImage = async (jid, path, text = '', foot = '', but = [], quoted = '', options = {}) => {
      let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      let buttonMessage = {
        image: buffer,
        caption: text,
        footer: foot,
        buttons: but,
        headerType: 4
      }
        return await myBot.sendMessage(jid, buttonMessage, { quoted, ...options })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    myBot.sendText = (jid, text, quoted = '', options) => myBot.sendMessage(jid, { text: text, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    myBot.sendImage = async (jid, path, caption = '', quoted = '', options) => {
      let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      return await myBot.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    myBot.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await myBot.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} mime 
     * @param {*} options 
     * @returns 
     */
    myBot.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await myBot.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    myBot.sendTextWithMentions = async (jid, text, quoted, options = {}) => myBot.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    myBot.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await myBot.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    myBot.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await myBot.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
	
    /**
     * 
     * @param {*} message 
     * @param {*} filename 
     * @param {*} attachExtension 
     * @returns 
     */
    myBot.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    myBot.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
	}
        
	return buffer
     } 
    
    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} filename
     * @param {*} caption
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    myBot.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await myBot.getFile(path, true)
           let { mime, ext, res, data, filename } = types
           if (res && res.status !== 200 || file.length <= 65536) {
               try { throw { json: JSON.parse(file.toString()) } }
               catch (e) { if (e.json) throw e.json }
           }
       let type = '', mimetype = mime, pathFile = filename
       if (options.asDocument) type = 'document'
       if (options.asSticker || /webp/.test(mime)) {
        let { writeExif } = require('./lib/exif')
        let media = { mimetype: mime, data }
        pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
        await fs.promises.unlink(filename)
        type = 'sticker'
        mimetype = 'image/webp'
        }
       else if (/image/.test(mime)) type = 'image'
       else if (/video/.test(mime)) type = 'video'
       else if (/audio/.test(mime)) type = 'audio'
       else type = 'document'
       await myBot.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
       return fs.promises.unlink(pathFile)
       }

    /**
     * 
     * @param {*} jid 
     * @param {*} message 
     * @param {*} forceForward 
     * @param {*} options 
     * @returns 
     */
    myBot.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
		if (options.readViewOnce) {
			message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
			vtype = Object.keys(message.message.viewOnceMessage.message)[0]
			delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
			delete message.message.viewOnceMessage.message[vtype].viewOnce
			message.message = {
				...message.message.viewOnceMessage.message
			}
		}

        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
		let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await myBot.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
        return waMessage
    }

    myBot.cMod = (jid, copy, text = '', sender = myBot.user.id, options = {}) => {
        //let copy = message.toJSON()
		let mtype = Object.keys(copy.message)[0]
		let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
		let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
		else if (content.caption) content.caption = text || content.caption
		else if (content.text) content.text = text || content.text
		if (typeof content !== 'string') msg[mtype] = {
			...content,
			...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
		else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
		copy.key.remoteJid = jid
		copy.key.fromMe = sender === myBot.user.id

        return proto.WebMessageInfo.fromObject(copy)
    }


    /**
     * 
     * @param {*} path 
     * @returns 
     */
    myBot.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
	    size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    return myBot
}

startMybot()


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	log(pint(`Update ${__filename}`, 'orange.'))
	delete require.cache[file]
	require(file)
})
