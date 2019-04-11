import axios from "axios"
import { getCookie } from 'formula_one'
import { 
  urlFilesList,
  urlUploadFile

} from "../urls"

export const setfiles = () => {
    let headers = {
        'X-CSRFToken': getCookie('csrftoken')
    }
    return dispatch => {
        dispatch({
            type: "SET_FILE_REQUEST"
        })        
      axios
        .get(urlFilesList(),{ headers:headers })
        .then(res => {
          dispatch({
            type: 'SET_FILE_SUCCESS',
            payload: {
              data: res.data.results[0].files
            }
          })
        })
        .catch( err => {
            dispatch({
                type: 'SET_FILE_FAILURE',
                payload: {
                  error: err
                }
              })
        }
        )
    }
  }

  export const addfile = (data,callback) => {
    let headers = {
        'X-CSRFToken': getCookie('csrftoken')
    }
    return dispatch => {
        dispatch({
            type: "UPLOAD_FILE_REQUEST"
        })        
      axios
        .post(urlUploadFile(),data,{ headers:headers })
        .then(res => {
          dispatch({
            type: 'UPLOAD_FILE_SUCCESS',
            payload: {
              data: res.data
            }
          })
          callback()
        })
        .catch( err => {
            dispatch({
                type: 'UPLOAD_FILE_FAILURE',
                payload: {
                  error: err
                }
              })
        }
        )
    }
  }