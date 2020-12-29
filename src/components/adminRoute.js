import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Loading } from 'formula_one'
import { connect } from 'react-redux'

class AdminRoute extends React.Component {
  state = {
    isAdmin: 'checking'
  }
  componentDidMount() {
    this.setState({
      isAdmin: this.props.isAdmin
    })
  }
  componentDidUpdate(prevprops) {
    if (prevprops.isAdmin !== this.props.isAdmin) {
      this.setState({ isAdmin: this.props.isAdmin })
    }
  }
  render() {
    const { component: C, props: cProps, ...rest } = this.props
    const { isAdmin } = this.state
    if (isAdmin == 'checking') {
      return <Loading />
    }

    return (
      <Route
        {...rest}
        render={props =>
          isAdmin ? <C {...props} {...cProps} /> : <Redirect to='/404' />
        }
      />
    )
  }
}
const mapStateToProps = state => {
  return {
    isAdmin: state.user.isAdmin,
    isAdminPending: state.user.isAdminPending
  }
}
export default connect(mapStateToProps, {})(AdminRoute)
