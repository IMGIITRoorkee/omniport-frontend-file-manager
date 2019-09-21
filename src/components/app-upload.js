import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Checkbox, Button, Modal } from 'semantic-ui-react'
import { uploadFile, fetchFiles } from '../actions/index'

// import './css/appupload.css'

class AppUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileName: '',
      isPublic: false,
      fileData: '',
      showModal: false
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
        showModal: true
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
    let { fileName, fileData, isPublic } = this.state
    const { uploadFile } = this.props

    if (fileName && fileData) {
      var formData = new FormData()
      fileData ? formData.append('upload', fileData) : void 0
      formData.append('file_name', fileName)
      formData.append('is_public', isPublic)
      uploadFile(formData, this.successCallback)
    }
  }
  handleCheck = () => {
    this.setState({
      isPublic: !this.state.isPublic
    })
  }
  successCallback = () => {
    this.props.fetchFiles()
    this.setState({
      showModal: false
    })
  }
  close = () => {
    this.setState({
      showModal: false
    })
  }
  render() {
    const { fileName, showModal, isPublic } = this.state
    const { isUploading } = this.props
    return (
      <React.Fragment>
        <Button
          icon="upload"
          onClick={() => this.fileInputRef.current.click()}
        />
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
                    name="fileName"
                    value={fileName}
                    onChange={this.handleChange}
                    placeholder="File Name"
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    checked={isPublic}
                    onChange={this.handleCheck}
                    label="Public"
                  />
                </Form.Field>
                <Button loading={isUploading} type="submit">
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
    isUploading: state.files.isUploading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFiles: () => {
      return dispatch(fetchFiles())
    },
    uploadFile: (data, callback) => {
      return dispatch(uploadFile(data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppUpload)
