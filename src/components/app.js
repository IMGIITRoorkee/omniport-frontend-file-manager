import React, { Component } from 'react'
import { AppFooter, AppMain, AppHeader } from 'formula_one'
import { Route, Switch } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import PrivateRoute from './privateRoute'
import Root from './root'
import Instances from './instances'
import { store } from 'core'

import main from 'formula_one/src/css/app.css'
import blocks from './css/app.css'
import ApproveRequest from './approveRequest'
import Admin from './admin'
import CreateInstance from './createInstance'
import { whoami } from 'auth/src/actions/index'
import { MAINTAINER_DESIGNATIONS, PERSON_ROLES } from '../constants'
import { setActiveItems } from '../actions/itemActions'
class App extends Component {
  componentDidMount() {
    store.dispatch(whoami())
  }
  render() {
    console.log('rendering app')
    const creators = [
      {
        name: 'Tushar Varshney',
        role: 'Frontend Developer',
        link: 'https://github.com/Tushar19varshney'
      },
      {
        name: 'Gauransh Dingwani',
        role: 'Frontend & Backend Developer',
        link: 'https://github.com/gauransh7'
      },
      {
        name: 'Ayush Bansal',
        role: 'Frontend & Backend Developer',
        link: 'https://github.com/ayu023ban'
      }
    ]
    const { match, user } = this.props
    const roles =
      (user.details && user.details.profile && user.details.profile.roles) || []
    const isAdmin =
      roles.some(elem => elem.role === PERSON_ROLES.MAINTAINER) &&
      roles.find(elem => elem.role === PERSON_ROLES.MAINTAINER).data
        .designation == MAINTAINER_DESIGNATIONS.HUB_COORDINATOR
    return (
      <div styleName='main.app' onClick={() => this.props.setActiveItems([])}>
        <AppHeader mode='site' userDropdown appName='file_manager' />
        <AppMain>
          <Scrollbars>
            <Switch>
              {isAdmin && (
                <Route
                  exact
                  path={`${match.path}/admin`}
                  component={Admin}
                  guestAllowed={false}
                />
              )}
              {isAdmin && (
                <Route
                  exact
                  path={`${match.path}/admin/create`}
                  component={CreateInstance}
                  guestAllowed={false}
                />
              )}
              {isAdmin && (
                <Route
                  exact
                  path={`${match.path}/admin/approve`}
                  component={ApproveRequest}
                />
              )}
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
          </Scrollbars>
        </AppMain>
        <AppFooter creators={creators} />
      </div>
    )
  }
}
const mapStateToProps = () => {
  return {
    user: store.getState().user
  }
}
const mapDisPatchToProps = dispatch => {
  return {
    setUser: () => dispatch(setUser()),
    setActiveItems: items => dispatch(setActiveItems(items))
  }
}

export default connect(mapStateToProps, mapDisPatchToProps)(App)
