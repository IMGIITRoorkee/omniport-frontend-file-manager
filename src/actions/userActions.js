import {
  SET_IS_ADMIN,
  SET_IS_ADMIN_PENDING,
  USER_API_ERROR
} from './userActionTypes'
import apiClient from '../helpers/apiClient'
import { USER_APIS } from '../urls'

const apiDispatch = (actionType = '', data) => {
  return {
    type: actionType,
    payload: data
  }
}

const apiError = error => {
  return {
    type: USER_API_ERROR,
    error
  }
}

export const getIsUserAdmin = () => {
  const url = USER_APIS.isAdmin
  return dispatch => {
    dispatch(apiDispatch(SET_IS_ADMIN_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(SET_IS_ADMIN_PENDING, false))
        dispatch(apiDispatch(SET_IS_ADMIN, res.data))
      })
      .catch(err => {
        dispatch(apiDispatch(SET_IS_ADMIN_PENDING, false))
        dispatch(apiError(err))
      })
  }
}
