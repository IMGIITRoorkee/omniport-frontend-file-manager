import {
  CREATE_FILEMANAGER_PENDING,
  FILEMANAGER_API_ERROR
} from './filemanagerActionTypes'
import { FILEMANAGER_APIS } from '../urls'
import apiClient from '../helpers/apiClient'
import { toast } from 'react-semantic-toasts'

const apiDispatch = (actionType = '', data) => {
  return {
    type: actionType,
    payload: data
  }
}

const apiError = error => {
  return {
    type: FILEMANAGER_API_ERROR,
    error
  }
}

export const createFilemanager = (data, callback) => {
  const url = `${FILEMANAGER_APIS.filemanagerItem}/`
  return dispatch => {
    dispatch(apiDispatch(CREATE_FILEMANAGER_PENDING, true))
    apiClient
      .post(url, data)
      .then(res => {
        dispatch(apiDispatch(CREATE_FILEMANAGER_PENDING, false))
        callback()
      })
      .catch(error => {
        dispatch(apiDispatch(CREATE_FILEMANAGER_PENDING, false))
        dispatch(apiError(error))
        console.log(error.response)
        toast({
          type: 'error',
          description: error.response.data
        })
        return error
      })
  }
}
