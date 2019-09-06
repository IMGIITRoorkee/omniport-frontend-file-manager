import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Message,
  Dimmer,
  Loader,
  List,
  Image,
  GridColumn,
  Container,
  Grid,
  GridRow,
  Header,
  Button,
  Popup,
  Modal
} from 'semantic-ui-react'
import { setfiles } from '../actions/index'
import AppUpload from './app-upload'
import Test from './test/index'
import main from './css/app.css'

class AppDisplayFile extends Component {
  handleClick = file => {
    localStorage.setItem('file_url', file.file_data)
    window.close()
  }
  componentDidMount() {
    this.props.SetFiles()
    // console.log(window.opener.some("tushar"))
    // console.log(this.props, 'tushar')
  }
  render() {
    const { files } = this.props
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

const mapStateToProps = state => {
  return {
    files: state.files
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SetFiles: () => {
      dispatch(setfiles())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppDisplayFile)
