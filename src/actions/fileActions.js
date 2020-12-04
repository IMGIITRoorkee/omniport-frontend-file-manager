import { toast } from 'react-semantic-toasts'

import apiClient from '../helpers/apiClient'
import { FILE_APIS, FOLDER_APIS } from '../urls'
import { getFolder } from './folderActions'
import {
  GET_ALL_FILES,
  FILE_API_ERROR,
  UPLOAD_FILE,
  GET_FILE_DETAILS,
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

export const getALLFiles = (id, params) => {
  const url = `${FOLDER_APIS.folderItem}/${id}/files/`
  return dispatch => {
    dispatch(apiDispatch(GET_ALL_FILES_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_ALL_FILES_PENDING, false))
        dispatch(apiDispatch(GET_ALL_FILES, res.data))
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(GET_ALL_FILES_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in fetching the files'
        })
      })
  }
}

export const getFileDetails = id => {
  const url = `${FILE_APIS.fileItem}/${id}/`
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
        dispatch(apiDispatch(GET_FILE_DETAILS_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in fetching the requested file '
        })
      })
  }
}

export const editFile = (
  id,
  data,
  callback = () => {
    return
  }
) => {
  const url = `${FILE_APIS.fileItem}/${id}/`
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
        dispatch(apiDispatch(UPDATE_FILE_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in updating the requested file '
        })
      })
  }
}

export const editFileUsers = (id, data, callback) => {
  const url = `${FILE_APIS.fileItem}/${id}/update_shared_users/`
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
        dispatch(apiDispatch(UPDATE_FILE_PENDING, false))
        toast({
          type: 'error',
          description:
            'error occured in updating the shared users for requested file '
        })
      })
  }
}

export const deleteFile = id => {
  const url = `${FILE_APIS.fileItem}/${id}/`
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
        dispatch(apiDispatch(DELETE_FILE_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in deleting the request file '
        })
      })
  }
}

export const bulkDeleteFiles = obj => {
  const url = `${FILE_APIS.fileItem}/${FILE_APIS.bulkDelete}`
  return (dispatch, getState) => {
    const parentFolder = getState().folders.selectedFolder
    dispatch(apiDispatch(DELETE_FILE_PENDING, true))
    apiClient
      .post(url, obj)
      .then(() => {
        dispatch(apiDispatch(DELETE_FILE_PENDING, false))
        dispatch(getFolder(parentFolder.id))
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(DELETE_FILE_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in deleting the selected files '
        })
      })
  }
}

export const uploadFile = (data, callback) => {
  const url = `${FILE_APIS.fileItem}/bulk_create/`
  return dispatch => {
    dispatch(apiDispatch(UPLOAD_FILE_PENDING, true))
    apiClient
      .post(url, data)
      .then(res => {
        dispatch(apiDispatch(UPLOAD_FILE_PENDING, false))
        dispatch(apiDispatch(UPLOAD_FILE, res.data))
        callback()
      })
      .catch(error => {
        dispatch(apiDispatch(UPLOAD_FILE_PENDING, false))
        dispatch(apiError(error))
        toast({
          type: 'error',
          description: error.response.data
        })
      })
  }
}
