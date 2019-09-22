import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Grid, Button, Modal } from 'semantic-ui-react'
import {
  setSelected,
  setTarget,
  deleteFile,
  unsetSelected,
  fetchFiles,
  editFile
} from '../actions/index'
import EditModal from './edit-modal'

import index from './css/index.css'
import popup from './css/popup.css'
class PopupView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopupOpen: false,
      showModal: false,
      fileName: '',
      isPublic: false,
      isDelete: false
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
    const {
      isSelected,
      selectedData,
      deleteFile,
      unsetSelected,
      id
    } = this.props
    isSelected && selectedData.pk === id
      ? deleteFile(selectedData.pk, this.successCallback)
      : deleteFile(id, this.successCallback)
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
      this.props.handleClick()
      e.stopPropagation()
    }
  }
  showDeleteModal = () => {
    this.setState({
      isDelete: true
    })
  }
  closeDeleteModal = () => {
    this.setState({
      isDelete: false
    })
  }
  render() {
    const { isPopupOpen, showModal, fileName, isDelete } = this.state
    const { isSelected } = this.props
    return (
      <React.Fragment>
        <Popup
          trigger={
            <Button icon floated="right" onClick={e => this.handleSelect(e)}>
              <Icon name="ellipsis horizontal" />
            </Button>
          }
          open={isPopupOpen}
          onClose={e => this.handlePopupToggle(e, false)}
          onOpen={e => this.handlePopupToggle(e, true)}
          onClick={e => this.handleSelect(e)}
          wide
          flowing
          hoverable
        >
          <div styleName="popup.button-group">
            <div styleName="popup.button-padding">
              <Button
                labelPosition="left"
                icon
                onClick={this.handleEdit}
                color="green"
              >
                <Icon name="edit" />
                Edit
              </Button>
            </div>
            <div styleName="popup.button-padding">
              <Button
                labelPosition="left"
                secondary
                onClick={this.handleDownload}
                icon
              >
                <Icon name="download" />
                Download
              </Button>
            </div>
            <div styleName="popup.button-padding">
              <Button
                color="red"
                labelPosition="left"
                onClick={this.showDeleteModal}
                icon
              >
                <Icon name="delete" />
                Delete
              </Button>
            </div>
          </div>
        </Popup>
        <EditModal close={this.close} showModal={showModal} />
        {isDelete && isSelected ? (
          <Modal size="large" open={isDelete} onClose={this.closeDeleteModal}>
            <Modal.Header>
              Do you really want to delete "{fileName}"
            </Modal.Header>
            <Modal.Content>
              <p>Are you sure you want to delete this file?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={this.closeDeleteModal}>
                No
              </Button>
              <Button
                positive
                icon="checkmark"
                labelPosition="right"
                content="Yes"
                onClick={this.handleDelete}
              />
            </Modal.Actions>
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
    selectedData: state.files.selectedData
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
