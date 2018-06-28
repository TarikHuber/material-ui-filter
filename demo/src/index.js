import { render } from 'react-dom'
import React from 'react'
import App from './App.js'
import { Provider } from 'react-redux'
import reducers from './reducers'
import moment from 'moment'
import { createLogger } from 'redux-logger'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { createStore, compose, applyMiddleware } from 'redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { IntlProvider } from 'react-intl'

const logger = createLogger({})
const muiTheme = createMuiTheme();
const store = createStore(reducers, {}, compose(applyMiddleware(logger)))

render(
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={MomentUtils} >
      <MuiThemeProvider theme={muiTheme}>
        <IntlProvider locale={'en'} key={'en'} messages={{}}>
          <App />
        </IntlProvider>
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  </Provider>
  , document.querySelector('#demo'))
