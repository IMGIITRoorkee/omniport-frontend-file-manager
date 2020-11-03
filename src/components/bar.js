import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Button, Icon, Modal } from 'semantic-ui-react'
import { tabulation } from '../actions/itemActions'
import Upload from './app-upload'
// import Edit from './edit-file'
import ConfirmModal from './confirmModal'

import file from './css/file.css'
import FolderFormModal from './folderFormModal'
import EditFileModal from './edit-modal'
import { withRouter } from 'react-router-dom'
import { deleteFolder, setActiveFolder } from '../actions/folderActions'
import { deleteFile } from '../actions/fileActions'
import { setActiveItems } from '../actions/itemActions'
import { ITEM_TYPE } from '../constants'
class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDelete: false,
      showEditFileModal: false,
      showFolderFormModal: false,
      editFolder: {},
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
    this.props.history.goBack()
  }
  successBackCallback = () => {
    const { currentFolder, lastVisitedAct } = this.props
    lastVisitedAct(currentFolder)
  }
  handleTabulation = () => {
    const { tabulation, tabular, setActiveItems } = this.props
    tabulation(!tabular)
    setActiveItems([])
  }

  handleDelete = () => {
    const { deleteFolder, activeItems, deleteFile } = this.props
    if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.folder) {
      deleteFolder(activeItems[0].obj.id)
    }
    if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.file) {
      deleteFile(activeItems[0].obj.id)
    }
    setActiveItems([])
    this.setState({ isDelete: false })
  }
  successCallback = () => {
    this.props.fetchFiles()
    this.setState({
      isDelete: false,
    })
  }
  render() {
    const { tabular, activeItems } = this.props
    const {
      isDelete,
      showEditFileModal,
      showFolderFormModal,
      editFolder,
    } = this.state
    return (
      <Segment styleName="file.navbar">
        <div styleName="file.navbar-first">
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
          <div>
            <Button
              labelPosition="left"
              icon
              primary
              basic
              onClick={() => {
                this.setState({ editFolder: {}, showFolderFormModal: true })
              }}
            >
              <Icon name="plus" />
              Create Folder
            </Button>
          </div>
          {!tabular ? (
            <React.Fragment>
              <div>
                <Button
                  disabled={activeItems.length !== 1}
                  onClick={() => {
                    if (activeItems[0].type === ITEM_TYPE.file) {
                      this.setState({ showEditFileModal: true })
                    } else {
                      this.setState({
                        editFolder: activeItems[0].obj,
                        showFolderFormModal: true,
                      })
                    }
                  }}
                  icon
                  labelPosition="left"
                  primary
                  basic
                >
                  <Icon name="edit" />
                  Edit
                </Button>
              </div>
              <div>
                <Button
                  disabled={
                    activeItems.length !== 1 ||
                    activeItems[0].type !== ITEM_TYPE.file
                  }
                  onClick={this.handleDownload}
                  icon
                  labelPosition="left"
                  primary
                  basic
                >
                  <Icon name="download" />
                  Download
                </Button>
              </div>
              <div>
                <Button
                  disabled={activeItems.length !== 1}
                  onClick={() => {
                    this.setState({ isDelete: true })
                  }}
                  icon
                  labelPosition="left"
                  primary
                  basic
                >
                  <Icon name="delete" />
                  Delete
                </Button>
              </div>
            </React.Fragment>
          ) : null}
          {isDelete && (
            <ConfirmModal
              show={isDelete}
              handleClose={() => {
                this.setState({ isDelete: false })
              }}
              handleSubmit={this.handleDelete}
              item={activeItems[0].type}
            />
          )}
          {showEditFileModal && (
            <EditFileModal
              showModal={showEditFileModal}
              close={() => {
                this.setState({ showEditFileModal: false })
              }}
            />
          )}
          <FolderFormModal
            editFormObj={editFolder}
            showModal={showFolderFormModal}
            setShowModal={value => {
              this.setState({ showFolderFormModal: value })
            }}
          />
        </div>
      </Segment>
    )
  }
}

const mapStateToProps = state => {
  return {
    tabular: state.items.tabular,
    currentFolder: state.folders.selectedFolder,
    activeItems: state.items.activeItems,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    tabulation: bool => {
      dispatch(tabulation(bool))
    },
    deleteFile: id => {
      dispatch(deleteFile(id))
    },
    deleteFolder: id => {
      dispatch(deleteFolder(id))
    },
    setActiveFolder: obj => {
      dispatch(setActiveFolder(obj))
    },
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Bar))
