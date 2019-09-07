import axios from 'axios'
import { getCookie } from 'formula_one'
import { urlFilesList, urlUploadFile, urlDeleteFile } from '../urls'
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

export const setSelected = (data) => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED,
      payload: data
    })
  }
}
