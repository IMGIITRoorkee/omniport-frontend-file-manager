import {
  DELETE_FOLDER_PENDING,
  GET_ALL_FOLDERS,
  GET_FOLDER,
  GET_FOLDERS_PENDING,
  GET_FOLDER_PENDING,
  UPDATE_FOLDER_PENDING,
  CREATE_FOLDER_PENDING,
  DELETE_FOLDER_PENDING,
} from '../actions/folderActionType'

const initialPendingState = {
  createFolderPending: false,
  deleteFolderPending: false,
  getFolderPending: false,
  getFoldersPending: false,
  updateFolderPending: false,
}

const initialState = {
  ...initialPendingState,
  selectedFolder: null,
  addedFolder: null,
  folders: [],
}

export default function folderReducer(
  state = initialState,
  { type, payload, error }
) {
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
    case FOLDER_API_ERROR:
      return { ...state, error: error }
    default:
      return state
  }
}
