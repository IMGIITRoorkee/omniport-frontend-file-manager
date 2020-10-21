import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppFooter, AppMain, AppHeader } from 'formula_one'
import { Route, Switch } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import Manager from './manager'
import Root from './root'
import Instances from './instances'

import main from 'formula_one/src/css/app.css'
import blocks from './css/app.css'

class App extends Component {
  render () {
    console.log('rendering app')
    const creators = [
      {
        name: 'Tushar Varshney',
        role: 'Frontend Developer',
        link: 'https://github.com/Tushar19varshney'
      }
    ]
    const { match } = this.props
    return (
      <div styleName='main.app'>
        {/* <AppHeader appName='file_manager' mode='app' /> */}
        <AppHeader
          mode='site'
          userDropdown
          appName='file_manager'
          // onSidebarClick={() => ChangeSidebarVisibility(sidebarVisibility)}
          // sideBarButton
          // sideBarVisibility={sidebarVisibility}
        />
        <AppMain>
          <Scrollbars>
            <Switch>
              <Route exact path={`${match.path}/`} component={Instances} />
              <Route
                exact
                path={`${match.path}/:filemanager`}
                component={Root}
              />
            </Switch>
          </Scrollbars>
        </AppMain>
        <AppFooter creators={creators} />
      </div>
    )
  }
}

export default connect(null, null)(App)
