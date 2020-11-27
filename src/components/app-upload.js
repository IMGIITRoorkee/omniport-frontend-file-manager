import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import { uploadFile } from '../actions/fileActions'
import { getFolder } from '../actions/folderActions'
import UploadFilesModal from './uploadFileModal'

const initialObj = {
  fileName: '',
  isPublic: true,
  size: 0,
  starred: false,
  extension: '',
  showModal: false
}
class AppUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      files: []
    }
  }
  fileInputRef = React.createRef()

  handleSubmit = e => {
    e.preventDefault()
    let { files } = this.state
    const { uploadFile, currentFolder } = this.props
    if (files.length) {
      let formdata = new FormData()
      for (const i in files) {
        formdata.append(`upload`, files[i])
        formdata.append('file_name', files[i].name)
        formdata.append('is_public', false)
        formdata.append('extension', files[i].name.split('.').pop())
        formdata.append('starred', false)
        formdata.append('size', parseInt(files[i].size))
        formdata.append('folder', parseInt(currentFolder.id))
      }
      uploadFile(formdata, this.handleSuccess)
    }
  }

  handleSuccess = () => {
    const id = this.props.currentFolder.id
    this.props.getFolder(id)
    this.setState({ files: [], showModal: false })
  }

  render() {
    const { showModal, files } = this.state
    const { uploadFilePending } = this.props
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            this.setState({ showModal: true })
          }}
          icon
          labelPosition='left'
          primary
          basic
        >
          <Icon name='upload' />
          Upload
        </Button>
        {showModal && (
          <UploadFilesModal
            isMultiple={true}
            files={files}
            isUploading={uploadFilePending}
            setFiles={files => {
              this.setState({ files: files })
            }}
            show={showModal}
            onHide={() => {
              this.setState({ showModal: false })
            }}
            handleUpload={e => {
              this.handleSubmit(e)
            }}
          />
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    uploadFilePending: state.files.uploadFilePending,
    currentFolder: state.folders.selectedFolder
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getFolder: id => {
      return dispatch(getFolder(id))
    },
    uploadFile: (data, callback) => {
      return dispatch(uploadFile(data, callback))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppUpload)
