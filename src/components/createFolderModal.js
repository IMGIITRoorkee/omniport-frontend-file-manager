import React, { Component, useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import { createFolder } from '../actions/folderActions'

const initialObj = {
  folder_name: '',
  starred: false,
  permission: 'r_w',
  filemanager: null,
  parent: null,
  root: null,
}

class FolderModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      formObj: initialObj,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onHide = this.onHide.bind(this)
  }
  componentDidMount() {
    const { parentFolder } = this.props
    this.setState({
      filemanager: parentFolder.filemanager,
      root: parentFolder.root,
      parent: parentFolder.id,
    })
  }
  componentDidUpdate(prevprops) {
    if (
      this.props.parentFolder.id &&
      prevprops.parentFolder.id !== this.props.parentFolder.id
    ) {
      const { parentFolder } = this.props
      this.setState({
        formObj: {
          ...this.state.formObj,
          filemanager: parentFolder.filemanager,
          root: parentFolder.root,
          parent: parentFolder.id,
        },
      })
    }
  }
  handleSubmit() {
    this.props.createFolder(this.state.formObj)
    this.onHide()
  }
  onHide() {
    this.setState({ showModal: false })
  }
  render() {
    const { showModal, formObj } = this.state
    return (
      <div>
        <Button
          labelPosition="left"
          icon
          primary
          basic
          onClick={() => {
            this.setState({ showModal: true })
          }}
        >
          <Icon name="plus" />
          Create Folder
        </Button>
        {showModal && (
          <Modal closeIcon size="tiny" open={showModal} onClose={this.onHide}>
            <Modal.Content>
              <Form>
                <Form.Input
                  label="Folder Name"
                  required
                  placeholder="Folder Name"
                  value={this.state.formObj.folder_name}
                  onChange={e => {
                    this.setState({
                      formObj: {
                        ...this.state.formObj,
                        folder_name: e.target.value,
                      },
                    })
                  }}
                />
                <Button type="submit" onClick={this.handleSubmit}>
                  Create
                </Button>
              </Form>
            </Modal.Content>
          </Modal>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    parentFolder: state.folders.selectedFolder,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createFolder: formObj => {
      dispatch(createFolder(formObj))
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FolderModal)
