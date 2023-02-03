const fs = require("fs")

function randomId(length) {
  var result           = ''
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var characteresLength = characters.length
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * characteresLength))
  }
  return result;
}

const addUser = (userId, name, _db) => {
    let position = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].phone === userId) {
            position = true
        }
    })
    if (position === false) {
        const obj = { id: randomId(20), phone: userId, name: name, register: true, block: false, usage: 0, cash: 1000, fail: 0}
        _db.push(obj)
        fs.writeFileSync('./src/people.json', JSON.stringify(_db, null, 2))
        return false
    }
}

const chekUser = (userId, _db) => {
   let status = false
   Object.keys(_db).forEach((i) => {
      if (_db[i].phone === userId) {
         status = true
      }
   })
   return status
}
const showData = (userId, _db) => {
   let status = false
   Object.keys(_db).forEach((i) => {
      if (_db[i].phone === userId && _db[i].block === true) {
         status = true
      }
   })
   return status
}

const addBlockUser = (userId, _db) => {
	let found = false
	Object.keys(_db).forEach((i) => {
		if (_db[i].phone === userId) {
			found = i
		}
	})
	if (found !== false) {
		_db[found].block = true
		fs.writeFileSync("./src/people.json", JSON.stringify(_db, null, 2))
	}
}
const delBlockUser = (userId, _db) => {
    let found = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].phone === userId) {
            found = i
        }
    })
    if (found !== false) {
		_user[found].block = false
		fs.writeFileSync("./src/people.json", JSON.stringify(_user, null, 2))
	}
}

const unreg = (userId, _db) => {
    let found = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].phone === userId) {
            found = i
        }
    })
    if (found !== false) {
		_user[found].register = false
		fs.writeFileSync("./src/people.json", JSON.stringify(_user, null, 2))
	}
}

const addFailUser = (userId, _db) => {
	Object.keys(_db).forEach((i) => {
		if (_db[i].phone === userId) {
		  _db[i].fail++
		}
    if (_db[i].phone === userId && _db[i].fail === 3) {
        _db[i].block = true
        return m.reply('Tienes 3 fallas, has sido bloqueado.')
      }
	})
	fs.writeFileSync("./src/people.json", JSON.stringify(_db, null, 2))
}

const resetDataUsers = (_db) => {
  Object.keys(_db).forEach((i) => {
    _db[i].fail = 0
    _db[i].block = false
    //_db[i].cash = 1000
  })
  fs.writeFile('./src/people.json', JSON.stringify(_db, null, 2))
}

const addUsageUser = (userId, _db) => {
	Object.keys(_db).forEach((i) => {
		if (_db[i].phone === userId) {
		  _db[i].usage++
		}
	})
	fs.writeFileSync("./src/people.json", JSON.stringify(_db, null, 2))
}

const addCashUser = (userId, monei, _db) => {
	Object.keys(_db).forEach((i) => {
		if (_db[i].phone === userId) {
		  _db[i].cash += monei
		}
	})
	fs.writeFileSync("./src/people.json", JSON.stringify(_db, null, 2))
}

module.exports = {
  addUser,
  chekUser,
  showData,
  addBlockUser,
  delBlockUser,
  unreg,
  addFailUser,
  resetDataUsers,
  addUsageUser,
  addCashUser
}