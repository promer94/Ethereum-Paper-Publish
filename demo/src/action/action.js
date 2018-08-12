import { toast } from 'react-toastify'
import { navigate } from '@reach/router'
import web3 from '../Web3/web3'
import listInterface from '../Web3/listContract'
import paperInterface from '../Web3/paperContract'

const { toHex } = web3.utils
const { hexToUtf8 } = web3.utils
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
export const FETCH_VERSIONS = promiseType('FETCH_VERSION')
export const CREATE_VERSION = promiseType('CREATE_VERSION')
export const APPROVE_VERSION = promiseType('APPROVE_VERSION')
export const ADD_AUTHOR = promiseType('ADD_AUTHOR')
export const APPROVE_AUTHOR = promiseType('APPROVE_AUTHOR')
const fetchAddress = address => ({
  type: FETCH_PAPER_ADDRESS[0],
  payload: listInterface(address)
    .getProjects()
    .call()
    .catch(e => e.message)
})
export const fetchPaper = (addresses, acc) =>
  Array.isArray(addresses)
    ? {
        type: FETCH_PAPER[0],
        payload: Promise.all(
          addresses.map(address =>
            paperInterface(address)
              .getSummary()
              .call({ from: acc })
              .then(data => handleSummary(address, data))
              .catch(e => e.message)
          )
        )
      }
    : { type: FETCH_PAPER[3] }
const handleSummary = (address, data) => ({
  address,
  description: hexToUtf8(data[0]),
  metadata: hexToUtf8(data[1]),
  md5: data[2],
  latestVersion: data[3],
  versionCount: data[4],
  isAuthor: data[5],
  isAgreed: data[6],
  newAuthorRequest: data[7]
})
export const createPaper = (address, paper, creator) => ({
  type: CREATE_PAPER[0],
  payload: listInterface(address)
    .createPaper(
      toHex(paper.description),
      toHex(paper.metadata),
      paper.md5,
      paper.authors
    )
    .send({ gas: '2100000', from: creator })
    .catch(e => e.message)
})

const initialUser = () => ({
  type: INIT_USER[0],
  payload: web3.eth
    .getAccounts()
    .then(data => data[0])
    .catch(e => e.message)
})
export const updateUser = () => {
  return dispatch => {
    const account = dispatch(initialUser())
    account.then(data => {
      if (data.value === null) {
        dispatch({
          type: INIT_USER[3],
          payload:
            'Please unlock you MetaMask and Make sure your are under Rinkeby Test Network'
        })
        toast.warn(
          'Please unlock you MetaMask and Make sure your are under Rinkeby Test Network'
        )
      }
    })
  }
}
export const updatePaper = address => {
  let user
  return dispatch => {
    const account = dispatch(initialUser())
    account
      .then(acc => {
        user = acc
        if (user.value === null) {
          dispatch({
            type: INIT_USER[3],
            payload:
              'Please unlock you MetaMask and Make sure your are under Rinkeby Test Network'
          })
          toast.warn(
            'Please unlock you MetaMask and Make sure your are under Rinkeby Test Network'
          )
        }
        return dispatch(fetchAddress(address))
      })
      .then(data => {
        if (data.value.length === 0) {
          dispatch({
            type: FETCH_PAPER_ADDRESS[3],
            payload:
              'Please unlock you MetaMask and Make sure your are under Rinkeby Test Network'
          })
          toast.warn(
            'Please unlock you MetaMask and Make sure your are under Rinkeby Test Network'
          )
        } else {
          return dispatch(fetchPaper(data.value, user.value))
        }
      })
  }
}

export const getVersions = (address, versionCount, caller) => {
  if (web3.utils.isAddress(caller) !== true) {
    return { type: FETCH_VERSIONS[3], payload: 'Invalid address' }
  } else {
    const version = []
    for (let i = 0; i < versionCount; i += 1) {
      version.push(
        paperInterface(address)
          .getVersion(i)
          .call({ from: caller })
          .then(data => {
            const versionNumber = i
            const versionDescription = web3.utils.toUtf8(data[0])
            const metadata = web3.utils.toUtf8(data[1])
            const isPublished = data[2]
            const voterCount = data[3]
            const versionAddress = data[4]
            const md5 = data[5]
            const isSigned = data[6]
            return {
              versionNumber,
              versionDescription,
              metadata,
              isPublished,
              voterCount,
              versionAddress,
              md5,
              isSigned
            }
          })
      )
    }
    return {
      type: FETCH_VERSIONS[0],
      payload: Promise.all(version)
    }
  }
}
export const createVersion = (address, version, creator) => ({
  type: CREATE_VERSION[0],
  payload: paperInterface(address)
    .createNewVersion(
      toHex(version.description),
      toHex(version.metadata),
      version.md5
    )
    .send({ gas: '2100000', from: creator })
    .catch(e => e.message)
})
export const approveVersion = (versionNumber, md5, address, user) => ({
  type: APPROVE_VERSION[0],
  payload: paperInterface(address)
    .approveVersion(versionNumber, md5)
    .send({ gas: '2100000', from: user })
    .then(() => {
      navigate('/dashboard')
    })
    .catch(e => e.message)
})
export const addAuthor = (address, newAuthor, user) => ({
  type: ADD_AUTHOR[0],
  payload: paperInterface(address)
    .addNewAuthor(newAuthor)
    .send({ gas: '2100000', from: user })
    .then(() => {
      navigate('/dashboard')
    })
    .catch(e => e.message)
})
export const approveAuthor = (address, newAuthor, user) => ({
  type: APPROVE_AUTHOR[0],
  payload: paperInterface(address)
    .approveNew(newAuthor)
    .send({ gas: '210000', from: user })
    .then(() => navigate('/dashboard'))
    .catch(e => e.message)
})
