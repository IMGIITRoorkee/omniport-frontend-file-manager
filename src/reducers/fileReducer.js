import {
  FETCH_FILE_FAILURE,
  FETCH_FILE_REQUEST,
  FETCH_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
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
  isLoading: false
}

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FILE_REQUEST:
      return {
        ...state,
        isfetching: true
      }
    case FETCH_FILE_SUCCESS:
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
    default:
      return state
  }
}

export default fileReducer
