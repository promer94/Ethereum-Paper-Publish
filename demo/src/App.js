import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Header from './Layout/Header'

const theme = createMuiTheme({
	overrides: {
		// Name of the component ⚛️ / style sheet
		MuiButton: {
			// Name of the rule
			root: {
				// Some CSS
				background: 'linear-gradient(45deg, #BBDEFB 50%, #002984 70%)',
				borderRadius: 3,
				border: 0,
				color: 'white',
				height: 48,
				padding: '0 30px',
				boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
			}
		}
	}
})

class App extends Component {
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Header />
			</MuiThemeProvider>
		)
	}
}

export default App
