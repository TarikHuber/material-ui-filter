import { combineReducers } from 'redux';
import { filterReducer } from '../../src';

const reducers = combineReducers({
  filters: filterReducer
})

export default reducers;
