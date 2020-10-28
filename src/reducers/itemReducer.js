import { SET_ACTIVE_ITEM, SET_ACTIVE_ITEMS } from '../actions/itemActionType'

const initialState = {
  activeItem: {},
  activeItems: [],
}
const itemReducer = (state = initialState, action) => {
  const { type, payload, error } = action
  switch (type) {
    case SET_ACTIVE_ITEMS:
      return { ...state, activeItems: payload }
    case SET_ACTIVE_ITEM:
      return { ...state, activeItem: payload }
    default:
      return state
  }
}

export default itemReducer
