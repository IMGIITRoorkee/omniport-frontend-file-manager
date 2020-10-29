import {
  GET_ALL_FILES,
  GET_FOLDER_FILES,
  FILE_API_ERROR,
  UPLOAD_FILE,
  GET_FILE_DETAILS,
  GET_FOLDER_FILES_PENDING,
  GET_ALL_FILES_PENDING,
  UPLOAD_FILE_PENDING,
  GET_FILE_DETAILS_PENDING,
  DELETE_FILE_PENDING,
  UPDATE_FILE_PENDING
} from '../actions/fileActionType'

const initialPendingState = {
  uploadFilePending: false,
  deleteFilePending: false,
  // getFilePending: false,
  // getFilesPending: false,
  updateFilePending: false
}

const initialState = {
  ...initialPendingState,
  // selectedFile: {},
  // addedFile: {},
  Files: [],
  uploadedFile: null
  // activeFile: {},
}
const fileReducer = (state = initialState, action) => {
  const { type, payload, error } = action
  switch (type) {
    case UPLOAD_FILE:
      return { ...state, uploadedFile: payload }
    case UPLOAD_FILE_PENDING:
      return { ...state, uploadFilePending: payload }
    case UPDATE_FILE_PENDING:
      return { ...state, updateFilePending: payload }
    case DELETE_FILE_PENDING:
      return { ...state, deleteFilePending: payload }
    case FILE_API_ERROR:
      return { ...state, error: error }
    default:
      return state
  }
}
export default fileReducer
