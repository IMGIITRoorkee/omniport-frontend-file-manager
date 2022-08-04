import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-semantic-toasts'
import { Dropdown, Icon } from 'semantic-ui-react'
import { uploadZipFile } from '../actions/fileActions'
import { getFolder } from '../actions/folderActions'
import { checkIfZipFiles } from '../helpers/helperfunctions'
import UploadFilesModal from './uploadFileModal'

const initialObj = {
  fileName: '',
  size: 0,
  starred: false,
  extension: '',
  showModal: false
}
class ZipUpload extends Component {
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
    const { uploadZipFile, currentFolder } = this.props
    if (checkIfZipFiles(files)) {
      if (files.length) {
        const mango = files.map(file => {
          const formdata = new FormData()
          formdata.append(`upload`, file)
          formdata.append('file_name', file.name)
          formdata.append('extension', file.name.split('.').pop())
          formdata.append('starred', false)
          formdata.append('size', parseInt(file.size))
          formdata.append('folder', parseInt(currentFolder.id))
          formdata.append('unique_id', file.unique_id)
          return formdata
        })
        uploadZipFile(mango, this.handleSuccess)
      }
    } else {
      toast({
        type: 'error',
        description: 'Upload Zip Files only'
      })
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
        <Dropdown.Item
          onClick={() => {
            this.setState({ showModal: true })
          }}
          icon='upload'
          text='Upload zip files'
        />
        {showModal && (
          <UploadFilesModal
            isMultiple={true}
            files={files}
            isUploading={uploadFilePending}
            acceptedFiles = 'application/zip'
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
    uploadZipFile: (data, callback) => {
      return dispatch(uploadZipFile(data, callback))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZipUpload)
