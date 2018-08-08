import { combineReducers } from 'redux'
import { toast } from 'react-toastify'
import {
	FETCH_PAPER_ADDRESS,
	FETCH_PAPER,
	CREATE_PAPER,
	INIT_USER,
	FETCH_VERSIONS
} from '../action/action'

const paper = (state = {}, action) => {
	switch (action.type) {
		case FETCH_PAPER_ADDRESS[1]:
			return { ...state, isPending: true }
		case FETCH_PAPER_ADDRESS[2]:
			return {
				...state,
				isPending: false,
				paperAddresses: action.payload.reverse()
			}
		case FETCH_PAPER_ADDRESS[3]:
			toast.error('Please check your network and metamask 🤷‍')
			return { ...state, errorMessage: action.payload }
		case FETCH_PAPER[1]:
			return { ...state, isPending: true }
		case FETCH_PAPER[2]:
			return { ...state, isPending: false, paperList: action.payload }
		case FETCH_PAPER[3]:
			toast.error('Please check your network and metamask 🤷‍')
			return { ...state, isPending: false, errorMessage: action.payload }
		case CREATE_PAPER[1]:
			return { ...state, isPending: true }
		case CREATE_PAPER[2]:
			toast.success('Paper has been recorded at the Ethereum Blockchain ✨')
			return {
				...state,
				isPending: false,
				paperCreated: true,
				transaction: action.payload
			}
		case CREATE_PAPER[3]:
			return { ...state, isPending: false, errorMessage: action.payload }
		case FETCH_VERSIONS[1]:
			return { ...state, isPending: true }
		case FETCH_VERSIONS[2]:
			return { ...state, isPending: false, versions: action.payload }
		default: {
			return state
		}
	}
}
const user = (state = {}, action) => {
	switch (action.type) {
		default:
			return state
		case INIT_USER[1]:
			return { ...state, isPending: true }
		case INIT_USER[2]:
			return { ...state, isPending: false, address: action.payload }
		case INIT_USER[3]:
			return { ...state, errorMessage: action.payload }
	}
}
const combinedReducers = combineReducers({
	paper,
	user
})
export default combinedReducers
