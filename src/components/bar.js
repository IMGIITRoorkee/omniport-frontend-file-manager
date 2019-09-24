import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Button, Icon, Modal } from 'semantic-ui-react'
import {
  lastVisited,
  fetchFilesFolder,
  tabulation,
  unsetSelected,
  deleteFile,
  fetchFiles
} from '../actions/index'
import Upload from './app-upload'
import Edit from './edit-file'

import file from './css/file.css'
class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDelete: false
    }
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
  }
  handleBack = () => {
    const { fetchFilesFolder, lastVisited, unsetSelected } = this.props
    fetchFilesFolder(lastVisited, this.successBackCallback)
    unsetSelected()
  }
  successBackCallback = () => {
    const { currentFolder, lastVisitedAct } = this.props
    lastVisitedAct(currentFolder)
  }
  handleTabulation = () => {
    const { tabulation, tabular, unsetSelected } = this.props
    tabulation(!tabular)
    unsetSelected()
  }
  showDeleteModal = () => {
    this.setState({
      isDelete: true
    })
  }
  handleDelete = () => {
    const { isSelected, selectedData, deleteFile, unsetSelected } = this.props
    isSelected ? deleteFile(selectedData.pk, this.successCallback) : null
    unsetSelected()
  }
  successCallback = () => {
    this.props.fetchFiles()
    this.setState({
      isDelete: false
    })
  }
  closeDeleteModal = () => {
    this.setState({
      isDelete: false
    })
  }
  render() {
    const {
      topLevel,
      currentFolder,
      lastVisited,
      tabular,
      isSelected,
      selectedData
    } = this.props
    const { isDelete } = this.state
    return (
      <Segment styleName="file.navbar">
        <div styleName="file.navbar-first">
          <div>
            <Button
              disabled={topLevel === currentFolder}
              onClick={this.handleBack}
              icon="angle left"
            />
          </div>
          <div>
            <Button disabled={lastVisited === ''} icon="angle right" />
          </div>
          <div>
            <Button
              onClick={this.handleTabulation}
              icon={tabular ? 'columns' : 'table'}
            />
          </div>
        </div>
        <div styleName="file.navbar-first">
          <div>
            <Upload />
          </div>
          {!tabular ? (
            <React.Fragment>
              <div>
                <Edit />
              </div>
              <div>
                <Button
                  disabled={!isSelected}
                  onClick={this.handleDownload}
                  icon
                  labelPosition="left"
                  secondary
                  basic
                >
                  <Icon name="download" />
                  Download
                </Button>
              </div>
              <div>
                <Button
                  disabled={!isSelected}
                  onClick={this.showDeleteModal}
                  icon
                  labelPosition="left"
                  negative
                  basic
                >
                  <Icon name="delete" />
                  Delete
                </Button>
              </div>
            </React.Fragment>
          ) : null}
          {isDelete && isSelected ? (
            <Modal size="large" open={isDelete} onClose={this.closeDeleteModal}>
              <Modal.Header>
                Do you really want to delete "{selectedData.fileName}"
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
        </div>
      </Segment>
    )
  }
}

const mapStateToProps = state => {
  return {
    isSelected: state.files.isSelected,
    selectedData: state.files.selectedData,
    topLevel: state.files.topLevel,
    currentFolder: state.files.currentFolder,
    lastVisited: state.files.lastVisited,
    tabular: state.files.tabular
  }
}

const mapDispatchToProps = dispatch => {
  return {
    lastVisitedAct: data => {
      dispatch(lastVisited(data))
    },
    fetchFilesFolder: (data, callback) => {
      dispatch(fetchFilesFolder(data, callback))
    },
    tabulation: bool => {
      dispatch(tabulation(bool))
    },
    unsetSelected: () => {
      dispatch(unsetSelected())
    },
    deleteFile: (pk, callback) => {
      dispatch(deleteFile(pk, callback))
    },
    fetchFiles: () => {
      dispatch(fetchFiles())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar)
