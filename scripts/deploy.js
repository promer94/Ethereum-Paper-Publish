require('dotenv').config()
const path = require('path')
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')
const signale = require('signale')

const contractPath = path.resolve(__dirname, '../compiled/EscrowContract.json')
const _contractObject = require(contractPath)
const _interface = _contractObject.interface
const { bytecode } = _contractObject

const provider = new HDWalletProvider(
  process.env.SEEDPRASE,
  process.env.WEBACCESSPOINT
)

const web3 = new Web3(provider)
const { BN } = web3.utils
;(async () => {
  signale.time('Deploy')
  const accounts = await web3.eth.getAccounts()
  const initialInvest = new BN(web3.utils.toWei('1', 'gwei'))
  signale.info(`Account:${accounts[0]}`)
  signale.pending('Deploying....')
  const newContract = await new web3.eth.Contract(JSON.parse(_interface))
    .deploy({
      data: bytecode,
      arguments: [accounts[0], accounts[0]]
    })
    .send({
      from: accounts[0],
      gas: '3000000',
      value: initialInvest
    })

  signale.success(`Contract has been deployed:${newContract.options.address}`)
  signale.info(
    `You can view the contract at https://rinkeby.etherscan.io/address/${
      newContract.options.address
    }`
  )
  const approve = await newContract.methods
    .approve()
    .send({ from: accounts[0], gas: '5000000' })
  if (approve && approve.status === true) {
    signale.timeEnd('Deploy')
    process.exit()
  }
})()
