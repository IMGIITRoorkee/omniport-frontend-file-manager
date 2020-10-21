import apiClient from '../helpers/apiClient'
import { FOLDER_APIS } from '../urls'
import {
  DELETE_FOLDER_PENDING,
  GET_ALL_FOLDERS,
  GET_ALL_ROOT_FOLDERS,
  GET_FOLDER,
  GET_FOLDERS_PENDING,
  GET_FOLDER_PENDING,
  FOLDER_API_ERROR
} from './folderActionType'

const apiDispatch = (actionType = '', data) => {
  console.log(data)
  return {
    type: actionType,
    payload: data
  }
}

const apiError = error => {
  return {
    type: FOLDER_API_ERROR,
    error
  }
}

export const getAllFoldersRequest = (pk, data) => {
  const url = FOLDER_APIS.folderItem
  return dispatch => {
    dispatch(apiDispatch(GET_FOLDERS_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_ALL_FOLDERS, res.data))
        dispatch(apiDispatch(GET_FOLDERS_PENDING, false))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const getAllRootFoldersRequest = (pk, data) => {
  const url = FOLDER_APIS.getRootFolders
  return dispatch => {
    dispatch(apiDispatch(GET_FOLDERS_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_ALL_ROOT_FOLDERS, res.data))
        dispatch(apiDispatch(GET_FOLDERS_PENDING, false))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const getFolder = (id, params) => {
  const url = FOLDER_APIS.folderItem
  return dispatch => {
    dispatch(apiDispatch(GET_FOLDER_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_FOLDER_PENDING, false))
        dispatch(apiDispatch(GET_FOLDER, res.data))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}
export const createFolder = (id, data) => {
  const url = FOLDER_APIS.folderItem
  return dispatch => {
    dispatch(apiDispatch(CREATE_FOLDER_PENDING, true))
    apiClient
      .post(url, data)
      .then(res => {
        dispatch(apiDispatch(CREATE_FOLDER_PENDING, false))
        dispatch(apiDispatch(GET_FOLDER, res.data))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}
export const editFolderName = (id, data) => {
  const url = FOLDER_APIS.folderItem
  return dispatch => {
    dispatch(apiDispatch(UPDATE_FOLDER_PENDING, true))
    apiClient
      .put(url, data)
      .then(res => {
        dispatch(apiDispatch(UPDATE_FOLDER_PENDING, false))
        dispatch(apiDispatch(GET_FOLDER, res.data))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const deleteFolder = id => {
  const url = FOLDER_APIS.folderItem
  return dispatch => {
    dispatch(apiDispatch(DELETE_FOLDER_PENDING, true))
    apiClient
      .delete(url)
      .then(() => {
        dispatch(apiDispatch(DELETE_FOLDER_PENDING, false))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const getRootFolder = filemanager => {
  const url = `${FOLDER_APIS.getRoot}?filemanager=${filemanager}`
  return dispatch => {
    dispatch(apiDispatch(GET_FOLDER_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_FOLDER_PENDING, false))
        dispatch(apiDispatch(GET_FOLDER, res.data))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}
