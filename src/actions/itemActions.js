import {
  SET_ACTIVE_ITEM,
  SET_ACTIVE_ITEMS,
  TABULATION,
  GET_SHARED_ITEMS_PENDING,
  ITEM_API_ERROR,
  VIEWING_SHARED_ITEMS,
  GET_STARRED_ITEMS_PENDING,
  VIEWING_STARRED_ITEMS,
  SET_SHOW_PUBLIC_SHARED_ITEMS
} from './itemActionType'
import { GET_FOLDER } from './folderActionType'
import { SHARED_ITEMS_APIS, FOLDER_APIS } from '../urls'
import apiClient from '../helpers/apiClient'

const apiDispatch = (actionType = '', data) => {
  return {
    type: actionType,
    payload: data
  }
}

const apiError = error => {
  return {
    type: ITEM_API_ERROR,
    error
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
export const setShowPublicSharedItems = data => {
  return dispatch => {
    dispatch(apiDispatch(SET_SHOW_PUBLIC_SHARED_ITEMS, data))
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

export const getSharedItems = filemanager => {
  const url = `${SHARED_ITEMS_APIS.sharedWithMe}?filemanager=${filemanager}`
  return dispatch => {
    dispatch(apiDispatch(GET_SHARED_ITEMS_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_FOLDER, res.data))
        dispatch(apiDispatch(GET_SHARED_ITEMS_PENDING, false))
        dispatch(apiDispatch(VIEWING_SHARED_ITEMS, true))
        dispatch(apiDispatch(VIEWING_STARRED_ITEMS, false))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const getSharedItem = (uuid, id, type_shared, type_access) => {
  const url = `${SHARED_ITEMS_APIS.sharedItem}/${uuid}/${type_shared}/${id}/${type_access}/`
  return dispatch => {
    dispatch(apiDispatch(GET_SHARED_ITEMS_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_FOLDER, res.data))
        dispatch(apiDispatch(GET_SHARED_ITEMS_PENDING, false))
        dispatch(apiDispatch(VIEWING_SHARED_ITEMS, true))
        dispatch(apiDispatch(VIEWING_STARRED_ITEMS, false))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const getStarredItems = filemanager => {
  const url = `${FOLDER_APIS.starred_items}?filemanager=${filemanager}`
  return dispatch => {
    dispatch(apiDispatch(GET_STARRED_ITEMS_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_FOLDER, res.data))
        dispatch(apiDispatch(GET_STARRED_ITEMS_PENDING, false))
        dispatch(apiDispatch(VIEWING_SHARED_ITEMS, false))
        dispatch(apiDispatch(VIEWING_STARRED_ITEMS, true))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}
