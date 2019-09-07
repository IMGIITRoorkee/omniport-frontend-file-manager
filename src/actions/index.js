import axios from 'axios'
import { getCookie } from 'formula_one'
import {
  urlFilesList,
  urlUploadFile,
  urlDeleteFile,
  urlEditFile
} from '../urls'
import {
  FETCH_FILE_FAILURE,
  FETCH_FILE_REQUEST,
  FETCH_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  DELETE_FILE_FAILURE,
  DELETE_FILE_REQUEST,
  DELETE_FILE_SUCCESS,
  EDIT_FILE_FAILURE,
  EDIT_FILE_REQUEST,
  EDIT_FILE_SUCCESS,
  FETCH_FILE_FOLDER_FAILURE,
  FETCH_FILE_FOLDER_REQUEST,
  FETCH_FILE_FOLDER_SUCCESS,
  TABULATION,
  SET_SELECTED
} from '../constants/index'

export const fetchFiles = () => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: FETCH_FILE_REQUEST
    })
    axios
      .get(urlFilesList(), { headers: headers })
      .then(res => {
        dispatch({
          type: FETCH_FILE_SUCCESS,
          payload: {
            data: res.data && res.data.results && res.data.results[0],
            folder:
              res.data &&
              res.data.results &&
              res.data.results[0] &&
              res.data.results[0].folderName
          }
        })
      })
      .catch(err => {
        dispatch({
          type: FETCH_FILE_FAILURE,
          payload: {
            error: err
          }
        })
      })
  }
}

export const uploadFile = (data, callback) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: UPLOAD_FILE_REQUEST
    })
    axios
      .post(urlUploadFile(), data, { headers: headers })
      .then(res => {
        dispatch({
          type: UPLOAD_FILE_SUCCESS,
          payload: {
            data: res.data
          }
        })
        callback()
      })
      .catch(err => {
        dispatch({
          type: UPLOAD_FILE_FAILURE,
          payload: {
            error: err
          }
        })
      })
  }
}

export const deleteFile = (data, callback) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: DELETE_FILE_REQUEST
    })
    axios
      .delete(urlDeleteFile(data), null, { headers: headers })
      .then(res => {
        dispatch({
          type: DELETE_FILE_SUCCESS
        })
        callback()
      })
      .catch(err => {
        dispatch({
          type: DELETE_FILE_FAILURE,
          payload: {
            error: err
          }
        })
      })
  }
}

export const fetchFilesFolder = data => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: FETCH_FILE_FOLDER_REQUEST
    })
    axios
      .get(urlFilesList(data), { headers: headers })
      .then(res => {
        dispatch({
          type: FETCH_FILE_FOLDER_SUCCESS,
          payload: res.data
        })
      })
      .catch(err => {
        dispatch({
          type: FETCH_FILE_FOLDER_FAILURE,
          payload: {
            error: err
          }
        })
      })
  }
}

export const editFile = (pk, data, callback) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: EDIT_FILE_REQUEST
    })
    axios
      .put(urlEditFile(pk), data, { headers: headers })
      .then(res => {
        dispatch({
          type: EDIT_FILE_SUCCESS
        })
        callback()
      })
      .catch(err => {
        dispatch({
          type: EDIT_FILE_FAILURE,
          payload: {
            error: err
          }
        })
      })
  }
}

export const setSelected = data => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED,
      payload: data
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
