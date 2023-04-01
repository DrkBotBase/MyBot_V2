module.exports = {
  cmd: ['donar'],
  category: 'info',
  desc: 'metodo para colaborar con el creador.',
  check: { pts: null },
  async handler(m) {
    msg = `Hola *${m.pushName}*\nVEO QUE QUIERES DONAR\nPuedes hacerlo por medio de las siguientes formas disponibles\n\n`;
    msg += `${BOX.iniM.replace("{}","PAYPAL")}\n`
    msg += `${BOX.med}\n`
    msg += `${BOX.end}\n`
    msg += "Tu donasión será muy valiosa";
    m.reply(msg)
  }
};