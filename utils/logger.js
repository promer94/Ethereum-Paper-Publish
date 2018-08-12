const { format, transports, createLogger } = require('winston')

const { combine, timestamp } = format
const fs = require('fs-extra')
const path = require('path')

module.exports = function(name, time) {
  const paperLogDir = path.resolve(__dirname, `../log/${name}`)
  fs.ensureDirSync(paperLogDir)
  const blockLogger = createLogger({
    format: combine(timestamp(), format.json()),
    transports: [
      new transports.File({
        filename: `${paperLogDir}/${name}${time}.log`,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false
      }),
      new transports.File({
        filename: `${paperLogDir}/${name}${time}_error.log`,
        level: 'error',
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false
      }),
      new transports.File({
        filename: `${paperLogDir}/cost.log`,
        level: 'warn',
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false
      })
    ]
  })
  if (process.env.NODE_ENV !== 'TESTSERVER') {
    blockLogger.add(
      new transports.Console({
        format: format.simple()
      })
    )
  }
  return blockLogger
}
