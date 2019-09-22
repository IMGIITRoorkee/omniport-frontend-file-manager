import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Icon,
  Popup,
  Grid,
  Button,
  Modal,
  Form,
  Checkbox
} from 'semantic-ui-react'
import {
  setSelected,
  setTarget,
  deleteFile,
  unsetSelected,
  fetchFiles,
  editFile
} from '../actions/index'

import index from './css/index.css'
class PopupView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopupOpen: false,
      showModal: false,
      fileName: '',
      isPublic: false
    }
    this.contextRef = React.createRef()
  }
  componentDidUpdate(prevProps) {
    const { selectedData } = this.props
    if (
      JSON.stringify(prevProps.selectedData) !== JSON.stringify(selectedData)
    ) {
      this.setState({
        fileName: selectedData.fileName,
        isPublic: selectedData.isPublic
      })
    }
  }
  handleEdit = () => {
    this.setState(
      {
        showModal: true
      },
      this.handlePopupToggle(null, false)
    )
  }
  handleChange = e => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }
  handleSubmit = e => {
    e.preventDefault()
    let { fileName, isPublic } = this.state
    const { selectedData, editFile } = this.props

    if (fileName) {
      var formData = new FormData()
      formData.append('file_name', fileName)
      formData.append('is_public', isPublic)
      editFile(selectedData.pk, formData, this.successCallback)
    }
  }
  handleCheck = () => {
    this.setState({
      isPublic: !this.state.isPublic
    })
  }
  successCallback = () => {
    this.setState({
      showModal: false
    })
  }
  close = () => {
    this.setState({
      showModal: false
    })
  }
  handlePopupToggle = (e, value) => {
    this.setState({
      isPopupOpen: value
    })
    if (e && e.type === 'click') e.stopPropagation()
  }
  handleDownload = () => {
    const { isSelected, selectedData } = this.props
    if (isSelected) {
      let link = document.createElement('a')
      link.download = selectedData.fileName
      link.href = selectedData.link
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    this.handlePopupToggle(null, false)
  }
  handleDelete = () => {
    const { isSelected, selectedData, deleteFile, unsetSelected } = this.props
    isSelected ? deleteFile(selectedData.pk, this.successCallback) : null
    unsetSelected()
    this.handlePopupToggle(null, false)
  }
  successCallback = () => {
    this.props.fetchFiles()
  }
  handleClick = (pk, fileName, link, index, isPublic) => {
    const { setSelected } = this.props
    this.setState({
      active: index
    })
    setSelected({ pk, fileName, link, isPublic })
  }
  handleSelect = e => {
    if (e && e.type === 'click') {
      console.log('dsajbdajk')
      this.props.handleClick()
      e.stopPropagation()
    }
  }
  render() {
    const { isPopupOpen, showModal, fileName, isPublic } = this.state
    const { isLoading } = this.props
    return (
      <React.Fragment>
        <Popup
          trigger={
            <Button icon floated="right" onClick={e => this.handleSelect(e)}>
              <Icon name="ellipsis horizontal" />
            </Button>
          }
          on="click"
          open={isPopupOpen}
          onClose={e => this.handlePopupToggle(e, false)}
          onOpen={e => this.handlePopupToggle(e, true)}
          onClick={e => this.handleSelect(e)}
          wide
        >
          <Grid columns="equal">
            <Grid.Column width={4} textAlign="center">
              <Button icon onClick={this.handleEdit} color="green">
                Edit
              </Button>
            </Grid.Column>
            <Grid.Column width={6} textAlign="center">
              <Button color="purple" onClick={this.handleDownload}>
                Download
              </Button>
            </Grid.Column>
            <Grid.Column width={6} textAlign="center">
              <Button color="red" onClick={this.handleDelete}>
                Delete
              </Button>
            </Grid.Column>
          </Grid>
        </Popup>
        {showModal ? (
          <Modal
            size="small"
            open={showModal}
            closeOnEscape={true}
            closeOnDimmerClick={true}
            onClose={this.close}
            closeIcon
          >
            <Modal.Header>Editing file</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.handleSubmit}>
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
                <Button loading={isLoading} type="submit">
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
    currentData: state.files.currentData,
    progress: state.files.progressArray,
    tabular: state.files.tabular,
    isSelected: state.files.isSelected,
    selectedData: state.files.selectedData,
    isLoading: state.files.isLoading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFiles: () => {
      dispatch(fetchFiles())
    },
    setSelected: data => {
      dispatch(setSelected(data))
    },
    setTarget: () => {
      dispatch(setTarget())
    },
    deleteFile: (pk, callback) => {
      dispatch(deleteFile(pk, callback))
    },
    unsetSelected: () => {
      dispatch(unsetSelected())
    },
    editFile: (pk, data, callback) => {
      return dispatch(editFile(pk, data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupView)
