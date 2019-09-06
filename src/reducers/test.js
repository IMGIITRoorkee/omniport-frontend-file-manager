const initialState = {
  currentFolder: '',
  currentData: '',
  isSelected: false,
  selectedData: '',
  progressArray: [],
  topLevel: '',
  isLoading:false
}

const test = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECTED_DATA':
      return {
        ...state,
        selectedData: action.payload
      }
    case 'SELECTION':
      return {
        ...state,
        isSelected: true
      }
    case 'CURRENT_DATA':
      state.currentData = action.payload.data
      state.currentFolder = action.payload.folder
      let check = state.progressArray.indexOf(action.payload.folder)
      check === -1
        ? state.progressArray.push(action.payload.folder)
        : state.progressArray.slice(0, check)
      return { ...state } 

    default:
      return state
  }
}

export default test
