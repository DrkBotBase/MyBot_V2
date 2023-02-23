const fs = require('fs')

function randomId(size) {
  let id = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const numCharacters = characters.length;
  for (let i = 0; i < size; i++) {
    id += characters.charAt(Math.floor(Math.random() * numCharacters));
  }
  return id;
}


const databaseFile = "./src/database.json";
let database = {};

try {
  database = JSON.parse(fs.readFileSync(databaseFile));
} catch (error) {
  console.error(`No se pudo leer el archivo ${databaseFile}:`, error);
  //fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
}

function totalHit() {
  let sum = 0;
  for (let key in database) {
    sum += database[key].usage;
  }
  return sum;
}


const keyUsageLimit = 3;

class User {
  constructor(phone, name) {
    this.phone = phone;
    this.name = name;

    if (!database[this.phone]) {
        database[this.phone] = { id: randomId(6), name: this.name, block: false, usage: 0, cash: 2000, report: 0, useKeys: {} }
    }
    fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
  }

  delete() {
    if (database[this.phone]) {
      delete database[this.phone];
      fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
    } else {
      console.error(`No se encontró el usuario "${this.phone}" en la base de datos`);
    }
  }

  static show(phone) {
    if (database[phone]) {
      //console.log(`Información del usuario "${phone}":`, database[phone]);
      return {
        number: phone,
        id: database[phone].id,
        name: database[phone].name,
        block: database[phone].block,
        use: database[phone].usage,
        points: database[phone].cash,
        report: database[phone].report,
        keys: database[phone].useKeys
      }
    }
  }

  static check(phone) {
    return database.hasOwnProperty(phone)
  }

  static counter(phone, properties) {
    if (database[phone]) {
      Object.keys(properties).forEach((prop) => {
        if (database[phone].hasOwnProperty(prop)) {
          database[phone][prop] += properties[prop]
        } else {
          console.log(`La propiedad "${prop}" que ingresó no existe en el objeto del usuario "${phone}"`);
        }
      })
      fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
    } else {
      console.log(`El usuario "${phone}" no existe en la base de datos`);
    }
  }
  
  static change(phone, properties) {
    Object.keys(properties).forEach((prop) => {
      database[phone][prop] = properties[prop]
    })
    fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
  }
}

const addUserKey = (userId, key) => {
  try {
    if (database.hasOwnProperty(userId)) {
      const user = database[userId]
      
      if (user.useKeys.hasOwnProperty(key)) {
        if (user.useKeys[key] < keyUsageLimit) {
          user.useKeys[key]++
        } else {
          return false
        }
      } else {
        user.useKeys[key] = 1
      }

      fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2))
    } else {
      m.reply(`El usuario ${userId} no está registrado en la base de datos`)
    }
  } catch (error) {
    console.error(error)
  }
}


module.exports = { User, addUserKey, totalHit }