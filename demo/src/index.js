import {render} from 'react-dom'
import React  from 'react';
import App from './App.js'
import { Provider } from 'react-redux';
import reducers from './reducers';
import { createLogger } from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createStore, compose, applyMiddleware } from 'redux';

const logger=createLogger({});

const store = createStore(reducers, {}, compose(applyMiddleware(logger)));

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App/>
    </MuiThemeProvider>
  </Provider>
  , document.querySelector('#demo'))
