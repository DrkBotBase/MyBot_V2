module.exports = {
  cmd: ['pista'],
  category: 'games',
  desc: 'pista sobre el juego canción.',
  ignored: true,
  register: true,
  check: { pts: 0 },
  async handler(m) {
    let id = m.chat;
    if(!what_song[id]) return false
    json = what_song[id]
    m.reply(json
      .replace(/[bcdfghjklmnñpqrstvwxyzBCDEFGHJKLMNÑPQRSTVWXYZ]/g,
      '_')
    )
  }
};
