import { SET_ACTIVE_ITEM, SET_ACTIVE_ITEMS, TABULATION } from './itemActionType'

const apiDispatch = (actionType = '', data) => {
  return {
    type: actionType,
    payload: data
  }
}

export const setActiveItems = items => {
  return dispatch => {
    dispatch(apiDispatch(SET_ACTIVE_ITEMS, items))
  }
}
export const setActiveItem = item => {
  return dispatch => {
    dispatch(apiDispatch(SET_ACTIVE_ITEM, item))
  }
}
export const tabulation = data => {
  return dispatch => {
    dispatch({
      type: TABULATION,
      payload: data
    })
  }
}
