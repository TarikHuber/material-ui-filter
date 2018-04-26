import { render } from 'react-dom'
import React from 'react'
import App from './App.js'
import { Provider } from 'react-redux'
import reducers from './reducers'
import { createLogger } from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { createStore, compose, applyMiddleware } from 'redux'

const logger = createLogger({})

const store = createStore(reducers, {}, compose(applyMiddleware(logger)))

render(
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  </Provider>
  , document.querySelector('#demo'))
