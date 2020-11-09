import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import { createFolder, editFolder } from '../actions/folderActions'
import file from './css/file.css'

const initialObj = {
  folder_name: '',
  starred: false,
  permission: 'r_w',
  filemanager: null,
  parent: null,
  root: null
}

class FolderFormModal extends Component {
  constructor (props) {
    super(props)
    const { editFormObj } = this.props
    this.state = {
      formObj: initialObj
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount () {
    const { parentFolder } = this.props
    this.setState({
      filemanager: parentFolder.filemanager,
      root: parentFolder.root,
      parent: parentFolder.id
    })
  }
  componentDidUpdate (prevprops) {
    const { parentFolder } = this.props

    if (
      this.props.parentFolder.id &&
      prevprops.parentFolder.id !== this.props.parentFolder.id
    ) {
      this.setState({
        formObj: {
          ...this.state.formObj,
          filemanager: parentFolder.filemanager,
          root: parentFolder.root,
          parent: parentFolder.id
        }
      })
    }

    if (
      JSON.stringify(this.props.editFormObj) !==
      JSON.stringify(prevprops.editFormObj)
    ) {
      if (Object.keys(this.props.editFormObj).length) {
        this.setState({
          formObj: Object.assign({
            ...this.state.formObj,
            ...this.props.editFormObj
          })
        })
      } else {
        this.setState({
          formObj: {
            ...initialObj,
            filemanager: parentFolder.filemanager,
            root: parentFolder.root,
            parent: parentFolder.id
          }
        })
      }
    }
  }
  handleSubmit () {
    const { formObj } = this.state
    if (formObj.id) {
      this.props.editFolder(formObj.id, formObj)
      this.setState({ formObj: initialObj })
      this.props.setShowModal(false)
    } else {
      this.props.createFolder(formObj)
      this.setState({ formObj: initialObj })
      this.props.setShowModal(false)
    }
  }

  render () {
    const { formObj } = this.state
    const { showModal, setShowModal } = this.props
    return (
      <div>
        {showModal && (
          <Modal
            closeIcon
            size='tiny'
            open={showModal}
            onClose={() => {
              setShowModal(false)
            }}
          >
            <Modal.Content>
              <Form>
                <Form.Input
                  label='Folder Name'
                  required
                  placeholder='Folder Name'
                  value={formObj.folderName}
                  onChange={e => {
                    this.setState({
                      formObj: {
                        ...this.state.formObj,
                        folderName: e.target.value
                      }
                    })
                  }}
                />
                <Button type='submit' onClick={this.handleSubmit}>
                  {formObj.id ? 'Edit' : 'Create'}
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
    parentFolder: state.folders.selectedFolder
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createFolder: formObj => {
      dispatch(createFolder(formObj))
    },
    editFolder: (id, formObj) => {
      dispatch(editFolder(id, formObj))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FolderFormModal)
