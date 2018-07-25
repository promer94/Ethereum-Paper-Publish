const Web3 = require('web3')
const ganache = require('ganache-cli')

module.exports = async number => {
	const provider = ganache.provider({
		total_accounts: Number.isSafeInteger(number) ? number : 10
	})
	const web3Providers = new Web3(provider)
	const accounts = await web3Providers.eth.getAccounts()
	const balance = await Promise.all(
		accounts.map(address => web3Providers.eth.getBalance(address))
	)
	const totalBalance = balance
		.map(amount => parseFloat(web3Providers.utils.fromWei(amount)))
		.reduce((total, current) => total + current, parseFloat(0))
	return { web3Providers, accounts, totalBalance }
}
