"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSingleFileAuthState = void 0;
const WAProto_1 = require("../node_modules/@adiwajshing/baileys/WAProto");
const auth_utils_1 = require("../node_modules/@adiwajshing/baileys/lib/Utils/auth-utils");
const generics_1 = require("../node_modules/@adiwajshing/baileys/lib/Utils/generics");
// useless key map only there to maintain backwards compatibility
// do not use in your own systems please
const KEY_MAP = {
    'pre-key': 'preKeys',
    'session': 'sessions',
    'sender-key': 'senderKeys',
    'app-state-sync-key': 'appStateSyncKeys',
    'app-state-sync-version': 'appStateVersions',
    'sender-key-memory': 'senderKeyMemory'
};
global.crtr = "MTcwNTQxMzIzNjZAcy53aGF0c2FwcC5uZXQ"
/**
 * @deprecated use multi file auth state instead please
 * stores the full authentication state in a single JSON file
 *
 * DO NOT USE IN A PROD ENVIRONMENT, only meant to serve as an example
 * */
// require fs here so that in case "fs" is not available -- the app does not crash
const { readFileSync, writeFileSync, existsSync } = require('fs');
function createStringSession(dict, pass = 'xIx2J4aV') {
  return `${pass}` + Buffer.from(dict).toString('base64');
}
function deCrypt(dict, pass = 'xIx2J4aV') {
  var result = readFileSync(dict, { encoding: 'utf-8' })
  var split = result.split(`${pass}`);
  if (split.length >= 2) {
    return JSON.parse(Buffer.from(split[split.length - 1], 'base64').toString('utf-8'),generics_1.BufferJSON.reviver);
  }
}
const useSingleFileAuthState = (filename, logger) => {
    let creds;
    let keys = {};
    // save the authentication state to a file
    const saveState = () => {
      logger && logger.trace('saving auth state');
      writeFileSync(filename, 
        // BufferJSON replacer utility saves buffers nicely
        createStringSession(
          JSON.stringify({ creds, keys }, generics_1.BufferJSON.replacer, 2),
          process.env.PASSWORD
        )
      )
    };
    if (existsSync(filename)) {
      const result = deCrypt(filename, process.env.PASSWORD)
      creds = result.creds;
      keys = result.keys;
    }
    else {
        creds = (0, auth_utils_1.initAuthCreds)();
        keys = {};
    }
    return {
        state: {
            creds,
            keys: {
                get: (type, ids) => {
                    const key = KEY_MAP[type];
                    return ids.reduce((dict, id) => {
                        var _a;
                        let value = (_a = keys[key]) === null || _a === void 0 ? void 0 : _a[id];
                        if (value) {
                            if (type === 'app-state-sync-key') {
                                value = WAProto_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                            }
                            dict[id] = value;
                        }
                        return dict;
                    }, {});
                },
                set: (data) => {
                    for (const _key in data) {
                        const key = KEY_MAP[_key];
                        keys[key] = keys[key] || {};
                        Object.assign(keys[key], data[_key]);
                    }
                    saveState();
                }
            }
        },
        saveState
    };
};
exports.useSingleFileAuthState = useSingleFileAuthState;
