import { combineReducers } from 'redux'
import fileReducer from './fileReducer'
import folderReducer from './folderReducer'
import itemReducer from './itemReducer'
const rootReducers = combineReducers({
  files: fileReducer,
  folders: folderReducer,
  items: itemReducer
})

export default rootReducers
