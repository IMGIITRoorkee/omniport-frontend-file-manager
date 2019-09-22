import axios from 'axios'
import { getCookie } from 'formula_one'
import { urlDeleteFile } from '../urls'
import {
  DELETE_FILE_FAILURE,
  DELETE_FILE_REQUEST,
  DELETE_FILE_SUCCESS
} from '../constants/index'

export const deleteFile = (data, callback) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: DELETE_FILE_REQUEST
    })
    console.log('DELETE HEADERS', headers)
    fetch(urlDeleteFile(data), {
      method: 'DELETE',
      headers: headers
    })
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
