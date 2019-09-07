import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Modal
} from 'semantic-ui-react'
import { fetchFiles } from '../actions/index'
import Test from './index'
import main from './css/app.css'

class AppDisplayFile extends Component {
  componentDidMount() {
    this.props.fetchFiles()
  }
  render() {
    return (
      <React.Fragment>
        <Modal size='fullscreen' trigger={<Button>Show Modal</Button>}>
          <Modal.Content styleName='main.content' scrolling>
            <Test />
          </Modal.Content>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFiles: () => {
      dispatch(fetchFiles())
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(AppDisplayFile)
