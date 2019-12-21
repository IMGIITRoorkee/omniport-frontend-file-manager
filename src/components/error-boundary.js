import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null
    }
  }

  componentDidCatch(error) {
    this.setState({
      error
    })
  }

  render() {
    if (this.state.error) {
      return <div>Error loading component</div>
    }

    return this.props.children
  }
}

export default ErrorBoundary
