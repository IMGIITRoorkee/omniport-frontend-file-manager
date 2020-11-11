import {
  CREATE_FILEMANAGER_PENDING,
  FILEMANAGER_API_ERROR
} from '../actions/filemanagerActionTypes'

const initialPendingState = {
  createFilemanagerPending: false
}

const initialState = {
  ...initialPendingState
}

const filemanagerReducer = (state = initialState, action) => {
  const { type, payload, error } = action
  switch (type) {
    case CREATE_FILEMANAGER_PENDING:
      return { ...state, createFilemanagerPending: payload }
    case FILEMANAGER_API_ERROR:
      return { ...state, error: error }
    default:
      return state
  }
}

export default filemanagerReducer
