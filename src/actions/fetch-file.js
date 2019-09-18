import axios from 'axios'
import { getCookie } from 'formula_one'
import { urlFilesList } from '../urls'
import {
  FETCH_FILE_FAILURE,
  FETCH_FILE_REQUEST,
  FETCH_FILE_SUCCESS,
  FETCH_FILE_FOLDER_FAILURE,
  FETCH_FILE_FOLDER_REQUEST,
  FETCH_FILE_FOLDER_SUCCESS
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
