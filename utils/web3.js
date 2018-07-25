require('dotenv').config()
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = async function() {
	const web3Providers = []
	for (let i = 0; i < 3; i += 1) {
		const provider = new HDWalletProvider(
			process.env.SEEDPRASE,
			process.env.WEBACCESSPOINT,
			i
		)
		const web3 = new Web3(provider)
		web3Providers.push(web3)
	}
	let accounts = await Promise.all(
		web3Providers.map(web3 => web3.eth.getAccounts())
	)
	accounts = accounts.map(address => address[0])
	const balance = await Promise.all(
		accounts.map((address, index) =>
			web3Providers[index].eth.getBalance(address)
		)
	)
	const totalBalance = balance
		.map((amount, index) =>
			parseFloat(web3Providers[index].utils.fromWei(amount, 'ether'))
		)
		.reduce((total, current) => total + current, parseFloat(0))
	return { web3Providers, accounts, totalBalance }
}
