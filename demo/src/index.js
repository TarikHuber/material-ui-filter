import App from './App.js'
import Utils from '@date-io/moment'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React from 'react'
import moment from 'moment'
import reducers from './reducers'
import { IntlProvider } from 'react-intl'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import { createMuiTheme } from '@material-ui/core/styles'
import { createStore, compose, applyMiddleware } from 'redux'
import { render } from 'react-dom'

const logger = createLogger({})
const muiTheme = createMuiTheme({typography: {
  useNextVariants: true,
}})
const store = createStore(reducers, {}, compose(applyMiddleware(logger)))

render(
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={Utils}>
      <MuiThemeProvider theme={muiTheme}>
        <IntlProvider locale={'en'} key={'en'} messages={{}}>
          <App />
        </IntlProvider>
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  </Provider>,
  document.querySelector('#demo')
)
