import {
  FETCH_FILE_FAILURE,
  FETCH_FILE_REQUEST,
  FETCH_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  LAST_VISITED,
  TABULATION,
  SET_SELECTED
} from '../constants/index'

const initialState = {
  isFetching: false,
  error: '',
  isuploading: false,
  currentFolder: '',
  currentData: '',
  isSelected: false,
  selectedData: '',
  progressArray: [],
  topLevel: '',
  lastVisited: '',
  isLoading: false,
  tabular: false
}

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FILE_REQUEST:
      return {
        ...state,
        isfetching: true
      }
    case FETCH_FILE_SUCCESS:
      state.topLevel = action.payload.folder
      state.currentData = action.payload.data
      state.currentFolder = action.payload.folder
      let check = state.progressArray.indexOf(action.payload.folder)
      check === -1
        ? state.progressArray.push(action.payload.folder)
        : state.progressArray.slice(0, check)
      return {
        ...state,
        isfetching: false
      }
    case FETCH_FILE_FAILURE:
      return {
        ...state,
        isfetching: false,
        error: action.payload.error
      }
    case UPLOAD_FILE_REQUEST:
      return {
        ...state,
        isuploading: true
      }
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        isuploading: false
      }
    case UPLOAD_FILE_FAILURE:
      return {
        ...state,
        error: action.payload.error
      }
    case SET_SELECTED:
      return {
        ...state,
        isSelected: true,
        selectedData: {
          pk: action.payload.pk,
          fileName: action.payload.fileName,
          link: action.payload.link
        }
      }
    case LAST_VISITED:
      return {
        ...state,
        lastVisited: action.payload
      }
    case TABULATION:
      return {
        ...state,
        tabular: action.payload
      }
    default:
      return state
  }
}

export default fileReducer
