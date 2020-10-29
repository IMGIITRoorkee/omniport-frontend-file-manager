import apiClient from '../helpers/apiClient'
import { urlFile, urlFolderFiles, urlUploadFile } from '../urls'
import { getFolder } from './folderActions'
import {
  GET_ALL_FILES,
  GET_FOLDER_FILES,
  FILE_API_ERROR,
  UPLOAD_FILE,
  GET_FILE_DETAILS,
  GET_FOLDER_FILES_PENDING,
  GET_ALL_FILES_PENDING,
  UPLOAD_FILE_PENDING,
  GET_FILE_DETAILS_PENDING,
  DELETE_FILE_PENDING,
  UPDATE_FILE_PENDING
} from './fileActionType'

const apiDispatch = (actionType = '', data) => {
  return {
    type: actionType,
    payload: data
  }
}

const apiError = error => {
  return {
    type: FILE_API_ERROR,
    error
  }
}

export const getFolderFiles = (id, params) => {
  const url = urlFolderFiles(id)
  return dispatch => {
    dispatch(apiDispatch(GET_FOLDER_FILES_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_FOLDER_FILES_PENDING, false))
        dispatch(apiDispatch(GET_FOLDER_FILES, res.data))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const getFileDetails = id => {
  const url = urlFile(id)
  return dispatch => {
    dispatch(apiDispatch(GET_FILE_DETAILS_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_FILE_DETAILS_PENDING, false))
        dispatch(apiDispatch(GET_FILE_DETAILS, res.data))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const editFileName = (id, data, callback) => {
  const url = urlFile(id)
  return dispatch => {
    dispatch(apiDispatch(UPDATE_FILE_PENDING, true))
    apiClient
      .patch(url, data)
      .then(res => {
        dispatch(apiDispatch(UPDATE_FILE_PENDING, false))
        callback()
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const deleteFile = id => {
  const url = urlFile(id)
  return (dispatch, getState) => {
    const parentFolder = getState().folders.selectedFolder
    dispatch(apiDispatch(DELETE_FILE_PENDING, true))
    apiClient
      .delete(url)
      .then(() => {
        dispatch(apiDispatch(DELETE_FILE_PENDING, false))
        dispatch(getFolder(parentFolder.id))
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const uploadFile = (data, callback) => {
  const url = urlUploadFile()
  return dispatch => {
    dispatch(apiDispatch(UPLOAD_FILE_PENDING, true))
    apiClient
      .post(url, data)
      .then(res => {
        dispatch(apiDispatch(DELETE_FILE_PENDING, false))
        dispatch(apiDispatch(UPLOAD_FILE, res.data))
        callback()
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}
