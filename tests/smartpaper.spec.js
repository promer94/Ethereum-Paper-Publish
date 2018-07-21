/** @jest-environment node
 *
 */
const path = require('path')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const fs = require('fs-extra')
const assert = require('assert')
const winston = require('winston')
const crypto = require('crypto')
//1. Get bytecode
const smartPaper = require(path.resolve(
	__dirname,
	'../compiled/SmartPaper.json'
))
const smartPaperInterface = smartPaper.interface
const smartPaperByte = smartPaper.bytecode

const smartPaperList = require(path.resolve(
	__dirname,
	'../compiled/smartPaperList.json'
))
const smartPaperListInterface = smartPaperList.interface
const smartPaperListByte = smartPaperList.bytecode

//2. Config logger
const paperLogDir = path.resolve(__dirname, 'log/SmartPaperLog')
fs.removeSync(paperLogDir)
fs.ensureDirSync(paperLogDir)
const blockLogger = winston.createLogger({
	format: winston.format.json(),
	transports: [
		new winston.transports.File({
			filename: `${paperLogDir}/SmartPaper.log`,
			json: true,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			colorize: false
		})
	]
})
blockLogger.log = blockLogger.info

//3. Config provider
const provider = ganache.provider({
	logger: blockLogger
})

//4. Initialize test data;
const description = 'First Smart Paper'
const metaData = 'Written by'
const paper = 'First paper'
let accounts
let _authors

//5. Initialize Web3 instance
const web3 = new Web3(provider)
const { toHex } = web3.utils
const { hexToUtf8 } = web3.utils
const { isAddress } = web3.utils

let listContract
let paperAddress
describe('SmartPaperList 📝', () => {
	beforeEach(async () => {
		accounts = await web3.eth.getAccounts()
		listContract = await new web3.eth.Contract(
			JSON.parse(smartPaperListInterface)
		)
			.deploy({
				data: smartPaperListByte
			})
			.send({
				from: accounts[0],
				gas: '1000000'
			})
	})
	describe('Contract constructor tests 🎉', () => {
		it('Contract deployed 👌', () => {
			expect(listContract.options.address).toBeDefined()
		})
	})
	describe('Function tests 🛠', () => {
		beforeAll(async () => {
			const testHash = crypto.createHash('md5')
			const _description = toHex(description)
			const _metaData = toHex(metaData)
			const _paperMD5 = `0x${testHash.update(paper).digest('hex')}`
			const authors = [accounts[0], accounts[1], accounts[2]]
			paperAddress = await listContract.methods
				.createPaper(_description, _metaData, _paperMD5, authors)
				.call()
		})
		it('New paper created 👌', async () => {
			expect(isAddress(paperAddress)).toBeTruthy()
		})
		it('New paper stored 👌', async () => {
			const addressList = await new web3.eth.Contract(
				JSON.parse(smartPaperListInterface),
				listContract.options.address
			).methods
				.getProjects()
				.call()
			expect(addressList.includes())
		})
	})
})

let paperContract
describe('SmartPaper 📝', () => {
	beforeEach(async () => {
		const testHash = crypto.createHash('md5')
		accounts = await web3.eth.getAccounts()
		const _description = toHex(description)
		const _metaData = toHex(metaData)
		const _paperMD5 = `0x${testHash.update(paper).digest('hex')}`
		_authors = [accounts[0], accounts[1], accounts[2]]

		paperContract = await new web3.eth.Contract(JSON.parse(smartPaperInterface))
			.deploy({
				data: smartPaperByte,
				arguments: [_description, _metaData, _paperMD5, _authors]
			})
			.send({
				from: accounts[0],
				gas: '1000000'
			})
	})

	describe('Contract constructor tests 🎉 ', () => {
		it('Contract Deployed 👌', () => {
			expect(paperContract.options.address).toBeDefined()
		})
		it('Contract has correct initial properties 👌', async () => {
			expect.assertions(5)
			const _description = await paperContract.methods.description().call()
			const _metaData = await paperContract.methods.metaData().call()
			const _paperMD5 = await paperContract.methods.listOfPaperMD5(0).call()
			const _authorList = await paperContract.methods.getAuthors().call()
			const _version = await paperContract.methods.versions(_paperMD5).call()
			expect(hexToUtf8(_description)).toBe(description)
			expect(hexToUtf8(_metaData)).toBe(metaData)
			expect(_paperMD5).toBe(
				`0x${crypto
					.createHash('md5')
					.update(paper)
					.digest('hex')}`
			)
			expect(_authorList).toEqual(_authors)
			const versionObject = {
				'0':
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				'1': _metaData,
				'2': false,
				isPublished: false,
				metaData: _metaData,
				versionNumber:
					'0x0000000000000000000000000000000000000000000000000000000000000000'
			}
			expect(_version).toEqual(versionObject)
		})
	})
	describe('Function tests 🛠', () => {
		it('getPapers 👌', async () => {
			const paperList = await paperContract.methods.getPapers().call()
			expect(paperList[0]).toBe(
				`0x${crypto
					.createHash('md5')
					.update(paper)
					.digest('hex')}`
			)
		})
		it('getAuthor 👌', async () => {
			const authorsList = await paperContract.methods.getAuthors().call()
			expect(authorsList).toEqual(_authors)
		})
		it('Author can check in 👌', async () => {
			const first = await paperContract.methods.checkIn().send({
				from: accounts[0]
			})
			const second = await paperContract.methods.checkIn().send({
				from: accounts[1]
			})
			const third = await paperContract.methods.checkIn().send({
				from: accounts[3]
			})
			const status = first && second && third
			expect(status).toBe(true)
		})
		it('Check in fail for invalidUser 🙅', async () => {})
	})
})

async function expectThrow(promise) {
	//eslint-disable-line
	const errMsg = 'Expected throw not received'
	try {
		await promise
	} catch (err) {
		assert(err.toString().includes('revert'), errMsg)
		return
	}

	assert.fail(errMsg)
}
