import {
  FETCH_FILE_FAILURE,
  FETCH_FILE_REQUEST,
  FETCH_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  LAST_VISITED,
  TABULATION,
  SET_SELECTED,
  SET_GRID_VIEW_ACTIVE_INDEX,
  EDIT_FILE_FAILURE,
  EDIT_FILE_REQUEST,
  EDIT_FILE_SUCCESS,
  UNSET_SELECTED,
  TOGGLE_TARGET
} from '../constants/index'

const initialState = {
  error: '',
  currentFolder: '',
  currentData: '',
  isSelected: false,
  selectedData: '',
  progressArray: [],
  topLevel: '',
  lastVisited: '',
  tabular: false,
  gridViewActiveIndex: '',
  isTarget: false
}

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FILE_REQUEST:
      return {
        ...state,
        isLoading: true
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
        isLoading: false
      }
    case FETCH_FILE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      }
    case UPLOAD_FILE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case UPLOAD_FILE_FAILURE:
      return {
        ...state,
        error: action.payload.error
      }
    case EDIT_FILE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case EDIT_FILE_SUCCESS:
      if (state.currentData && state.currentData.files) {
        for (let i = 0; i < state.currentData.files.length; i++) {
          if (state.currentData.files[i].id === action.payload.id) {
            state.currentData.files[i].fileName = action.payload.fileName
            state.currentData.files[i].isPublic = action.payload.isPublic
            state.currentData.files[i].datetimeModified =
              action.payload.datetimeModified
            break
          }
        }
      }
      return {
        ...state,
        isLoading: false
      }
    case EDIT_FILE_FAILURE:
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
          link: action.payload.link,
          isPublic: action.payload.isPublic,
          path: action.payload.path
        }
      }
    case UNSET_SELECTED:
      return {
        ...state,
        isSelected: false,
        selectedData: '',
        gridViewActiveIndex: ''
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
    case TOGGLE_TARGET:
      return {
        ...state,
        isTarget: true
      }
    case SET_GRID_VIEW_ACTIVE_INDEX:
      return {
        ...state,
        gridViewActiveIndex: action.payload
      }
    default:
      return state
  }
}

export default fileReducer
