require('dotenv').config()
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = async function() {
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
	return { web3Provider, accounts }
}
