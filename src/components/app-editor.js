import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Button, MountNode } from 'semantic-ui-react'
import { Editor } from '@tinymce/tinymce-react'
import { urlFilesDisplay } from '../urls'
import apiKey from '../../config.json'

class AppEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      isConfirmModal: false,
      isConfirm: false
    }
    this.nodeRef = React.createRef()
  }
  componentDidMount() {
    var self = this
    window.addEventListener(
      'message',
      function(e) {
        if (e && e.data && e.data.file && e.data.fileName) {
          self.setState({
            data: e.data,
            isConfirmModal: true
          })
        }
      },
      false
    )
  }
  handleClick = (callback, value, meta) => {
    let self = this
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=1000px,height=500px,left=100px,top=100px`
    window.open(urlFilesDisplay(), 'title', params)

    window.addEventListener('click', function(e) {
      if (
        self.state.data.file &&
        self.state.data.fileName &&
        self.state.isConfirm
      ) {
        callback(self.state.data.file, { title: self.state.data.fileName })
      }
    })
  }
  componentWillUnmount() {
    window.removeEventListener('message', function() {})
    window.removeEventListener('click', function() {})
  }
  closeConfirmationModal = () => {
    this.setState({
      isConfirmModal: false,
      data: ''
    })
  }
  handleConfirmation = () => {
    this.setState({
      isConfirmModal: false,
      isConfirm: true
    })
  }
  render() {
    const { isConfirmModal, data } = this.state
    return (
      <React.Fragment>
        <Editor
          apiKey={apiKey}
          init={{
            plugins: 'link image code',
            toolbar: 'undo redo | link image | code',
            image_title: true,
            automatic_uploads: true,
            plugins: 'link image code',
            insert_button_items: 'image link | inserttable',
            file_picker_callback: (callback, value, meta) => {
              this.handleClick(callback, value, meta)
            },
            file_browser_callback_types: 'file image media link',
            branding: false
          }}
          menubar={false}
        />
        {isConfirmModal ? (
          <Modal
            size="large"
            open={isConfirmModal}
            onClose={this.closeConfirmationModal}
            style={{ zIndex: 897465 }}
            mountNode={
              this.nodeRef
                ? this.nodeRef.current
                : document.querySelector('#app')
            }
          >
            <Modal.Header>
              Do you really want to select "{data.fileName}"
            </Modal.Header>
            <Modal.Content>
              <p>Are you sure you want to select this file?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={this.closeConfirmationModal}>
                No
              </Button>
              <Button
                positive
                icon="checkmark"
                labelPosition="right"
                content="Yes"
                onClick={this.handleConfirmation}
              />
            </Modal.Actions>
          </Modal>
        ) : null}
        <div style={{ zIndex: 100000000 }} ref={this.nodeRef}></div>
      </React.Fragment>
    )
  }
}

export default connect(
  null,
  null
)(AppEditor)
