import axios from 'axios'
import { getCookie } from 'formula_one'
import { urlUploadFile } from '../urls'
import {
  UPLOAD_FILE_FAILURE,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS
} from '../constants/index'

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
