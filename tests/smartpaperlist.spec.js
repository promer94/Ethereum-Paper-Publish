/** @jest-environment node
 *
 */
const path = require('path')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const crypto = require('crypto')

const contract = require(path.resolve(
	__dirname,
	'../compiled/SmartPaperList.json'
))
const _interface = contract.interface
const _bytecode = contract.bytecode

const provider = ganache.provider()

const description = 'First Smart Paper'
const metaData = 'Written by'
const paper = 'First paper'
let accounts
let listContract
let paperAddress

const web3 = new Web3(provider)
const { toHex } = web3.utils
const { isAddress } = web3.utils

describe('SmartPaperList 📝', () => {
	beforeEach(async () => {
		accounts = await web3.eth.getAccounts()
		listContract = await new web3.eth.Contract(JSON.parse(_interface))
			.deploy({
				data: _bytecode
			})
			.send({
				from: accounts[0],
				gas: '5000000'
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
				JSON.parse(_interface),
				listContract.options.address
			).methods
				.getProjects()
				.call()
			expect(addressList.includes(paperAddress))
		})
	})
})
