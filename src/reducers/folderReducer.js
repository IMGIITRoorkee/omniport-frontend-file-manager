import {
  DELETE_FOLDER_PENDING,
  GET_ALL_FOLDERS,
  GET_ALL_ROOT_FOLDERS,
  GET_FOLDER,
  GET_FOLDERS_PENDING,
  GET_FOLDER_PENDING,
  CREATE_FOLDER,
  FOLDER_API_ERROR,
  UPDATE_FOLDER_PENDING,
  CREATE_FOLDER_PENDING
} from '../actions/folderActionType'

const initialPendingState = {
  createFolderPending: false,
  deleteFolderPending: false,
  getFolderPending: false,
  getFoldersPending: false,
  updateFolderPending: false
}

const initialState = {
  ...initialPendingState,
  selectedFolder: {},
  addedFolder: {},
  Folders: []
}
const folderReducer = (state = initialState, action) => {
  const { type, payload, error } = action
  switch (type) {
    case GET_FOLDER_PENDING:
      return { ...state, getFolderPending: payload }
    case GET_FOLDERS_PENDING:
      return { ...state, getFoldersPending: payload }
    case CREATE_FOLDER_PENDING:
      return { ...state, createFolderPending: payload }
    case UPDATE_FOLDER_PENDING:
      return { ...state, updateFolderPending: payload }
    case DELETE_FOLDER_PENDING:
      return { ...state, deleteFolderPending: payload }
    case CREATE_FOLDER:
      return { ...state, addedFolder: payload }
    case GET_FOLDER:
      return { ...state, selectedFolder: payload }
    case GET_ALL_FOLDERS:
      return { ...state, Folders: payload }
    case GET_ALL_ROOT_FOLDERS:
      return { ...state, Folders: payload }
    case FOLDER_API_ERROR:
      return { ...state, error: error }
    default:
      return state
  }
}
export default folderReducer
