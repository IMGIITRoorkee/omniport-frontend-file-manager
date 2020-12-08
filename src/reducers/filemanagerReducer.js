import {
  CREATE_FILEMANAGER_PENDING,
  FILEMANAGER_API_ERROR,
  IS_FILEMANAGER_PUBLIC
} from '../actions/filemanagerActionTypes'

const initialPendingState = {
  createFilemanagerPending: false
}

const initialState = {
  ...initialPendingState,
  isFilemanagerPublic:false
}

const filemanagerReducer = (state = initialState, action) => {
  const { type, payload, error } = action
  switch (type) {
    case CREATE_FILEMANAGER_PENDING:
      return { ...state, createFilemanagerPending: payload }
    case FILEMANAGER_API_ERROR:
      return { ...state, error: error }
    case IS_FILEMANAGER_PUBLIC:
      return { ...state, isFilemanagerPublic: payload }
    default:
      return state
  }
}

export default filemanagerReducer
