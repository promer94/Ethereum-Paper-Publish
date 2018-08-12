require('dotenv').config()
const fs = require('fs-extra')
const path = require('path')
const signale = require('signale')
const math = require('mathjs')
const {
  smartPaperListInterface,
  smartPaperListByte
} = require('../utils/contracts')
const initialWeb3 = require('../utils/web3')

const deployRootContact = async () => {
  const { web3Providers, accounts } = await initialWeb3()
  const web3 = Array.isArray(web3Providers) ? web3Providers[0] : web3Providers
  const { fromWei } = web3.utils
  /** Deploy the contract, calculate the fees and create log*/
  signale.time('Deploy')
  signale.info('SmartPaperList will be deployed')
  signale.info(`Accounts used for deploy ${accounts[0]}`)
  signale.pending('Deploying...')
  const initial = await web3.eth.getBalance(accounts[0])
  const initialBalance = parseFloat(fromWei(initial, 'ether'))
  const listContract = await new web3.eth.Contract(smartPaperListInterface)
    .deploy({
      data: smartPaperListByte
    })
    .send({ from: accounts[0], gas: '4200000' })
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
  const appAddressFile = path.resolve(__dirname, '../demo/src/address.json')
  fs.writeFileSync(
    addressFile,
    `{"address":${JSON.stringify(listContractAddress)}}`
  )
  fs.writeFileSync(
    appAddressFile,
    `{"rootContract":${JSON.stringify(listContractAddress)}}`
  )
  signale.success(`Contract address saved at ${addressFile}`)
  signale.timeEnd('Deploy')
  signale.time('Initial contract')
  signale.pending('transaction pending...')
  await listContract.methods
    .createPaper(
      web3.utils.toHex('Funtional Programing'),
      web3.utils.toHex('Haskell'),
      '0x6b6e73a67f0e67754dab5fb1140edb67',
      [accounts[0], accounts[1]]
    )
    .send({ from: accounts[0], gas: '4200000' })
  await listContract.methods
    .createPaper(
      web3.utils.toHex('Ethereum Smart Paper'),
      web3.utils.toHex('Solidity and JavaScript'),
      '0x330f955928a852b0629dd910c6894bcc',
      [accounts[0], accounts[1]]
    )
    .send({ from: accounts[0], gas: '4200000' })
  signale.success('Initialization finished')
  signale.timeEnd('Initial contract')
  process.exit()
}
deployRootContact()
