import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-semantic-toasts'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import { createFolder, editFolder } from '../actions/folderActions'
import { checkFolderIfAlreadyExists } from '../helpers/helperfunctions'
import file from './css/file.css'

class FolderFormModal extends Component {
  constructor(props) {
    super(props)
    const { parentFolder } = this.props
    this.state = {
      formObj: {
        folder_name: '',
        starred: false,
        permission: 'r_w',
        filemanager: parentFolder.filemanager,
        parent: parentFolder.id,
        root: parentFolder.root || parentFolder.id
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.setState({
      formObj: { ...this.getInitialObj() }
    })
  }
  getInitialObj = () => {
    const { parentFolder } = this.props
    return {
      folder_name: '',
      starred: false,
      permission: 'r_w',
      filemanager: parentFolder.filemanager,
      parent: parentFolder.id,
      root: parentFolder.root || parentFolder.id
    }
  }
  componentDidUpdate(prevprops) {
    const { parentFolder } = this.props

    if (
      JSON.stringify(this.props.parentFolder) !==
      JSON.stringify(prevprops.parentFolder)
    ) {
      this.setState({
        formObj: {
          ...this.state.formObj,
          filemanager: parentFolder.filemanager,
          root: parentFolder.root || parentFolder.id,
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
            ...this.getInitialObj()
          }
        })
      }
    }
  }
  handleSubmit() {
    const { formObj } = this.state
    const { parentFolder } = this.props
    if(!checkFolderIfAlreadyExists(formObj.folderName, parentFolder)){
      if (formObj.id) {
        this.props.editFolder(formObj.id, formObj)
        this.setState({ formObj: this.getInitialObj() })
        this.props.setShowModal(false)
      } else {
        this.props.createFolder(formObj)
        this.setState({ formObj: this.getInitialObj() })
        this.props.setShowModal(false)
      }
    }
    else{
      toast({
        type: 'error',
        description: 'A folder already exists with that name'
      })
    }
  }

  render() {
    const { formObj } = this.state
    const { showModal, setShowModal, parentFolder } = this.props
    return (
      <div>
        {showModal && (
          <Modal
            onClick={(e) => {e.stopPropagation()}}
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
    parentFolder: state.folders.selectedFolder,
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
