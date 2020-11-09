import React, { Component } from 'react'
import { connect } from 'react-redux'
import Filecard from './file-card'

import grid from './css/grid-view.css'
import FolderCard from './folder-card'
import { setActiveItems } from '../actions/itemActions'
import { Divider, Menu, Popup } from 'semantic-ui-react'
import ConfirmModal from './confirmModal'
import EditModal from './edit-modal'
import {
  deleteFolder,
  editFolder,
  getFolder,
  deleteFolder,
  bulkDeleteFolders
} from '../actions/folderActions'
import {
  deleteFile,
  editFile,
  deleteFile,
  bulkDeleteFiles
} from '../actions/fileActions'
import { getStarredItems } from '../actions/itemActions'
import { ITEM_TYPE } from '../constants'
import FolderFormModal from './folderFormModal'
import ShareItemModal from './shareItemModal'

function createContextFromEvent(e) {
  const left = e.clientX
  const top = e.clientY
  const right = left + 1
  const bottom = top + 1

  return {
    getBoundingClientRect: () => ({
      left,
      top,
      right,
      bottom,

      height: 0,
      width: 0
    })
  }
}
class GridView extends Component {
  constructor(props) {
    super(props)
    this.folderContainerRef = React.createRef()
    this.contextRef = React.createRef()
    this.fileContainerRef = React.createRef()
    this.state = {
      isPopupOpen: false,
      showFileEditModal: false,
      showDeleteModal: false,
      showFolderFormModal: false,
      showShareItemModal: false,
      editFolder: {}
    }
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     prevState.isPopupOpen !== this.props.isPopupOpen &&
  //     JSON.stringify(prevProps.activeItems[0]) !==
  //       JSON.stringify(this.props.activeItems[0])
  //   ) {
  //     this.setState({ isPopupOpen: true })
  //   }
  // }
  getOptions = () => {
    const { activeItems } = this.props
    if (activeItems.length == 1) {
      return activeItems[0].type === ITEM_TYPE.file
        ? [
            { key: '1', label: 'Edit', icon: 'edit' },
            { key: '2', label: 'Download', icon: 'download' },
            { key: '3', label: 'Delete', icon: 'delete' },
            { key: '5', label: 'Share', icon: 'share' },
            {
              key: '6',
              label: activeItems[0].obj.starred
                ? 'Remove from starred'
                : 'Add to starred',
              icon: activeItems[0].obj.starred ? 'star' : 'star outline'
            }
          ]
        : [
            { key: '4', label: 'Edit', icon: 'edit' },
            { key: '3', label: 'Delete', icon: 'delete' },
            { key: '5', label: 'Share', icon: 'share' },
            {
              key: '6',
              label: activeItems[0].obj.starred
                ? 'Remove from starred'
                : 'Add to starred',
              icon: activeItems[0].obj.starred ? 'star' : 'star outline'
            }
          ]
    } else return [{ key: '3', label: 'Delete', icon: 'delete' }]
  }
  handleOptions = {
    1: () => {
      this.setState({ showFileEditModal: true })
    },
    2: () => {},
    3: () => {
      this.setState({ showDeleteModal: true })
    },
    4: () => {
      this.setState({
        editFolder: this.props.activeItems[0].obj,
        showFolderFormModal: true
      })
    },
    5: () => {
      this.setState({ showShareItemModal: true })
    },
    6: () => {
      const { activeItems, editFile, editFolder } = this.props
      var formdata = new FormData()
      formdata.append('starred', !activeItems[0].obj.starred)
      if (activeItems[0].type == 'file') {
        editFile(activeItems[0].obj.id, formdata, this.handleStarSuccess)
      } else {
        editFolder(activeItems[0].obj.id, formdata, this.handleStarSuccess)
      }
    }
  }

  handleStarSuccess = () => {
    const {
      activeItems,
      setActiveItems,
      getStarredItems,
      currentFolder
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

  handleReset = e => {
    if (
      e.target === this.folderContainerRef.current ||
      e.target === this.fileContainerRef.current
    ) {
      this.props.setActiveItems([])
    }
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
    this.setState({ showDeleteModal: false })
  }

  render() {
    const { currentFolder, activeItems, viewingSharedItems } = this.props
    const {
      isPopupOpen,
      showDeleteModal,
      showFileEditModal,
      showFolderFormModal,
      editFolder,
      showShareItemModal
    } = this.state
    return (
      <div
        ref={this.rootRef}
        onContextMenu={e => {
          e.preventDefault()
          if (
            e.target === this.folderContainerRef.current ||
            e.target === this.fileContainerRef.current
          ) {
            return
          }
          this.contextRef = createContextFromEvent(e)
          if (isPopupOpen) {
            this.setState({ isPopupOpen: false })
          } else {
            this.setState({ isPopupOpen: true })
          }
        }}
      >
        <div
          styleName='grid.view-parent'
          ref={this.folderContainerRef}
          onClick={this.handleReset}
        >
          {currentFolder &&
            currentFolder.folders &&
            currentFolder.folders.map((folder, index) => (
              <FolderCard
                key={index}
                index={index}
                id={folder.id}
                folderName={folder.folderName}
                isStarred={folder.starred}
                folder={folder}
              />
            ))}
        </div>
        <Divider />
        <div
          styleName='grid.view-parent'
          ref={this.fileContainerRef}
          onClick={this.handleReset}
        >
          {currentFolder &&
            currentFolder.files &&
            currentFolder.files.map((file, index) => (
              <Filecard key={index} index={index} file={file} />
            ))}
        </div>
        <Popup
          basic
          context={this.contextRef}
          onClose={() => this.setState({ isPopupOpen: false })}
          open={isPopupOpen}
        >
          <Menu vertical>
            {this.getOptions().map(option => (
              <Menu.Item
                key={option.key}
                name={option.label}
                icon={option.icon ? option.icon : false}
                onClick={() => {
                  this.setState({ isPopupOpen: false })
                  this.handleOptions[option.key]()
                }}
              />
            ))}
          </Menu>
        </Popup>
        <ConfirmModal
          show={showDeleteModal}
          handleClose={() => {
            this.setState({ showDeleteModal: false })
          }}
          handleSubmit={() => {
            this.handleDelete()
          }}
          type='remove'
          item={Array.from(new Set(activeItems.map(item => item.type))).join(
            ' and '
          )}
          itemList={activeItems.map(
            item => item.obj.fileName || item.obj.folderName
          )}
        />
        <EditModal
          showModal={showFileEditModal}
          close={() => {
            this.setState({ showFileEditModal: false })
          }}
        />
        <ShareItemModal
          showModal={showShareItemModal}
          close={() => {
            this.setState({ showShareItemModal: false })
          }}
          filemanager={
            this.props.currentFolder
              ? this.props.currentFolder.filemanagername
              : ''
          }
        />
        <FolderFormModal
          showModal={showFolderFormModal}
          editFormObj={editFolder}
          setShowModal={value => {
            this.setState({ showFolderFormModal: value })
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentFolder: state.folders.selectedFolder,
    activeItems: state.items.activeItems,
    viewingSharedItems: state.items.viewingSharedItems
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveItems: items => dispatch(setActiveItems(items)),
    deleteFile: pk => {
      dispatch(deleteFile(pk))
    },
    deleteFolder: id => {
      dispatch(deleteFolder(id))
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

export default connect(mapStateToProps, mapDispatchToProps)(GridView)
