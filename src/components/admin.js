import React, { Component } from 'react'
import { Card, Container, Divider } from 'semantic-ui-react'
import css from './css/approveRequest.css'
import ErrorBoundary from './error-boundary'

class Admin extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Container styleName='css.main-container'>
          <h3 className='center'>Admin Portal</h3>
          <Divider />
          <Card
            fluid
            color='red'
            header='Approve Data Requests'
            onClick={() => this.props.history.push(`${BASE_URL}/admin/approve`)}
          />
          <Card
            fluid
            color='red'
            header='Create new filemanager instance'
            onClick={() => this.props.history.push(`${BASE_URL}/admin/create`)}
          />
        </Container>
      </ErrorBoundary>
    )
  }
}

export default Admin
