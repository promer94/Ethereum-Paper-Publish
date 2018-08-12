import web3 from './web3'

const paperList = require('../Contract/SmartPaperList.json')

const listInterface = address =>
  new web3.eth.Contract(JSON.parse(paperList.interface), address).methods
export default listInterface
