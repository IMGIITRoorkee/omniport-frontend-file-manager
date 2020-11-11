import { combineReducers } from 'redux'
import fileReducer from './fileReducer'
import folderReducer from './folderReducer'
import itemReducer from './itemReducer'
import filemanagerReducer from './filemanagerReducer'

const rootReducers = combineReducers({
  files: fileReducer,
  folders: folderReducer,
  items: itemReducer,
  filemanagers: filemanagerReducer
})

export default rootReducers
