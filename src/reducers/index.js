import { combineReducers } from 'redux'
import fileReducer from './fileReducer'
import testReducer from './test'

const rootReducers = combineReducers({
  files:fileReducer,
  test: testReducer
})

export default rootReducers
