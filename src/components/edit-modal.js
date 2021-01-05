import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-semantic-toasts'
import { Form, Checkbox, Button, Modal, Icon } from 'semantic-ui-react'
import { editFile } from '../actions/fileActions'
import { getFolder, setCurrentFolder } from '../actions/folderActions'
import { setActiveItems } from '../actions/itemActions'
import { ITEM_TYPE } from '../constants'
import { checkFilesIfAlreadyExists } from '../helpers/helperfunctions'

class EditFileModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileName: props.activeItems[0] ? props.activeItems[0].obj.fileName : ''
    }
  }
  componentDidMount() {
    this.setState({
      fileName: this.props.activeItems[0]
        ? this.props.activeItems[0].obj.fileName
        : ''
    })
  }
  componentDidUpdate(prevProps) {
    const { activeItems } = this.props
    activeItems &&
    activeItems[0] &&
    activeItems[0].obj &&
    JSON.stringify(prevProps.activeItems) !== JSON.stringify(activeItems)
      ? this.setState({
          fileName: activeItems.length ? activeItems[0].obj.fileName : ''
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
    let { fileName } = this.state
    const { currentFolder } = this.props
    if (!checkFilesIfAlreadyExists(fileName, currentFolder, false)) {
      const { editFile, activeItems } = this.props

      if (fileName) {
        var formdata = new FormData()
        formdata.append('file_name', fileName)
        editFile(activeItems[0].obj.id, formdata, this.handleSuccess)
      }
    } else {
      toast({
        type: 'error',
        description: 'A file already exists with that name'
      })
    }
  }

  handleSuccess = newFile => {
    const {
      currentFolder,
      close,
      setCurrentFolder,
      setActiveItems
    } = this.props
    const oldCurrentFolder = Object.assign({}, currentFolder)
    const oldfiles = oldCurrentFolder.files

    const ind = oldfiles.findIndex(ele => ele.id === newFile.id)
    oldfiles[ind] = newFile
    oldCurrentFolder.files = oldfiles
    setCurrentFolder(oldCurrentFolder)
    setActiveItems([{ type: ITEM_TYPE.file, obj: newFile }])

    this.setState({
      fileName: ''
    })
    close()
  }
  render() {
    const { fileName } = this.state
    const { updateFilePending, showModal, close } = this.props
    return (
      <Modal
        onClick={e => {
          e.stopPropagation()
        }}
        size='large'
        open={showModal}
        closeOnEscape={true}
        closeOnDimmerClick={false}
        onClose={close}
        onMount={() => this.componentDidMount()}
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
      return dispatch(editFile(pk, data, callback))
    },
    getFolder: id => {
      return dispatch(getFolder(id))
    },
    setCurrentFolder: data => dispatch(setCurrentFolder(data)),
    setActiveItems: items => dispatch(setActiveItems(items))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFileModal)
