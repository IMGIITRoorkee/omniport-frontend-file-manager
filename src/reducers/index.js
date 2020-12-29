import { combineReducers } from 'redux'
import fileReducer from './fileReducer'
import folderReducer from './folderReducer'
import itemReducer from './itemReducer'
import filemanagerReducer from './filemanagerReducer'
import userReducer from './userReducer'

const rootReducers = combineReducers({
  files: fileReducer,
  folders: folderReducer,
  items: itemReducer,
  filemanagers: filemanagerReducer,
  user: userReducer
})

export default rootReducers
