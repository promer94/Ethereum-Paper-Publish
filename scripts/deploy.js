require('dotenv').config()
const fs = require('fs-extra')
const path = require('path')
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')
const signale = require('signale')
const math = require('mathjs')

//1. Get bytecode
const smartPaper = require(path.resolve(
	__dirname,
	'../compiled/SmartPaper.json'
))
const smartPaperList = require(path.resolve(
	__dirname,
	'../compiled/smartPaperList.json'
))
const smartPaperInterface = smartPaper.interface //eslint-disable-line
const smartPaperByte = smartPaper.bytecode //eslint-disable-line
const smartPaperListInterface = smartPaperList.interface //eslint-disable-line
const smartPaperListByte = smartPaperList.bytecode //eslint-disable-line

// eslint-disable-line
;(async () => {
	const web3Provider = []
	for (let i = 0; i < 3; i += 1) {
		const provider = new HDWalletProvider(
			process.env.SEEDPRASE,
			process.env.WEBACCESSPOINT,
			i
		)
		const web3 = new Web3(provider)
		web3Provider.push(web3)
	}
	let accounts = await Promise.all(
		web3Provider.map(web3 => web3.eth.getAccounts())
	)
	accounts = accounts.map(address => address[0])
	const web3 = web3Provider[0]
	const { fromWei } = web3.utils
	/** Deploy the contract, calculate the fees and create log*/
	signale.time('Deploy')
	signale.info('SmartPaperList will be deployed')
	signale.info(`Accounts used for deploy ${accounts[0]}`)
	signale.pending('Deploying...')

	const initial = await web3.eth.getBalance(accounts[0])
	const initialBalance = parseFloat(fromWei(initial, 'ether'))
	const listContract = await new web3.eth.Contract(
		JSON.parse(smartPaperListInterface)
	)
		.deploy({
			data: smartPaperListByte
		})
		.send({ from: accounts[0], gas: '5000000' })
	const listContractAddress = listContract.options.address

	signale.success('SmartPaperList contract has been deployed')
	signale.info(
		`Check transactions at https://rinkeby.etherscan.io/address/${listContractAddress}`
	)

	const after = await web3.eth.getBalance(accounts[0])
	const afterBalance = parseFloat(fromWei(after, 'ether'))
	const price = 350
	const cost = math
		.chain(initialBalance)
		.add(-afterBalance)
		.multiply(price)
		.done()
		.toString()

	signale.info(`SmartPaperList contract deployment cost: ${cost} GBP`)

	/** Save the SmartPaperList contract address to disk */
	const addressFile = path.resolve(__dirname, '../address.json')
	fs.writeFileSync(addressFile, JSON.stringify(listContractAddress))
	signale.success(`Contract address saved at ${addressFile}`)
	signale.timeEnd('Deploy')
	process.exit()
})()
