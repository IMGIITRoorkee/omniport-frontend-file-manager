import React, { Component } from 'react'
import { AppFooter, AppMain, AppHeader } from 'formula_one'
import { Switch } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'

import { store } from 'core'
import main from 'formula_one/src/css/app.css'

import { creators } from '../constants'

import PrivateRoute from './privateRoute'
import Root from './root'
import Instances from './instances'
import CreateInstance from './createInstance'
import ApproveRequest from './approveRequest'
import Admin from './admin'

import blocks from './css/app.css'

import { whoami } from 'auth/src/actions/index'
import { setActiveItems } from '../actions/itemActions'
import { getIsUserAdmin } from '../actions/userActions'
import AdminRoute from './adminRoute'

const EASTEREGG = 'baadal'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      easterEgg: false,
      index: 0
    }
  }
  componentDidMount() {
    store.dispatch(whoami())
    this.props.getIsUserAdmin()
    window.addEventListener('keypress', (event) => {
      if (event.key === EASTEREGG[this.state.index]) {
        this.setState({
          index: this.state.index + 1
        })
      }
      else {
        this.setState({
          index: 0
        })
      }
      if (this.state.index === EASTEREGG.length) {
        this.setState({
          easterEgg: true
        })
      }
      else if (this.state.easterEgg) {
        this.setState({
          easterEgg: false
        })
      }
    })
  }
  render() {
    const { match } = this.props
    return (
      <div styleName='main.app' onClick={() => this.props.setActiveItems([])}>
        <AppHeader mode='site' userDropdown appName='file_manager' />
        <AppMain>
          <Scrollbars>
          {this.state.easterEgg ? (
            <div styleName="blocks.easter-egg">
              <iframe
                src="https://www.youtube.com/embed/AnxrJiS5uKU?start=134&autoplay=1"
                frameborder="0"
                allow="autoplay"
              >
              </iframe>
            </div>
          ): (
            <Switch>
              <AdminRoute
                path={`${match.path}/admin`}
                exact
                component={Admin}
              />
              <AdminRoute
                path={`${match.path}/admin/create`}
                exact
                component={CreateInstance}
              />
              <AdminRoute
                path={`${match.path}/admin/approve`}
                exact
                component={ApproveRequest}
              />
              <PrivateRoute
                exact
                path={`${match.path}/`}
                component={Instances}
                guestAllowed={false}
              />
              <PrivateRoute
                exact
                key={2}
                path={`${match.path}/:filemanager/:id`}
                component={Root}
                guestAllowed={false}
              />
              <PrivateRoute
                exact
                key={3}
                path={`${match.path}/:filemanager`}
                component={Root}
                guestAllowed={false}
              />
              <PrivateRoute
                exact
                key={4}
                path={`${match.path}/:filemanager/:uuid/:type_shared/:id/:type_access`}
                component={Root}
                guestAllowed={false}
              />
            </Switch>
          )}
          </Scrollbars>
        </AppMain>
        <AppFooter creators={creators} />
      </div>
    )
  }
}

const mapDisPatchToProps = dispatch => {
  return {
    setUser: () => dispatch(setUser()),
    setActiveItems: items => dispatch(setActiveItems(items)),
    getIsUserAdmin: () => dispatch(getIsUserAdmin())
  }
}

export default connect(() => ({}), mapDisPatchToProps)(App)
