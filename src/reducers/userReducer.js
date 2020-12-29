import {
  SET_IS_ADMIN,
  SET_IS_ADMIN_PENDING,
  USER_API_ERROR
} from '../actions/userActionTypes'

const initialPendingState = {
  isAdminPending: false
}

const initialState = {
  ...initialPendingState,
  isAdmin: false,
  error: {}
}

const userReducer = (state = initialState, action) => {
  const { type, payload, error } = action
  switch (type) {
    case SET_IS_ADMIN:
      return { ...state, isAdmin: payload }
    case SET_IS_ADMIN_PENDING:
      return { ...state, isAdminPending: payload }
    case USER_API_ERROR:
      return { ...state, error: error }
    default:
      return state
  }
}

export default userReducer
