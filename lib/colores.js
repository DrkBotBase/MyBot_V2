const chalk = require('chalk')
log = console.log

// Letras
function pint (text, color) {
	return !color ? chalk.green(text)
	  : color === '.' ? chalk.bold.green(text)
	  : color.endsWith('.') ? chalk.bold.keyword(color.split('.')[0])(text)
	  : color.startsWith('#') ? chalk.hex(color)(text)
	  : color.startsWith('-') ? chalk.hex(color.split('-')[1]).bold(text)
	  : chalk.keyword(color)(text)
};

// Fondos
function bgPint (text, color) {
	return !color ? chalk.bgGreen(text)
	  : color === '.' ? chalk.bold.bgGreen(text)
	  : color.endsWith('.') ? chalk.bold.bgKeyword(color.split('.')[0])(text)
	  : color.startsWith('#') ? chalk.bgHex(color)(text)
	  : color.startsWith('-') ? chalk.bgHex(color.split('-')[1]).bold(text)
	  : chalk.bgKeyword(color)(text)
};

module.exports = { log, pint, bgPint }

// Uso Letras y Fondos
/* Color Default GREEN */
/*
msg = 'Nuevas Formas De Colores.'

log(pint(msg)); // default color
log(pint(msg, '.')); // default color bold
log(pint(msg, 'orange')); // color
log(pint(msg, 'orange.')); // color bold
log(pint(msg, '#d30092')); // hex
log(pint(msg, '-#d30092')); // hex bold

log(bgPint(msg)); // default color
log(bgPint(msg, '.')); // default color bold
log(bgPint(msg, 'orange')); // color fondo
log(bgPint(msg, 'orange.')); // color fondo, letra bold
log(bgPint(msg, '#d30092')); // hex fondo
log(bgPint(msg, '-#d30092')); // hex fondo, letra bold


// Combinaciones
log(pint(bgPint(msg))); // fondo & letra default
log(pint(bgPint(msg), '.')); // fondo & letra default bold
log(pint(bgPint(msg, 'white'), 'black')); // fondo & color letra
log(pint(bgPint(msg, 'white'), 'black.')); // fondo & color letra bold
log(pint(bgPint(msg, '#ffffff'), 'black')); // hex fondo & color letra
log(pint(bgPint(msg, '#ffffff'), 'black.')); // hex fondo & color letra bold
*/