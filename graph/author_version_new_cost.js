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
/** Initialize test data*/
const description = 'The Smart paper'
const metaData = 'Written by'
const md5 = content =>
  `0x${crypto
    .createHash('md5')
    .update(content)
    .digest('hex')}`
/** Initialize cost records file */
const costFile = path.resolve(__dirname, 'NewVersion-totalcost.csv')
const createCostFile = path.resolve(__dirname, 'NewVersion-createcost.csv')
const approveCostFile = path.resolve(__dirname, 'NewVersion-approvecost.csv')
fs.removeSync(costFile)
fs.ensureFileSync(costFile)
fs.appendFileSync(costFile, 'numOfAuthor,TotalCost\n')
fs.removeSync(createCostFile)
fs.ensureFileSync(createCostFile)
fs.appendFileSync(createCostFile, 'numOfAuthor,CreateCost\n')
fs.removeSync(approveCostFile)
fs.ensureFileSync(approveCostFile)
fs.appendFileSync(approveCostFile, 'numOfAuthor,Approvecost\n')
const authorTest = async numbers => {
  const { accounts, web3Providers } = await web3(numbers)
  const { toHex } = web3Providers.utils
  const paper = faker.commerce.product()
  const internalLogger = logger('authors_newVersion_cost', `${numbers}`)
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

    const Balance = await Promise.all(
      accounts.map(address => web3Providers.eth.getBalance(address))
    )
    const totalBalance = Balance.map(amount =>
      parseFloat(web3Providers.utils.fromWei(amount))
    ).reduce((total, current) => total + current, parseFloat('0'))

    const newMd5 = md5(faker.commerce.product())
    await new web3Providers.eth.Contract(smartPaperInterface, result[0]).methods
      .createNewVersion(toHex(description), toHex(metaData), newMd5)
      .send({ from: accounts[0], gas: '6721975' })

    const createBalance = await Promise.all(
      accounts.map(address => web3Providers.eth.getBalance(address))
    )
    const createTotalBalance = createBalance
      .map(amount => parseFloat(web3Providers.utils.fromWei(amount)))
      .reduce((total, current) => total + current, parseFloat('0'))
    const createCost = math
      .chain(totalBalance)
      .add(-createTotalBalance)
      .multiply(350)
      .done()
      .toString()
      .trim()
    await Promise.all(
      accounts.map(address =>
        new web3Providers.eth.Contract(smartPaperInterface, result[0]).methods
          .approveVersion(2, newMd5)
          .send({ from: address, gas: '6721975' })
      )
    )
    const afterBalance = await Promise.all(
      accounts.map(address => web3Providers.eth.getBalance(address))
    )
    const afterTotalBalance = afterBalance
      .map(amount => parseFloat(web3Providers.utils.fromWei(amount)))
      .reduce((total, current) => total + current, parseFloat('0'))
    const approveCost = math
      .chain(createTotalBalance)
      .add(-afterTotalBalance)
      .multiply(350)
      .done()
      .toString()
      .trim()
    const cost = math
      .chain(totalBalance)
      .add(-afterTotalBalance)
      .multiply(350)
      .done()
      .toString()
      .trim()

    fs.appendFileSync(costFile, `${numbers},${cost}\n`)
    fs.appendFileSync(createCostFile, `${numbers},${createCost}\n`)
    fs.appendFileSync(approveCostFile, `${numbers},${approveCost}\n`)
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
