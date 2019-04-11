import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { isMobile, isBrowser } from 'react-device-detect'
import { AppHeader, AppFooter, AppMain, getTheme } from 'formula_one'
import { Route, Switch } from "react-router-dom"
import { Scrollbars } from 'react-custom-scrollbars'
import AppEditor from "./app-editor"
import AppDisplayFile from "./app-display-file"

import main from 'formula_one/src/css/app.css'
import blocks from '../css/app.css'

class App extends Component {
  render () {
    const creators = [
      {
        name: 'Dhruv Bhanushali',
        role: 'Mentor',
        link: 'https://dhruvkb.github.io/'
      },
      {
        name: 'Praduman Goyal',
        role: 'Frontend developer',
        link: 'https://pradumangoyal.github.io'
      }
    ]
    const { match } = this.props
    return (
      <div styleName='main.app'>
        <AppHeader appName='file_manager' mode='app' />
        <AppMain>
          <Scrollbars>
            <Switch>
            <Route
              path={`${match.path}`}
              component={AppEditor}
            />
            <Route
              exact
              path={`${match.path}/file`}
              component={AppDisplayFile}
            />
            </Switch>
          </Scrollbars>
        </AppMain>
        <AppFooter creators={creators} />
      </div>
    )
  }
}

export default connect(
  null,
  null
)(App)
