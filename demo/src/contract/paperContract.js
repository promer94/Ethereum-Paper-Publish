import web3 from './web3Config'

const paperList = require('./SmartPaper.json')

const paperInterface = address =>
	new web3.eth.Contract(JSON.parse(paperList.interface), address).methods

export default paperInterface
