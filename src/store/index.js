
import thunk from 'redux-thunk'
import rootReducers from '../reducers'
import { createStore, applyMiddleware } from 'redux'

export default store = createStore(rootReducers, applyMiddleware(thunk))