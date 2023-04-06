module.exports = {
  cmd: ['delttt'],
  category: 'games',
  desc: 'borrar sesion activa TicTacToe.',
  register: true,
  group: true,
  check: { pts: 0 },
  async handler(m) {
    if (t_t_t) {
      delete t_t_t;
      m.reply("Sesión de TicTacToe eliminada con éxito",)
    } else {
      m.reply("No hay session activa.");
    }
  }
};

