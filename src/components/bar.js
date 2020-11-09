import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Button, Icon, Modal } from 'semantic-ui-react'

import {
  getStarredItems,
  tabulation,
  setActiveItems
} from '../actions/itemActions'
import Upload from './app-upload'
import ConfirmModal from './confirmModal'
import file from './css/file.css'
import FolderFormModal from './folderFormModal'
import ShareItemModal from './shareItemModal'
import EditFileModal from './edit-modal'
import { Link, withRouter } from 'react-router-dom'
import {
  deleteFolder,
  setActiveFolder,
  editFolder,
  getFolder,
  bulkDeleteFolders
} from '../actions/folderActions'
import { deleteFile, editFile, bulkDeleteFiles } from '../actions/fileActions'
import { ITEM_TYPE } from '../constants'
class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDelete: false,
      showEditFileModal: false,
      showFolderFormModal: false,
      showShareItemModal: false,
      editFolder: {}
    }
  }
  handleStarClick = () => {
    const { activeItems, editFile, editFolder } = this.props
    var formdata = new FormData()
    formdata.append('starred', !activeItems[0].obj.starred)
    if (activeItems[0].type == 'file') {
      editFile(activeItems[0].obj.id, formdata, this.handleStarSuccess)
    } else {
      editFolder(activeItems[0].obj.id, formdata, this.handleStarSuccess)
    }
  }
  handleStarSuccess = () => {
    const {
      activeItems,
      currentFolder,
      getStarredItems,
      setActiveItems
    } = this.props
    if (currentFolder.type && currentFolder.type == 'starred') {
      getStarredItems(currentFolder.filemanager)
    } else {
      if (activeItems[0].type == 'file') {
        this.props.getFolder(activeItems[0].obj.folder)
        setActiveItems([])
      } else {
        this.props.getFolder(activeItems[0].obj.parent)
        setActiveItems([])
      }
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
    const {
      deleteFolder,
      activeItems,
      deleteFile,
      bulkDeleteFolders,
      bulkDeleteFiles,
      setActiveItems
    } = this.props
    if (activeItems.length === 1) {
      if (
        activeItems.length === 1 &&
        activeItems[0].type === ITEM_TYPE.folder
      ) {
        deleteFolder(activeItems[0].obj.id)
      }
      if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.file) {
        deleteFile(activeItems[0].obj.id)
      }
    } else if (activeItems.length > 1) {
      const folders = []
      const files = []
      for (const item of activeItems) {
        if (item.type === ITEM_TYPE.file) {
          files.push(item.obj.id)
        } else {
          folders.push(item.obj.id)
        }
      }
      if (folders.length > 0) {
        bulkDeleteFolders({ folder_id_arr: folders })
      }
      if (files.length > 0) {
        bulkDeleteFiles({ fileIdArr: files })
      }
    }
    setActiveItems([])
    this.setState({ isDelete: false })
  }
  successCallback = () => {
    this.props.fetchFiles()
    this.setState({
      isDelete: false
    })
  }
  render() {
    const {
      tabular,
      activeItems,
      currentFolder,
      viewingSharedItems
    } = this.props
    const {
      isDelete,
      showEditFileModal,
      showFolderFormModal,
      editFolder,
      showShareItemModal
    } = this.state
    return (
      <Segment styleName='file.navbar'>
        <div styleName='file.navbar-first'>
          {viewingSharedItems || currentFolder.type == 'starred' ? (
            <div styleName='file.crud-icon'>
              <Button
                as={Link}
                icon
                labelPosition='left'
                color='grey'
                to={`/file-manager/${this.props.match.params.filemanager}/`}
              >
                <Icon name='home' />
                Home
              </Button>
            </div>
          ) : (
            <div styleName='file.crud-icon'>
              <Upload />
            </div>
          )}
          <div styleName='file.crud-icon'>
            <Button
              as={Link}
              icon
              labelPosition='left'
              color='grey'
              to={`/file-manager/${this.props.match.params.filemanager}/shared_with_me/`}
            >
              <Icon name='share' />
              Shared With Me
            </Button>
          </div>
          <div styleName='file.crud-icon'>
            <Button
              as={Link}
              icon
              labelPosition='left'
              color='grey'
              to={`/file-manager/${this.props.match.params.filemanager}/all_starred_items/`}
            >
              <Icon name='star' />
              Starred
            </Button>
          </div>
        </div>

        <div styleName='file.navbar-first'>
          {activeItems.length == 1 && !viewingSharedItems && (
            <div styleName='file.crud-icon'>
              <Button
                onClick={this.handleStarClick}
                title={
                  activeItems[0].obj.starred
                    ? 'Remove from starred'
                    : 'Add to starred'
                }
                icon={activeItems[0].obj.starred ? 'star' : 'star outline'}
                color='blue'
                inverted
                circular
              />
            </div>
          )}
          {activeItems.length == 1 && !viewingSharedItems && (
            <div styleName='file.crud-icon'>
              <Button
                onClick={() => this.setState({ showShareItemModal: true })}
                icon='share'
                color='blue'
                inverted
                circular
              />
            </div>
          )}
          {activeItems.length == 1 && !viewingSharedItems && (
            <div styleName='file.crud-icon'>
              <Button
                onClick={() => {
                  if (activeItems[0].type === ITEM_TYPE.file) {
                    this.setState({ showEditFileModal: true })
                  } else {
                    this.setState({
                      editFolder: activeItems[0].obj,
                      showFolderFormModal: true
                    })
                  }
                }}
                icon='edit'
                color='blue'
                inverted
                circular
              />
            </div>
          )}
          {activeItems.length == 1 && !viewingSharedItems && (
            <div styleName='file.crud-icon'>
              <Button
                disabled={
                  activeItems.length !== 1 ||
                  activeItems[0].type !== ITEM_TYPE.file
                }
                onClick={this.handleDownload}
                icon='download'
                color='blue'
                inverted
                circular
              />
            </div>
          )}
          {activeItems.length > 0 && !viewingSharedItems && (
            <div styleName='file.crud-icon'>
              <Button
                onClick={() => {
                  this.setState({ isDelete: true })
                }}
                icon='delete'
                color='red'
                inverted
                circular
              />
            </div>
          )}

          <div styleName='file.crud-icon'>
            <Button
              icon='plus'
              circular
              inverted
              color='blue'
              onClick={() => {
                this.setState({ editFolder: {}, showFolderFormModal: true })
              }}
            />
          </div>
          <div styleName='file.crud-icon'>
            <Button
              circular
              onClick={this.handleTabulation}
              icon={tabular ? 'columns' : 'table'}
              color='grey'
            />
          </div>
          {isDelete && (
            <ConfirmModal
              show={isDelete}
              handleClose={() => {
                this.setState({ isDelete: false })
              }}
              handleSubmit={this.handleDelete}
              item={Array.from(
                new Set(activeItems.map(item => item.type))
              ).join(' and ')}
              itemList={activeItems.map(
                item => item.obj.fileName || item.obj.folderName
              )}
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
          <ShareItemModal
            showModal={showShareItemModal}
            close={() => {
              this.setState({ showShareItemModal: false })
            }}
            filemanager={this.props.match.params.filemanager}
          />
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
    viewingSharedItems: state.items.viewingSharedItems
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
    editFile: (id, formdata, callback) => {
      dispatch(editFile(id, formdata, callback))
    },
    editFolder: (id, formdata, callback) => {
      dispatch(editFolder(id, formdata, callback))
    },
    getFolder: id => {
      dispatch(getFolder(id))
    },
    getStarredItems: filemanager => {
      dispatch(getStarredItems(filemanager))
    },
    bulkDeleteFolders: data => {
      dispatch(bulkDeleteFolders(data))
    },
    bulkDeleteFiles: data => {
      dispatch(bulkDeleteFiles(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Bar))
