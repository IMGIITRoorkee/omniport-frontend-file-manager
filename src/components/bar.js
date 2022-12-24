import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Segment,
  Button,
  Icon,
  Modal,
  Dropdown,
  TabPane,
  Checkbox
} from 'semantic-ui-react'

import {
  getStarredItems,
  tabulation,
  setActiveItems,
  setShowPublicSharedItems
} from '../actions/itemActions'
import Upload from './app-upload'
import ConfirmModal from './confirmModal'
import ZipUpload from './zip-upload'
import file from './css/file.css'
import FolderFormModal from './folderFormModal'
import ShareItemModal from './shareItemModal'
import EditFileModal from './edit-modal'
import { Link, withRouter } from 'react-router-dom'
import {
  deleteFolder,
  setActiveFolder,
  editFolder,
  bulkDeleteFolders,
  setCurrentFolder
} from '../actions/folderActions'
import { deleteFile, editFile, bulkDeleteFiles, addFileToCopy, pasteActiveFile } from '../actions/fileActions'
import { BASE_URL, ITEM_TYPE } from '../constants'
import ItemDetailsModal from './item-detail-modal'
import { handleDownload } from '../helpers/helperfunctions'

class Bar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDelete: false,
      showEditFileModal: false,
      showFolderFormModal: false,
      showShareItemModal: false,
      showDetailsModal: false,
      selectAllItems: false,
      editFolder: {}
    }
  }
  componentDidUpdate(prevProps) {
    const { activeItems, currentFolder } = this.props
    JSON.stringify(prevProps.activeItems) !== JSON.stringify(activeItems)
      ? this.setState({
          selectAllItems: currentFolder.files.length + currentFolder.folders.length === activeItems.length
        })
      : ''
  }
  handleStarClick = e => {
    e.stopPropagation()
    const { activeItems, editFile, editFolder } = this.props
    var formdata = new FormData()
    formdata.append('starred', !activeItems[0].obj.starred)
    if (activeItems[0].type == 'file') {
      editFile(activeItems[0].obj.id, formdata, this.handleStarSuccess)
    } else {
      editFolder(activeItems[0].obj.id, formdata, this.handleStarSuccess)
    }
  }
  handleCopy = e => {
    e.stopPropagation()
    const { activeItems, addFileToCopy } = this.props
    addFileToCopy(activeItems[0].obj.id)
  }
  handlePaste = e => {
    e.stopPropagation()
    const { fileToCopy, currentFolder, pasteActiveFile } = this.props
    pasteActiveFile(fileToCopy, currentFolder)
  }
  handleStarSuccess = newOjb => {
    const {
      activeItems,
      setActiveItems,
      getStarredItems,
      currentFolder
    } = this.props
    const oldCurrentFolder = Object.assign({}, currentFolder)
    const oldfiles = oldCurrentFolder.files
    const oldFolders = oldCurrentFolder.folders

    if (currentFolder.type && currentFolder.type == 'starred') {
      getStarredItems(currentFolder.filemanager)
    } else {
      if (activeItems[0].type == 'file') {
        const ind = oldfiles.findIndex(ele => ele.id === newOjb.id)
        oldfiles[ind].starred = newOjb.starred
        oldCurrentFolder.files = oldfiles
        setCurrentFolder(oldCurrentFolder)
        setActiveItems([{ type: ITEM_TYPE.file, obj: newOjb }])
      } else {
        const ind = oldFolders.findIndex(ele => ele.id === newOjb.id)
        oldFolders[ind].starred = newOjb.starred
        oldCurrentFolder.folders = oldFolders
        setCurrentFolder(oldCurrentFolder)
        setActiveItems([{ type: ITEM_TYPE.folder, obj: newOjb }])
      }
    }
  }

  handleBack = () => {
    this.props.history.goBack()
  }
  successBackCallback = () => {
    const { currentFolder, lastVisitedAct } = this.props
    lastVisitedAct(currentFolder)
  }
  handleTabulation = e => {
    e.stopPropagation()
    const { tabulation, tabular, setActiveItems } = this.props
    tabulation(!tabular)
    setActiveItems([])
  }

  selectAllItems = (data) => {
    const { currentFolder, setActiveItems, activeItems } = this.props
    if (data) {
      this.setState({ selectAllItems: data })
      let newActiveItems = []
      setActiveItems([])
      currentFolder.files.map(file => {
        newActiveItems = [
          ...newActiveItems,
          { type: ITEM_TYPE.file, obj: file }
        ]
      })
      currentFolder.folders.map(folder => {
        newActiveItems = [
          ...newActiveItems,
          { type: ITEM_TYPE.folder, obj: folder }
        ]
      })
      setActiveItems([...newActiveItems])
    } else {
      this.setState({ selectAllItems: data })
      setActiveItems([])
    }
  }

  toggleShowPublicSharedItems = data => {
    const { setShowPublicSharedItems } = this.props
    setShowPublicSharedItems(data)
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
  render () {
    const {
      tabular,
      activeItems,
      currentFolder,
      viewingSharedItems,
      viewingStarredItems,
      isFilemanagerPublic,
      showPublicSharedItems, 
      fileToCopy
    } = this.props
    const {
      isDelete,
      showEditFileModal,
      showFolderFormModal,
      editFolder,
      showShareItemModal,
      showDetailsModal,
      selectAllItems
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
                color='blue'
                to={`${BASE_URL}/${this.props.match.params.filemanager}/`}
              >
                <Icon name='home' />
                Home
              </Button>
            </div>
          ) : (
            <div styleName='file.crud-icon'>
              <Button.Group color='blue'>
                <Dropdown
                  text='New'
                  icon='plus circle icon'
                  floating
                  labeled
                  button
                  className='icon'
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        this.setState({
                          editFolder: {},
                          showFolderFormModal: true
                        })
                      }}
                      icon='folder'
                      text='Create folder'
                    />
                    <Upload />
                    <ZipUpload />
                  </Dropdown.Menu>
                </Dropdown>
              </Button.Group>
            </div>
          )}
          <div styleName='file.options'>
            {viewingSharedItems || viewingStarredItems ? (
              <span styleName='file.non-active' onClick={e=>{
                e.stopPropagation()
                this.props.history.push(`${BASE_URL}/${this.props.match.params.filemanager}/`)
              }}>All Files</span>
            ) : (
              <span styleName='file.active'>All Files</span>
            )}
            {viewingSharedItems ? (
              <span styleName='file.active'>Shared With Me</span>
            ) : (
              <span styleName='file.non-active' onClick={e=>{
                e.stopPropagation()
                this.props.history.push(`${BASE_URL}/${this.props.match.params.filemanager}/shared_with_me/`)
              }}>Shared With Me</span>
            )}
            {viewingStarredItems ? (
              <span styleName='file.active'>Starred</span>
            ) : (
              <span styleName='file.non-active' onClick={e=>{
                e.stopPropagation()
                this.props.history.push(`${BASE_URL}/${this.props.match.params.filemanager}/all_starred_items/`)
              }}>Starred</span>
            )}
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
          {activeItems.length == 1 && (
            <div styleName='file.crud-icon'>
              <Button
                onClick={e => {
                  e.stopPropagation()
                  this.setState({ showDetailsModal: true })
                }}
                title='View details'
                icon='info'
                color='blue'
                inverted
                circular
              />
            </div>
          )}
          {activeItems.length == 1 && !viewingSharedItems && (
            <div styleName='file.crud-icon'>
              <Button
                onClick={e => {
                  e.stopPropagation()
                  this.setState({ showShareItemModal: true })
                }}
                icon='share'
                color='blue'
                inverted
                circular
              />
            </div>
          )}
          {activeItems.length == 1 &&
            activeItems[0].type === ITEM_TYPE.file &&
            !viewingSharedItems && (
              <div styleName='file.crud-icon'>
                <Button
                  onClick={e => {
                    e.stopPropagation()
                    this.setState({ showEditFileModal: true })
                  }}
                  icon='edit'
                  color='blue'
                  inverted
                  circular
                />
              </div>
            )}
          {activeItems.length > 0 &&
            !activeItems.some(item => item.type === ITEM_TYPE.folder) &&
            !viewingSharedItems && (
              <div styleName='file.crud-icon'>
                <Button
                  onClick={handleDownload}
                  icon='download'
                  color='blue'
                  inverted
                  circular
                />
              </div>
            )}
          {activeItems.length > 0 &&
            !activeItems.some(item => item.type === ITEM_TYPE.folder) &&
            !viewingSharedItems && (
              <div styleName='file.crud-icon'>
                <Button
                  onClick={this.handleCopy}
                  icon='copy'
                  color='blue'
                  inverted
                  circular
                />
              </div>
            )}
          {activeItems.length == 0 && !viewingSharedItems && fileToCopy != null && (
            <div styleName='file.crud-icon'>
              <Button
              onClick={this.handlePaste}
                icon='paste'
                color='blue'
                inverted
                circular
              />
            </div>
          )}
          {activeItems.length > 0 && !viewingSharedItems && (
            <div styleName='file.crud-icon'>
              <Button
                onClick={e => {
                  e.stopPropagation()
                  this.setState({ isDelete: true })
                }}
                icon='trash'
                color='red'
                inverted
                circular
              />
            </div>
          )}
          {currentFolder.type == 'shared' && (
            <div styleName='file.crud-icon'>
              <Button
                onClick={() =>
                  this.toggleShowPublicSharedItems(!showPublicSharedItems)
                }
                icon={showPublicSharedItems ? 'eye' : 'eye slash'}
                color='blue'
                title={
                  showPublicSharedItems
                    ? 'Hide public folders and files'
                    : 'Show public folders and files'
                }
                inverted
                circular
              />
            </div>
          )}
          {currentFolder.type!='shared' && <div styleName='file.crud-icon'>
            <Button
              onClick={e => {
                e.stopPropagation()
                this.selectAllItems(!this.state.selectAllItems)
              }}
              color='blue'
            >
              {this.state.selectAllItems && (
                <Icon name='check' color = 'green' />
              )}
              Select all
            </Button>
          </div>}
          <div styleName='file.crud-icon'>
            <Button
              circular
              onClick={this.handleTabulation}
              icon={tabular ? 'columns' : 'table'}
              color='blue'
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
          <ItemDetailsModal
            showModal={showDetailsModal}
            close={() => {
              this.setState({ showDetailsModal: false })
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
    viewingSharedItems: state.items.viewingSharedItems,
    viewingStarredItems: state.items.viewingStarredItems,
    isFilemanagerPublic: state.filemanagers.isFilemanagerPublic,
    showPublicSharedItems: state.items.showPublicSharedItems,
    fileToCopy: state.files.fileToCopy
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

    setCurrentFolder: data => dispatch(setCurrentFolder(data)),
    getStarredItems: filemanager => {
      dispatch(getStarredItems(filemanager))
    },
    bulkDeleteFolders: data => {
      dispatch(bulkDeleteFolders(data))
    },
    bulkDeleteFiles: data => {
      dispatch(bulkDeleteFiles(data))
    },
    setShowPublicSharedItems: data => {
      dispatch(setShowPublicSharedItems(data))
    },
    addFileToCopy: id => {
      dispatch(addFileToCopy(id))
    },
    pasteActiveFile: (id, destination) => {
      dispatch(pasteActiveFile(id, destination))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Bar))
