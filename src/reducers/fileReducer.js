const initialState = {
  isfetching:false,
  file_list:{},
  error:'',
  isuploading:false
}

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILE_REQUEST":
      return {
        ...state,
        isfetching:true
      }
    case "SET_FILE_SUCCESS":
      console.log(action.payload.data)
      return {
        ...state,
        isfetching:false,
        file_list:action.payload.data
      }
    case "SET_FILE_FAILURE":
      return {
        ...state,
        isfetching:false,
        error:action.payload.error
      }
    case "UPLOAD_FILE_REQUEST":
      return {
        ...state,
        isuploading:true
      }
    case "UPLOAD_FILE_SUCCESS":
      return {
        ...state,
        isuploading:false,
      }
    case "UPLOAD_FILE_FAILURE":
      return {
        ...state,
        error:action.payload.error
      }
    default:
      return state
  }
}

export default fileReducer
