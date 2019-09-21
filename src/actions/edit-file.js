import axios from 'axios'
import { getCookie } from 'formula_one'
import { urlEditFile } from '../urls'
import {
  EDIT_FILE_FAILURE,
  EDIT_FILE_REQUEST,
  EDIT_FILE_SUCCESS
} from '../constants/index'

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
          type: EDIT_FILE_SUCCESS,
          payload: {
            id: res.data.id,
            isPublic: res.data.isPublic,
            fileName: res.data.fileName,
            datetimeModified: res.data.datetimeModified
          }
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
