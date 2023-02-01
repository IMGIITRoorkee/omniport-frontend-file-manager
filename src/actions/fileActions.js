import { toast } from 'react-semantic-toasts'

import apiClient from '../helpers/apiClient'
import { FILE_APIS, FOLDER_APIS } from '../urls'
import { setCurrentFolder } from './folderActions'
import {
  GET_ALL_FILES,
  FILE_API_ERROR,
  GET_FILE_DETAILS,
  GET_ALL_FILES_PENDING,
  UPLOAD_FILE_PENDING,
  GET_FILE_DETAILS_PENDING,
  DELETE_FILE_PENDING,
  UPDATE_FILE_PENDING,
  UPLOADING_FILE_DATA,
  FILE_TO_COPY
} from './fileActionType'
import { fileUploadingStatus, ITEM_TYPE, ACTION_TYPE } from '../constants'

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
        callback(res.data)
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
        callback(res.data)
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

export const deleteFile = (id, callback = () => {}) => {
  const url = `${FILE_APIS.fileItem}/${id}/`
  return (dispatch, getState) => {
    const parentFolder = getState().folders.selectedFolder
    dispatch(apiDispatch(DELETE_FILE_PENDING, true))
    apiClient
      .delete(url)
      .then(() => {
        dispatch(apiDispatch(DELETE_FILE_PENDING, false))
        const oldCurrentFolder = Object.assign({}, parentFolder)
        const oldfiles = oldCurrentFolder.files
        const newfiles = oldfiles.filter(file => id !== file.id)
        oldCurrentFolder.files = newfiles
        dispatch(setCurrentFolder(oldCurrentFolder))
        callback(id)
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

export const bulkDeleteFiles = (obj, callback = () => {}) => {
  const url = `${FILE_APIS.fileItem}/${FILE_APIS.bulkDelete}`
  return (dispatch, getState) => {
    const parentFolder = getState().folders.selectedFolder
    dispatch(apiDispatch(DELETE_FILE_PENDING, true))
    apiClient
      .post(url, obj)
      .then(() => {
        dispatch(apiDispatch(DELETE_FILE_PENDING, false))
        const oldCurrentFolder = Object.assign({}, parentFolder)
        const oldfiles = oldCurrentFolder.files
        const newfiles = oldfiles.filter(
          file => !obj.fileIdArr.includes(file.id)
        )
        oldCurrentFolder.files = newfiles
        dispatch(setCurrentFolder(oldCurrentFolder))
        callback(obj)
      })
      .catch(error => {
        dispatch(apiError(error))
        dispatch(apiDispatch(DELETE_FILE_PENDING, false))
        toast({
          type: 'error',
          description: 'error occured in deleting the selected files '
        })
        return error
      })
  }
}

// code to dynamically send file create request and track progress

/**
 * updateProgress: it updates progress of each file being uploading
 */
const updateProgress = (fileId, dispatch, getState) => progressEvent => {
  const filesUploading = getState().files.uploadingFileData
  const newData = Object.assign({}, filesUploading)
  const newProgressObject = Object.assign({}, newData[fileId])
  let num = (progressEvent.loaded * 100) / progressEvent.total
  let newProgress = Math.round(num * 100) / 100
  newProgressObject.progress = newProgress
  newData[fileId] = newProgressObject
  dispatch(apiDispatch(UPLOADING_FILE_DATA, newData))
}

/**
 * afterRequest: handles after request is completed or error is occured
 */
const afterRequest = ({
  getState,
  status,
  dispatch,
  callback,
  postFileDynamically,
  nextFile,
  files
}) => {
  const filesUploading = getState().files.uploadingFileData
  const newData = Object.assign({}, filesUploading)
  newData[nextFile].status = status
  dispatch(apiDispatch(UPLOADING_FILE_DATA, newData))
  if (
    Object.values(newData).reduce(
      (a, b) =>
        a &&
        (b.status === fileUploadingStatus.FINISHED ||
          b.status === fileUploadingStatus.ERROR_OCCURED),
      true
    )
  ) {
    dispatch(apiDispatch(UPLOAD_FILE_PENDING, false))
    dispatch(apiDispatch(UPLOADING_FILE_DATA, {}))
    callback()
  }
  postFileDynamically(dispatch, getState, files, callback)
}

/**
 *
 * postFileDynamically: make create request of files which previously has not been made recursively
 */
const postFileDynamically = (dispatch, getState, files, callback) => {
  const url = `${FILE_APIS.fileItem}/`

  const filesUploading = getState().files.uploadingFileData
  const nextFile = Object.keys(filesUploading).find(
    elem => filesUploading[elem].status === fileUploadingStatus.NOT_STARTED
  )

  if (nextFile !== undefined) {
    let config = {
      onUploadProgress: updateProgress(nextFile, dispatch, getState)
    }
    let filesUploading = getState().files.uploadingFileData
    let newData = Object.assign({}, filesUploading)
    newData[nextFile].status = fileUploadingStatus.STARTED
    dispatch(apiDispatch(UPLOADING_FILE_DATA, newData))
    const fileToUpload = files.findIndex(
      file => file.get('unique_id') === nextFile
    )
    apiClient
      .post(url, files[fileToUpload], config)
      .then(() => {
        afterRequest({
          getState,
          status: fileUploadingStatus.FINISHED,
          dispatch,
          callback,
          postFileDynamically,
          nextFile,
          files
        })
      })
      .catch(() => {
        afterRequest({
          getState,
          status: fileUploadingStatus.ERROR_OCCURED,
          dispatch,
          callback,
          postFileDynamically,
          nextFile,
          files
        })
      })
  }
}

/**
 * uploadFiles: Action to upload multiple files
 */

export const uploadFile = (files, callback) => {
  return (dispatch, getState) => {
    dispatch(apiDispatch(UPLOAD_FILE_PENDING, true))
    let initialData = {}
    files.forEach((elem, index) => {
      initialData[elem.get('unique_id')] = {
        progress: 0,
        status: fileUploadingStatus.NOT_STARTED
      }
    })
    dispatch(apiDispatch(UPLOADING_FILE_DATA, initialData))

    Array.from(Array(Math.min(5, files.length))).forEach(() => {
      postFileDynamically(dispatch, getState, files, callback)
    })
  }
}

/**
 * afterZipRequest: handles after zip request is completed or error is occured
 */
const afterZipRequest = ({
  getState,
  status,
  dispatch,
  callback,
  postZipFileDynamically,
  nextFile,
  files
}) => {
  const filesUploading = getState().files.uploadingFileData
  const newData = Object.assign({}, filesUploading)
  newData[nextFile].status = status
  dispatch(apiDispatch(UPLOADING_FILE_DATA, newData))
  if (
    Object.values(newData).reduce(
      (a, b) =>
        a &&
        (b.status === fileUploadingStatus.FINISHED ||
          b.status === fileUploadingStatus.ERROR_OCCURED),
      true
    )
  ) {
    dispatch(apiDispatch(UPLOAD_FILE_PENDING, false))
    dispatch(apiDispatch(UPLOADING_FILE_DATA, {}))
    callback()
  }
  postZipFileDynamically(dispatch, getState, files, callback)
}

/**
 *
 * postZipFileDynamically: make create request of files which previously has not been made recursively
 */
const postZipFileDynamically = (dispatch, getState, files, callback) => {
  const url = `${FILE_APIS.fileItem}/zip/`

  const filesUploading = getState().files.uploadingFileData
  const nextFile = Object.keys(filesUploading).find(
    elem => filesUploading[elem].status === fileUploadingStatus.NOT_STARTED
  )

  if (nextFile !== undefined) {
    let config = {
      onUploadProgress: updateProgress(nextFile, dispatch, getState)
    }
    let filesUploading = getState().files.uploadingFileData
    let newData = Object.assign({}, filesUploading)
    newData[nextFile].status = fileUploadingStatus.STARTED
    dispatch(apiDispatch(UPLOADING_FILE_DATA, newData))
    const fileToUpload = files.findIndex(
      file => file.get('unique_id') === nextFile
    )
    apiClient
      .post(url, files[fileToUpload], config)
      .then(() => {
        afterZipRequest({
          getState,
          status: fileUploadingStatus.FINISHED,
          dispatch,
          callback,
          postZipFileDynamically,
          nextFile,
          files
        })
      })
      .catch(() => {
        afterZipRequest({
          getState,
          status: fileUploadingStatus.ERROR_OCCURED,
          dispatch,
          callback,
          postZipFileDynamically,
          nextFile,
          files
        })
      })
  }
}

/**
 * uploadZipFiles: Action to upload multiple zip files
 */

export const uploadZipFile = (files, callback) => {
  return (dispatch, getState) => {
    dispatch(apiDispatch(UPLOAD_FILE_PENDING, true))
    let initialData = {}
    files.forEach((elem, index) => {
      initialData[elem.get('unique_id')] = {
        progress: 0,
        status: fileUploadingStatus.NOT_STARTED
      }
    })
    dispatch(apiDispatch(UPLOADING_FILE_DATA, initialData))

    Array.from(Array(Math.min(5, files.length))).forEach(() => {
      postZipFileDynamically(dispatch, getState, files, callback)
    })
  }
}

/**
 * addFileToCopy: Action to add the file which is to be copied
 */
export const addItemToCopyOrCut = (id, type, action) => {
  return dispatch => {
    dispatch({
      type: FILE_TO_COPY,
      payload: { id: id, type: type, action: action }
    })
  }
}

/**
 * pasteActiveFile: Action to paste copied file 
 */
export const pasteActiveItem = (fileToCopy,destination, callback) => {
  let url = ''
  if(fileToCopy.type === ITEM_TYPE.file && fileToCopy.action === ACTION_TYPE.COPY){
    url = `${FILE_APIS.fileItem}/${FILE_APIS.copy}`
  } else if(fileToCopy.type === ITEM_TYPE.folder && fileToCopy.action === ACTION_TYPE.COPY) {
    url = `${FOLDER_APIS.folderItem}/${FOLDER_APIS.copy}`
  } else if(fileToCopy.type === ITEM_TYPE.file && fileToCopy.action === ACTION_TYPE.CUT) {
    url = `${FILE_APIS.fileItem}/${FILE_APIS.cut}`
  } else {
    url = `${FOLDER_APIS.folderItem}/${FOLDER_APIS.cut}`
  }
  return async dispatch => {
    try {
      const res = await apiClient.post(url, {id: fileToCopy.id, destination: destination.id})
      dispatch({
        type: FILE_COPIED
      })
      callback()
    } catch (err) {
      callback()
    }
  }
}
