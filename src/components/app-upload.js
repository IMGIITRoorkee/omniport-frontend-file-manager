import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Checkbox, Button, Modal, Icon } from 'semantic-ui-react'
import { uploadFile } from '../actions/fileActions'
import { getFolder } from '../actions/folderActions'

class AppUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileName: '',
      isPublic: true,
      fileData: '',
      size: 0,
      starred: false,
      extension: '',
      showModal: false,
    }
  }
  fileInputRef = React.createRef()
  handleImageChange = e => {
    e.preventDefault()
    let reader = new FileReader()
    let file = e.target.files[0]
    reader.onloadend = () => {
      this.setState({
        fileName: file.name,
        fileData: file,
        size: file.size,
        extension: file.type,
        showModal: true,
      })
    }
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  handleChange = e => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    let { fileName, fileData, isPublic, starred, size, extension } = this.state
    const { uploadFile, currentFolder } = this.props
    if (fileName && fileData) {
      let formdata = new FormData()
      fileData ? formdata.append('upload', fileData) : void 0
      formdata.append('file_name', fileName)
      formdata.append('is_public', isPublic)
      formdata.append('extension', fileName.split('.').pop())
      formdata.append('starred', starred)
      formdata.append('size', parseInt(size))
      formdata.append('folder', parseInt(currentFolder.id))
      uploadFile(formdata, this.handleSuccess)
    }
  }
  handleCheckPublic = () => {
    this.setState({
      isPublic: !this.state.isPublic,
    })
  }
  handleCheckStar = () => {
    this.setState({
      starred: !this.state.starred,
    })
  }
  handleSuccess = () => {
    const id = this.props.currentFolder.id
    this.props.getFolder(id)
    this.setState({
      fileName: '',
      isPublic: true,
      fileData: '',
      size: 0,
      starred: false,
      extension: '',
      showModal: false,
    })
  }
  close = () => {
    this.setState({
      showModal: false,
    })
  }
  render() {
    const { fileName, showModal, isPublic, starred } = this.state
    const { uploadFilePending } = this.props
    return (
      <React.Fragment>
        <Button
          onClick={() => this.fileInputRef.current.click()}
          icon
          labelPosition="left"
          primary
          basic
        >
          <Icon name="upload" />
          Upload
        </Button>
        <input
          ref={this.fileInputRef}
          type="file"
          hidden
          onChange={this.handleImageChange}
        />

        {showModal ? (
          <Modal
            size="large"
            open={showModal}
            closeOnEscape={true}
            closeOnDimmerClick={true}
            onClose={this.close}
            closeIcon
          >
            <Modal.Header>Uploading file</Modal.Header>
            <Modal.Content>
              <Form encType="multiple/form-data" onSubmit={this.handleSubmit}>
                <Form.Field>
                  <label>File Name</label>
                  <input
                    value={fileName}
                    onChange={this.handleChange}
                    placeholder="File Name"
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    checked={isPublic}
                    onChange={this.handleCheckPublic}
                    label="Public"
                  />
                  <Checkbox
                    checked={starred}
                    name="starred"
                    onChange={this.handleCheckStar}
                    label="Star this File"
                  />
                </Form.Field>
                <Button loading={uploadFilePending} type="submit">
                  Submit
                </Button>
              </Form>
            </Modal.Content>
          </Modal>
        ) : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    uploadFilePending: state.files.uploadFilePending,
    currentFolder: state.folders.selectedFolder,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getFolder: id => {
      return dispatch(getFolder(id))
    },
    uploadFile: (data, callback) => {
      return dispatch(uploadFile(data, callback))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppUpload)
