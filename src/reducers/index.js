import { combineReducers } from 'redux'
import fileReducer from './fileReducer'

const rootReducers = combineReducers({
  files:fileReducer
})

export default rootReducers
