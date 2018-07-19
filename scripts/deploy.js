require('dotenv').config()
const path = require('path')
const Web3 = require('web3') //eslint-disable-line
const HDWalletProvider = require('truffle-hdwallet-provider')
const signale = require('signale') //eslint-disable-line

const contractPath = path.resolve(__dirname, '../compiled/SmartPaper.json')
const _contractObject = require(contractPath)
const _interface = _contractObject.interfacev //eslint-disable-line
const { bytecode } = _contractObject //eslint-disable-line

const provider = new HDWalletProvider(
  process.env.SEEDPRASE,
  process.env.WEBACCESSPOINT
)

const web3 = new Web3(provider) // eslint-disable-line
