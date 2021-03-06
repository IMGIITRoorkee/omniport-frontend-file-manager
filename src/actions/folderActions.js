import { toast } from 'react-semantic-toasts'

import apiClient from '../helpers/apiClient'
import { FOLDER_APIS } from '../urls'
import { IS_FILEMANAGER_PUBLIC } from './filemanagerActionTypes'
import {
  DELETE_FOLDER_PENDING,
  GET_ALL_FOLDERS,
  GET_ALL_ROOT_FOLDERS,
  GET_FOLDER,
  GET_FOLDERS_PENDING,
  GET_FOLDER_PENDING,
  FOLDER_API_ERROR,
  CREATE_FOLDER,
  CREATE_FOLDER_PENDING,
  SET_ACTIVE_FOLDER,
  DATA_REQUEST_PENDING,
  UPDATE_FOLDER_PENDING,
  GET_ALL_DATA_REQUESTS,
  GET_PARENT_FOLDERS,
  GET_PARENT_FOLDERS_PENDING
} from './folderActionType'
import { VIEWING_SHARED_ITEMS, VIEWING_STARRED_ITEMS } from './itemActionType'

const apiDispatch = (actionType = '', data) => {
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
        dispatch(apiDispatch(VIEWING_SHARED_ITEMS, false))
        dispatch(apiDispatch(VIEWING_STARRED_ITEMS, false))
        dispatch(apiError({}))
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(GET_FOLDERS_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in fetching the folders '
        })
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
        dispatch(apiDispatch(VIEWING_SHARED_ITEMS, false))
        dispatch(apiDispatch(VIEWING_STARRED_ITEMS, false))
        dispatch(apiError({}))
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(GET_FOLDERS_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in fetching root folders '
        })
      })
  }
}

export const getFolder = (id, params) => {
  const url = `${FOLDER_APIS.folderItem}/${id}/`
  return dispatch => {
    dispatch(apiDispatch(GET_FOLDER_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_FOLDER_PENDING, false))
        dispatch(apiDispatch(GET_FOLDER, res.data))
        dispatch(apiDispatch(VIEWING_SHARED_ITEMS, false))
        dispatch(apiDispatch(VIEWING_STARRED_ITEMS, false))
        dispatch(
          apiDispatch(IS_FILEMANAGER_PUBLIC, res.data.isFilemanagerPublic)
        )
        dispatch(apiError({}))
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(GET_FOLDER_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in fetching requested folder '
        })
      })
  }
}

export const setCurrentFolder = data => {
  return dispatch => {
    dispatch(apiDispatch(GET_FOLDER, data))
  }
}

export const createFolder = data => {
  const url = `${FOLDER_APIS.folderItem}/`
  return (dispatch, getState) => {
    const parentFolder = getState().folders.selectedFolder
    dispatch(apiDispatch(CREATE_FOLDER_PENDING, true))
    apiClient
      .post(url, data)
      .then(res => {
        dispatch(apiDispatch(CREATE_FOLDER_PENDING, false))
        dispatch(apiDispatch(CREATE_FOLDER, res.data))
        dispatch(getFolder(parentFolder.id))
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(CREATE_FOLDER_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in creating folder'
        })
      })
  }
}
export const editFolder = (
  id,
  data,
  callback = () => {
    return
  }
) => {
  const url = `${FOLDER_APIS.folderItem}/${id}/`
  return dispatch => {
    dispatch(apiDispatch(UPDATE_FOLDER_PENDING, true))
    apiClient
      .patch(url, data)
      .then(res => {
        dispatch(apiDispatch(UPDATE_FOLDER_PENDING, false))
        // data.parent ? dispatch(getFolder(data.parent)) : ''
        callback(res.data)
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(UPDATE_FOLDER_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in updating folder'
        })
      })
  }
}

export const editFolderUsers = (id, data, callback) => {
  const url = `${FOLDER_APIS.folderItem}/${id}/update_shared_users/`
  return dispatch => {
    dispatch(apiDispatch(UPDATE_FOLDER_PENDING, true))
    apiClient
      .patch(url, data)
      .then(res => {
        dispatch(apiDispatch(UPDATE_FOLDER_PENDING, false))
        callback(res.data)
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(UPDATE_FOLDER_PENDING, false))
        toast({
          type: 'error',
          description:
            'error occured in updating shared users of the selected folder'
        })
      })
  }
}

