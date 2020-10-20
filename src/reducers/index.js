import { combineReducers } from 'redux'
import fileReducer from './fileReducer'
import folderReducer from './folderReducer'
const rootReducers = combineReducers({
  files:fileReducer,
  folders: folderReducer
})

export default rootReducers
