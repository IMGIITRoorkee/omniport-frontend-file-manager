import { SET_IS_ADMIN, USER_API_ERROR } from '../actions/userActionTypes'

const initialState = {
  isAdmin: "checking",
  error: {}
}

const userReducer = (state = initialState, action) => {
  const { type, payload, error } = action
  switch (type) {
    case SET_IS_ADMIN:
      return { ...state, isAdmin: payload }
    case USER_API_ERROR:
      return { ...state, error: error }
    default:
      return state
  }
}

export default userReducer