export const deleteFolder = (id, callback = () => {}) => {
  const url = `${FOLDER_APIS.folderItem}/${id}`
  return (dispatch, getState) => {
    const parentFolder = getState().folders.selectedFolder
    dispatch(apiDispatch(DELETE_FOLDER_PENDING, true))
    apiClient
      .delete(url)
      .then(() => {
        dispatch(apiDispatch(DELETE_FOLDER_PENDING, false))
        const oldCurrentFolder = Object.assign({}, parentFolder)
        const oldFolders = oldCurrentFolder.folders
        const newFolders = oldFolders.filter(folder => id !== folder.id)
        oldCurrentFolder.folders = newFolders
        dispatch(setCurrentFolder(oldCurrentFolder))

        callback(id)
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(DELETE_FOLDER_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in deleting folder'
        })
      })
  }
}

export const bulkDeleteFolders = (data, callback = () => {}) => {
  const url = `${FOLDER_APIS.folderItem}/${FOLDER_APIS.bulkDelete}`
  return (dispatch, getState) => {
    const parentFolder = getState().folders.selectedFolder
    dispatch(apiDispatch(DELETE_FOLDER_PENDING, true))
    apiClient
      .post(url, data)
      .then(() => {
        dispatch(apiDispatch(DELETE_FOLDER_PENDING, false))
        callback(data)

        const oldCurrentFolder = Object.assign({}, parentFolder)
        const oldFolders = oldCurrentFolder.folders
        const newFolders = oldFolders.filter(
          folder => !data.folder_id_arr.includes(folder.id)
        )
        oldCurrentFolder.folders = newFolders
        dispatch(setCurrentFolder(oldCurrentFolder))
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(DELETE_FOLDER_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in deleting selected folders'
        })
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
        dispatch(apiDispatch(VIEWING_SHARED_ITEMS, false))
        dispatch(apiDispatch(VIEWING_STARRED_ITEMS, false))
        dispatch(
          apiDispatch(IS_FILEMANAGER_PUBLIC, res.data.isFilemanagerPublic)
        )
        dispatch(apiError({}))
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(GET_FOLDER_PENDING, false))
        let message =
          'Error in finding filemanager. Please check details once again'
        if (error.response.data) {
          message = error.response.data
        }
        toast({
          type: 'error',
          description: message
        })
        return error
      })
  }
}

export const setActiveFolder = folder => {
  return dispatch => {
    dispatch(apiDispatch(SET_ACTIVE_FOLDER, folder))
  }
}

export const generateDataRequest = (id, data, callback) => {
  const url = `${FOLDER_APIS.folderItem}/${id}/${FOLDER_APIS.generateDataRequest}`
  return dispatch => {
    dispatch(apiDispatch(DATA_REQUEST_PENDING, true))
    apiClient
      .post(url, data)
      .then(res => {
        dispatch(apiDispatch(DATA_REQUEST_PENDING, false))
        callback()
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(DATA_REQUEST_PENDING, false))
        toast({
          type: 'error',
          description: 'error in requesting data'
        })
      })
  }
}

export const getAllDataRequests = (url = FOLDER_APIS.getAllDataRequests) => {
  return dispatch => {
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_ALL_DATA_REQUESTS, res.data))
      })
      .catch(error => {
        dispatch(apiError(error))
        toast({
          type: 'error',
          description: 'error in fetching data requests'
        })
      })
  }
}

export const handleRequest = (id, data, callback) => {
  const url = `${FOLDER_APIS.folderItem}/${id}/${FOLDER_APIS.handleRequest}`
  return dispatch => {
    apiClient
      .post(url, data)
      .then(() => {
        callback()
      })
      .catch(error => {
        dispatch(apiError(error))
      })
  }
}

export const getParentFolders = (id, callback = () => {}) => {
  const url = `${FOLDER_APIS.folderItem}/${id}/${FOLDER_APIS.parents}`
  return dispatch => {
    dispatch(apiDispatch(GET_PARENT_FOLDERS_PENDING, true))
    apiClient
      .get(url)
      .then(res => {
        dispatch(apiDispatch(GET_PARENT_FOLDERS, res.data))
        dispatch(apiDispatch(GET_PARENT_FOLDERS_PENDING, false))
      })
      .catch(err => {
        dispatch(apiError(err))
        dispatch(apiDispatch(GET_PARENT_FOLDERS_PENDING, false))
        toast({
          type: 'error',
          description: 'error in fetching parent folders'
        })
      })
  }
}
export const setParentFolders = (data, callback = () => {}) => {
  return dispatch => {
    dispatch(apiDispatch(GET_PARENT_FOLDERS, data))
  }
}
