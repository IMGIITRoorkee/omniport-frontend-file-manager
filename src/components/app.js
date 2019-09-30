import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppFooter, AppMain } from 'formula_one'
import { Route, Switch } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import Manager from './manager'

import main from 'formula_one/src/css/app.css'
import blocks from './css/app.css'

class App extends Component {
  render() {
    const creators = [
      {
        name: 'Tushar Varshney',
        role: 'Frontend Developer',
        link: 'https://github.com/Tushar19varshney'
      }
    ]
    const { match } = this.props
    return (
      <div styleName="main.app">
        {/* <AppHeader appName="file_manager" mode="app" /> */}
        <AppMain>
          <Scrollbars>
            <Switch>
              <Route exact path={`${match.path}/`} component={Manager} />
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
