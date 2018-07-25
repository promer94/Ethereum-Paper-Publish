/**
 * This is a 3-authors Smart Paper
 * The cost of Create a Smart Paper and approve will be record.
 *
 */
const faker = require('faker')
const crypto = require('crypto')
const math = require('mathjs') //eslint-disable-lines
const web3 = require('../utils/web3')
const address = require('../utils/address')
const {
	smartPaperListInterface,
	smartPaperInterface
} = require('../utils/contracts')
const logger = require('../utils/logger')

const description = 'The Smart paper'
const metaData = 'Written by'
const smartPaperList = []
const md5 = content =>
	`0x${crypto
		.createHash('md5')
		.update(content)
		.digest('hex')}`
const versionTest = async times => {
	const { accounts, web3Providers, totalBalance } = await web3()
	const web3One = web3Providers[0]
	const web3Two = web3Providers[1]
	const web3Three = web3Providers[2]
	const { toHex } = web3One.utils
	const paper = faker.commerce.product()

	const internalLogger = logger(`versionTest${times + 1}`)
	try {
		internalLogger.info(`The version test ${times + 1} starts`)
		const { to } = await new web3One.eth.Contract(
			smartPaperListInterface,
			address
		).methods
			.createPaper(toHex(description), toHex(metaData), md5(paper), accounts)
			.send({ from: accounts[0], gas: 2100000 })
		internalLogger.info(`The ${times + 1} version is at ${to}`)
		smartPaperList.push(to)
		await new web3Two.eth.Contract(smartPaperInterface, to).methods
			.checkIn()
			.call()
		await new web3Three.eth.Contract(smartPaperInterface, to).methods
			.checkIn()
			.call()
		internalLogger.info(`The ${times + 1} version has been approved`)
		const after = await web3()
		const cost = math
			.chain(totalBalance)
			.add(-after.totalBalance)
			.multiply(350)
			.done()
			.toString()
		internalLogger.warn(cost)
	} catch (error) {
		internalLogger.error(error.message)
	} finally {
		internalLogger.info(`The version test ${times + 1} is over`)
	}
}
for (let i = 0; i < 100; i += 1) {
	setTimeout(() => versionTest(i), i * 10000)
}
