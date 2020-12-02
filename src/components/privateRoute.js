import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { withLastLocation } from 'react-router-last-location'
import {  Icon, Container } from 'semantic-ui-react'
import { store } from 'core'
import { Loading } from 'formula_one'

import blocks from './css/guestError.css'

class PrivateRoute extends React.Component {
  state = {
    isAuthenticated: 'checking'
  }

  componentDidMount() {
    this.getInfo()
  }

  getInfo() {
    this.setState({
      isAuthenticated: store.getState().user.isAuthenticated,
      isGuestAuthenticated: store.getState().user.isGuestAuthenticated
    })
  }

  render() {
    const {
      history,
      guestAllowed,
      component: C,
      props: cProps,
      ...rest
    } = this.props
    const { isAuthenticated, isGuestAuthenticated } = this.state

    if (isAuthenticated === 'checking') {
      return <Loading />
    }

    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            isGuestAuthenticated && (!guestAllowed || false) ? (
              <Container
                textAlign='center'
                width='100%'
                margin='auto'
              >
                <div
                >
                  <Icon name='frown outline' />
                  Guest users are not authorised to access this page. Kindly
                  Login with username to access.
                </div>
              </Container>
            ) : (
              <C {...props} {...cProps} />
            )
          ) : (
            <Redirect
              to={`/auth/login?next=${history.location.pathname}${history.location.search}`}
            />
          )
        }
      />
    )
  }
}

export default withLastLocation(PrivateRoute)
