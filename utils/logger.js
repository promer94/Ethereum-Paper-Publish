const winston = require('winston')
const fs = require('fs-extra')
const path = require('path')

module.exports = function(name) {
	const paperLogDir = path.resolve(__dirname, `../log/${name}`)
	fs.removeSync(paperLogDir)
	fs.ensureDirSync(paperLogDir)
	const blockLogger = winston.createLogger({
		format: winston.format.json(),
		transports: [
			new winston.transports.File({
				filename: `${paperLogDir}/${name}.log`,
				json: true,
				maxsize: 5242880, // 5MB
				maxFiles: 5,
				colorize: false
			})
		]
	})
	return blockLogger
}
