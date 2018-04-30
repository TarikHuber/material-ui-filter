import { render } from 'react-dom'
import React from 'react'
import App from './App.js'
import { Provider } from 'react-redux'
import reducers from './reducers'
import moment from 'moment';
import { createLogger } from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { createStore, compose, applyMiddleware } from 'redux'
import { createMuiTheme } from 'material-ui/styles'

const logger = createLogger({})
const muiTheme = createMuiTheme();
const store = createStore(reducers, {}, compose(applyMiddleware(logger)))

render(
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={MomentUtils} >
      <MuiThemeProvider theme={muiTheme}>
        <App />
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  </Provider>
  , document.querySelector('#demo'))
