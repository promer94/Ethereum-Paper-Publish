const path = require('path')

const smartPaper = require(path.resolve(
	__dirname,
	'../compiled/SmartPaper.json'
))
const smartPaperList = require(path.resolve(
	__dirname,
	'../compiled/SmartPaperList.json'
))
const smartPaperInterface = JSON.parse(smartPaper.interface) //eslint-disable-line
const smartPaperByte = smartPaper.bytecode //eslint-disable-line
const smartPaperListInterface = JSON.parse(smartPaperList.interface)
const smartPaperListByte = smartPaperList.bytecode

module.exports = {
	smartPaperInterface,
	smartPaperByte,
	smartPaperListInterface,
	smartPaperListByte
}
