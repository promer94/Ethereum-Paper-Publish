import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import configureStore from './configStore'

const initalState = {
	paper: { paperAddresses: [], isPending: false, paperList: [] },
	user: { address: [] }
}
var store = configureStore(initalState) //eslint-disable-line
window.store = store
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
