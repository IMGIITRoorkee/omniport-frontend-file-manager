import {
  SET_ACTIVE_ITEM,
  SET_ACTIVE_ITEMS,
  TABULATION,
  GET_SHARED_ITEMS_PENDING,
  ITEM_API_ERROR,
  VIEWING_SHARED_ITEMS,
  GET_STARRED_ITEMS_PENDING,
  CREATE_FILEMANAGER_PENDING,
} from '../actions/itemActionType'

const initialPendingState = {
  getallshareditems: false,
  getStarredItemsPending: false,
  createFilemanagerPending: false,
}

const initialState = {
  ...initialPendingState,
  viewingSharedItems: false,
  activeItem: {},
  activeItems: [],
  tabular: false
}

const itemReducer = (state = initialState, action) => {
  const { type, payload, error } = action
  switch (type) {
    case SET_ACTIVE_ITEMS:
      return { ...state, activeItems: payload }
    case SET_ACTIVE_ITEM:
      return { ...state, activeItem: payload }
    case TABULATION:
      return {
        ...state,
        tabular: action.payload
      }
    case CREATE_FILEMANAGER_PENDING:
      return { ...state, CREATE_FILEMANAGER_PENDING: payload}
    case GET_SHARED_ITEMS_PENDING:
      return { ...state, getallshareditems: payload }
    case VIEWING_SHARED_ITEMS:
      return { ...state, viewingSharedItems: payload }
    case GET_STARRED_ITEMS_PENDING:
      return { ...state, getStarredItemsPending: payload}
    case ITEM_API_ERROR:
      return { ...state, error: error }
    default:
      return state
  }
}

export default itemReducer
