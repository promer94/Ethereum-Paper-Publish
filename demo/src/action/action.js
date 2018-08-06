import Web3 from 'web3'
import listInterface from '../Contract/listContract'
import paperInterface from '../Contract/paperContract'

const { toHex } = Web3.utils
const { hexToUtf8 } = Web3.utils
const promiseType = name => [
	name,
	`${name}_PENDING`,
	`${name}_FULFILLED`,
	`${name}_REJECTED`
]

export const FETCH_PAPER_ADDRESS = promiseType('FETCH_PAPER_ADDRESS')
export const FETCH_PAPER = promiseType('FETCH_PAPER')
export const CREATE_PAPER = promiseType('CREATE_PAPER')
export const INIT_USER = promiseType('INIT_USER')
const fetchAddress = address => ({
	type: FETCH_PAPER_ADDRESS[0],
	payload: listInterface(address)
		.getProjects()
		.call()
		.catch(e => e.message)
})

export const fetchPaper = addresses => ({
	type: FETCH_PAPER[0],
	payload: Promise.all(
		addresses.map(address =>
			paperInterface(address)
				.getSummary()
				.call()
				.then(data => handleSummary(address, data))
				.catch(e => e.message)
		)
	)
})
const handleSummary = (address, data) => {
	const obj = {}
	obj[address] = {
		description: hexToUtf8(data[0]),
		metadata: hexToUtf8(data[1]),
		md5: data[2],
		latestVersion: data[3],
		versionCount: data[4]
	}
	return obj
}
export const createPaper = (address, paper) => ({
	type: CREATE_PAPER[0],
	payload: listInterface(address)
		.createNewPaper(
			toHex(paper.description),
			toHex(paper.metadata),
			paper.md5,
			paper.accounts
		)
		.send({ gas: '2100000' })
		.catch(e => e.message)
})

const initialUser = web3 => ({
	type: INIT_USER[0],
	payload: web3.eth
		.getAccounts()
		.then(data => data[0])
		.catch(e => e.message)
})
export const updateUser = web3 => {
	return dispatch => {
		const account = dispatch(initialUser(web3))
		account.then(data => {
			if (data.value === null) {
				dispatch({
					type: INIT_USER[3],
					payload:
						'Please unlock you MetaMask and Make sure your are under Rinkeby Test Network'
				})
			}
		})
	}
}
export const updatePaper = address => {
	return dispatch => {
		const addresses = dispatch(fetchAddress(address))
		addresses.then(data => {
			if (data.value.length === 0) {
				dispatch({
					type: FETCH_PAPER_ADDRESS[3],
					payload:
						'Please unlock you MetaMask and Make sure your are under Rinkeby Test Network'
				})
			}
		})
	}
}
