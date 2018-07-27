const fs = require('fs-extra')
const path = require('path')
const faker = require('faker')
const crypto = require('crypto')
const math = require('mathjs')
const web3 = require('../utils/ganacheWeb3')
const {
	smartPaperListInterface,
	smartPaperListByte,
	smartPaperInterface
} = require('../utils/contracts')
const logger = require('../utils/logger')

const description = 'The Smart paper'
const metaData = 'Written by'
const md5 = content =>
	`0x${crypto
		.createHash('md5')
		.update(content)
		.digest('hex')}`
const costFile = path.resolve(__dirname, 'author-version-initial-cost.csv')
fs.removeSync(costFile)
fs.ensureFileSync(costFile)
fs.appendFileSync(costFile, 'authors,cost,\n')
const authorTest = async numbers => {
	const { accounts, web3Providers, totalBalance } = await web3(numbers)
	const { toHex } = web3Providers.utils
	const paper = faker.commerce.product()
	const internalLogger = logger('authors_newPaper_cost', `${numbers}`)
	try {
		const splContract = await new web3Providers.eth.Contract(
			smartPaperListInterface
		)
			.deploy({
				data: smartPaperListByte
			})
			.send({ from: accounts[0], gas: '6721975' })
		await splContract.methods
			.createPaper(toHex(description), toHex(metaData), md5(paper), accounts)
			.send({ from: accounts[0], gas: '6721975' })
		const result = await splContract.methods.getProjects().call()

		await Promise.all(
			accounts.map(address =>
				new web3Providers.eth.Contract(smartPaperInterface, result[0]).methods
					.checkIn()
					.send({ from: address, gas: '6721975' })
			)
		)
		const afterBalance = await Promise.all(
			accounts.map(address => web3Providers.eth.getBalance(address))
		)
		const totalAfterBalance = afterBalance
			.map(amount => parseFloat(web3Providers.utils.fromWei(amount)))
			.reduce((total, current) => total + current, parseFloat(0))
		const cost = math
			.chain(totalBalance)
			.add(-totalAfterBalance)
			.multiply(350)
			.done()
			.toString()
		const costFile = path.resolve(__dirname, 'author-version-initial-cost.csv')
		fs.appendFileSync(costFile, `${numbers},${cost},\n`)
		internalLogger.info(`${numbers} accounts cost: ${cost}`)
	} catch (error) {
		internalLogger.error(error.message)
	} finally {
		internalLogger.info(`test for ${numbers} authors is over`)
	}
}
for (let i = 1; i <= 121; i += 1) {
	setTimeout(() => {
		authorTest(i)
	}, (i - 1) * 100 * 2)
}
