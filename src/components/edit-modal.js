import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Checkbox, Button, Modal, Icon } from 'semantic-ui-react'
import { editFileName } from '../actions/fileActions'
import { getFolder } from '../actions/folderActions'

class EditModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fileName: '',
      isPublic: false
    }
  }
  componentDidUpdate (prevProps) {
    const { activeItems } = this.props
    activeItems &&
    activeItems[0] &&
    activeItems[0].obj &&
    JSON.stringify(prevProps.activeItems) !== JSON.stringify(activeItems)
      ? this.setState({
          fileName: activeItems[0].obj.fileName,
          isPublic: activeItems[0].obj.isPublic
        })
      : ''
  }
  handleChange = e => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }
  handleSubmit = e => {
    e.preventDefault()
    let { fileName, isPublic } = this.state
    const { editFile, activeItems } = this.props

    if (fileName) {
      var formdata = new FormData()
      formdata.append('file_name', fileName)
      formdata.append('is_public', isPublic)
      editFile(activeItems[0].obj.id, formdata, this.handleSuccess)
    }
  }
  handleCheckPublic = () => {
    this.setState({
      isPublic: !this.state.isPublic
    })
  }
  handleCheckStar = () => {
    this.setState({
      starred: !this.state.starred
    })
  }
  handleSuccess = () => {
    const id = this.props.currentFolder.id
    this.props.getFolder(id)
    this.props.close()
    this.setState({
      fileName: '',
      isPublic: false
    })
  }
  render () {
    const { fileName, isPublic, starred } = this.state
    const { updateFilePending, showModal, close } = this.props
    return (
      <Modal
        size='large'
        open={showModal}
        closeOnEscape={true}
        closeOnDimmerClick={true}
        onClose={close}
        closeIcon
      >
        <Modal.Header>Editing file</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>File Name</label>
              <input
                name='fileName'
                value={fileName}
                onChange={this.handleChange}
                placeholder='File Name'
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                checked={isPublic}
                onChange={this.handleCheckPublic}
                label='Public'
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                checked={starred}
                onChange={this.handleCheckStar}
                label='Star this file'
              />
            </Form.Field>
            <Button loading={updateFilePending} type='submit'>
              Submit
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    updateFilePending: state.files.updateFilePending,
    activeItems: state.items.activeItems,
    tabular: state.items.tabular,
    currentFolder: state.folders.selectedFolder
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editFile: (pk, data, callback) => {
      return dispatch(editFileName(pk, data, callback))
    },
    getFolder: id => {
      return dispatch(getFolder(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditModal)
