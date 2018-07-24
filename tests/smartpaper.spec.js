/** @jest-environment node
 *
 */
const ganache = require('ganache-cli')
const Web3 = require('web3')
const assert = require('assert')
const crypto = require('crypto')

const { smartPaperInterface, smartPaperByte } = require('../utils/contracts')

const provider = ganache.provider()
const description = 'The Smart paper'
const metaData = 'Written by'
const paper = 'The 1 Paper'
const md5 = `0x${crypto
	.createHash('md5')
	.update(paper)
	.digest('hex')}`
let accounts
let paperContract

const web3 = new Web3(provider)
const { toHex } = web3.utils
const { hexToUtf8 } = web3.utils

describe('SmartPaper 📝', () => {
	beforeEach(async () => {
		accounts = await web3.eth.getAccounts()
		paperContract = await new web3.eth.Contract(smartPaperInterface)
			.deploy({
				data: smartPaperByte,
				arguments: [
					toHex(description),
					toHex(metaData),
					md5,
					accounts.filter((ele, index) => index < 3)
				]
			})
			.send({
				from: accounts[0],
				gas: '2100000'
			})
	})

	describe('Contract constructor tests 🎉 ', () => {
		it('Contract Deployed 👌', () => {
			expect(paperContract.options.address).toBeDefined()
		})
		describe('Contract has correct initial properties 🎉', () => {
			it('description 👌', async () => {
				const _description = await paperContract.methods
					.latestDescription()
					.call()
				expect(hexToUtf8(_description)).toBe(description)
			})
			it('metaData 👌', async () => {
				const _metaData = await paperContract.methods.latestMetaData().call()
				expect(hexToUtf8(_metaData)).toBe(metaData)
			})
			it('latestPaper 👌', async () => {
				const _paperMd5 = await paperContract.methods.latestPaper().call()
				expect(_paperMd5).toEqual(
					`0x${crypto
						.createHash('md5')
						.update(paper)
						.digest('hex')}`
				)
			})
			it('paperList 👌', async () => {
				const firstPaper = await paperContract.methods.md5List(0).call()
				expect(firstPaper).toBe(
					`0x${crypto
						.createHash('md5')
						.update(paper)
						.digest('hex')}`
				)
			})
			it('authors 👌', async () => {
				const author1 = await paperContract.methods.authors(0).call()
				expect(author1).toEqual(accounts[0])
				const author2 = await paperContract.methods.authors(1).call()
				expect(author2).toEqual(accounts[1])
				const author3 = await paperContract.methods.authors(2).call()
				expect(author3).toEqual(accounts[2])
			})
		})
	})
	describe('Function tests 🛠', () => {
		it('get papers 👌', async () => {
			const list = await paperContract.methods.getPapers().call()
			expect(
				list.includes(
					`0x${crypto
						.createHash('md5')
						.update(paper)
						.digest('hex')}`
				)
			).toBeTruthy()
		})
		it('get authors 👌', async () => {
			const authors = await paperContract.methods.getAuthors().call()
			expect(authors).toEqual(accounts.filter((ele, index) => index < 3))
		})
		it('author can check in 👌', async () => {
			const second = await paperContract.methods.checkIn().send({
				from: accounts[1],
				gas: '2100000'
			})
			const third = await paperContract.methods.checkIn().send({
				from: accounts[2],
				gas: '2100000'
			})
			const status = second && third
			const latestDescription = await paperContract.methods
				.latestDescription()
				.call({
					gas: '2100000'
				})
			const latestMetaData = await paperContract.methods.latestMetaData().call({
				gas: '2100000'
			})
			const latestPaper = await paperContract.methods.latestPaper().call({
				gas: '2100000'
			})
			const newVersionNumber = await paperContract.methods
				.latestVersion()
				.call({
					gas: '2100000'
				})
			const list = await paperContract.methods.getPapers().call({
				gas: '2100000'
			})
			const version = await paperContract.methods.versions(0).call({
				gas: '2100000'
			})
			const versionMap = await paperContract.methods
				.versionMap(
					`0x${crypto
						.createHash('md5')
						.update(paper)
						.digest('hex')}`
				)
				.call({
					gas: '2100000'
				})
			expect(status).toBeTruthy()
			expect(hexToUtf8(latestDescription)).toBe(description)
			expect(hexToUtf8(latestMetaData)).toBe(metaData)
			expect(latestPaper).toBe(
				`0x${crypto
					.createHash('md5')
					.update(paper)
					.digest('hex')}`
			)
			expect(newVersionNumber).toBe('1')
			expect(list[list.length - 1]).toEqual(
				`0x${crypto
					.createHash('md5')
					.update(paper)
					.digest('hex')}`
			)
			expect(version.versionNumber).toBe('1')
			expect(hexToUtf8(version.versionDescription)).toBe(description)
			expect(hexToUtf8(version.metaData)).toBe(metaData)
			expect(version.isPublished).toBe(true)
			expect(version.voterCount).toBe('3')
			expect(versionMap).toEqual(version)
		})
		it('author can create new version 👌', async () => {
			const versionNumber = await paperContract.methods.latestVersion().call()
			const expectNewVersion = parseInt(versionNumber, 10) + 1
			const description = toHex('The smart paper 2')
			const metaData = toHex('version 2')
			const md5 = `0x${crypto
				.createHash('md5')
				.update('paper 2')
				.digest('hex')}`
			await paperContract.methods
				.createNewVersion(description, metaData, md5)
				.send({
					from: accounts[2],
					gas: '2100000'
				})
			const list = await paperContract.methods.getPapers().call({
				gas: '2100000'
			})
			const version = await paperContract.methods
				.versions(expectNewVersion)
				.call({
					gas: '2100000'
				})
			const versionMap = await paperContract.methods.versionMap(md5).call({
				gas: '2100000'
			})

			expect(list[list.length - 1]).toEqual(md5)
			expect(version.versionNumber).toBe(expectNewVersion.toString())
			expect(hexToUtf8(version.versionDescription)).toBe('The smart paper 2')
			expect(hexToUtf8(version.metaData)).toBe('version 2')
			expect(version.isPublished).toBe(false)
			expect(version.voterCount).toBe('1')
			expect(versionMap).toEqual(version)
		})
		it('author can approve new version 👌', async () => {
			const versionNumber = await paperContract.methods.latestVersion().call()
			const expectNewVersion = parseInt(versionNumber, 10) + 1
			const description = toHex('The smart paper 2')
			const metaData = toHex('version 2')
			const md5 = `0x${crypto
				.createHash('md5')
				.update('paper 2')
				.digest('hex')}`
			await paperContract.methods
				.createNewVersion(description, metaData, md5)
				.send({
					from: accounts[0],
					gas: '2100000'
				})
			await paperContract.methods.approveVersion(2, md5).send({
				from: accounts[1],
				gas: '2100000'
			})
			await paperContract.methods.approveVersion(2, md5).send({
				from: accounts[2],
				gas: '2100000'
			})
			const latestDescription = await paperContract.methods
				.latestDescription()
				.call({
					gas: '2100000'
				})
			const latestMetaData = await paperContract.methods.latestMetaData().call({
				gas: '2100000'
			})
			const latestPaper = await paperContract.methods.latestPaper().call({
				gas: '2100000'
			})
			const newVersionNumber = await paperContract.methods
				.latestVersion()
				.call({
					gas: '2100000'
				})
			const list = await paperContract.methods.getPapers().call({
				gas: '2100000'
			})
			const version = await paperContract.methods
				.versions(expectNewVersion)
				.call({
					gas: '2100000'
				})
			const versionMap = await paperContract.methods.versionMap(md5).call({
				gas: '2100000'
			})

			expect(hexToUtf8(latestDescription)).toBe('The smart paper 2')
			expect(hexToUtf8(latestMetaData)).toBe('version 2')
			expect(latestPaper).toBe(md5)
			expect(newVersionNumber).toBe(expectNewVersion.toString())
			expect(list[list.length - 1]).toEqual(md5)
			expect(version.versionNumber).toBe(expectNewVersion.toString())
			expect(hexToUtf8(version.versionDescription)).toEqual(
				hexToUtf8(latestDescription)
			)
			expect(hexToUtf8(version.metaData)).toEqual(hexToUtf8(latestMetaData))
			expect(version.isPublished).toBe(true)
			expect(version.voterCount).toBe('3')
			expect(versionMap).toEqual(version)
		})
		it('cannot repeat check in 🙅', async () => {
			await expectThrow(
				paperContract.methods.checkIn().send({ from: accounts[0] })
			)
		})
		it('checkIn fails because invalidUser 🙅', async () => {
			await expectThrow(
				paperContract.methods.checkIn().send({ from: accounts[4] })
			)
		})
		it('approve fails because invalidUser 🙅', async () => {
			const versionNumber = await paperContract.methods.latestVersion().call()
			const expectNewVersion = parseInt(versionNumber, 10) + 1
			const description = toHex('New smart paper')
			const metaData = toHex('New smart paper')
			const md5 = `0x${crypto
				.createHash('md5')
				.update('paper 2')
				.digest('hex')}`
			await paperContract.methods
				.createNewVersion(description, metaData, md5)
				.send({
					from: accounts[0],
					gas: '2100000'
				})
			await expectThrow(
				paperContract.methods.approveVersion(expectNewVersion, md5).send({
					from: accounts[4],
					gas: '2100000'
				})
			)
		})
		it('cannot repeat approve 🙅', async () => {
			const versionNumber = await paperContract.methods.latestVersion().call()
			const expectNewVersion = parseInt(versionNumber, 10) + 1
			const description = toHex('New smart paper')
			const metaData = toHex('New smart paper')
			const md5 = `0x${crypto
				.createHash('md5')
				.update('paper 2')
				.digest('hex')}`
			await paperContract.methods
				.createNewVersion(description, metaData, md5)
				.send({
					from: accounts[0],
					gas: '2100000'
				})
			await expectThrow(
				paperContract.methods.approveVersion(expectNewVersion, md5).send({
					from: accounts[0],
					gas: '2100000'
				})
			)
		})
	})
})

async function expectThrow(promise) {
	const errMsg = 'Expected throw not received'
	try {
		await promise
	} catch (err) {
		assert(err.toString().includes('revert'), errMsg)
		return
	}

	assert.fail(errMsg)
}
