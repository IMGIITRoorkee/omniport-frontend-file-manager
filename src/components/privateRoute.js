import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { withLastLocation } from 'react-router-last-location'
import { store } from 'core'
import { Loading } from 'formula_one'

class PrivateRoute extends React.Component {
  state = {
    isAuthenticated: 'checking'
  }

  componentDidMount() {
    this.getInfo()
  }

  getInfo() {
    this.setState({
      isAuthenticated: store.getState().user.isAuthenticated
    })
  }

  render() {
    const {
      history,
      component: C,
      props: cProps,
      ...rest
    } = this.props
    const { isAuthenticated } = this.state

    if (isAuthenticated === 'checking') {
      return <Loading />
    }

    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <C {...props} {...cProps} />
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
