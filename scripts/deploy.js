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
    .send({ from: accounts[0], gas: '2100000' })
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
  fs.writeFileSync(
    addressFile,
    `{"address":${JSON.stringify(listContractAddress)}}`
  )
  signale.success(`Contract address saved at ${addressFile}`)
  signale.timeEnd('Deploy')
  process.exit()
}
deployRootContact()
