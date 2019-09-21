import {
  TABULATION,
  SET_SELECTED,
  SET_GRID_VIEW_ACTIVE_INDEX,
  UNSET_SELECTED,
  TOGGLE_TARGET,
  LAST_VISITED
} from '../constants/index'

export const setSelected = data => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED,
      payload: data
    })
  }
}

export const unsetSelected = () => {
  return dispatch => {
    dispatch({
      type: UNSET_SELECTED
    })
  }
}

export const lastVisited = data => {
  return dispatch => {
    dispatch({
      type: LAST_VISITED,
      payload: data
    })
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

export const setGridViewActiveIndex = index => {
  return dispatch => {
    dispatch({
      type: SET_GRID_VIEW_ACTIVE_INDEX,
      payload: index
    })
  }
}

export const setTarget = () => {
  return dispatch => {
    dispatch({
      type: TOGGLE_TARGET
    })
  }
}
