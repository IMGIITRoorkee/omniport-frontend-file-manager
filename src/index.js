import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import App from './components/app'
import { Provider } from 'react-redux'
import 'pure-react-carousel/dist/react-carousel.es.css'
import store from '../src/store'
export default class AppRouter extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { match } = this.props
    return (
      <Provider store={store}>
        <Route path={`${match.path}`} component={App} />
      </Provider>
    )
  }
}
