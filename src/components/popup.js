import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Popup, Menu } from 'semantic-ui-react'

import EditModal from './edit-modal'

import index from './css/index.css'
import popup from './css/popup.css'

import {
  deleteFolder,
  editFolder,
  bulkDeleteFolders,
  setCurrentFolder
} from '../actions/folderActions'
import { deleteFile, editFile, bulkDeleteFiles } from '../actions/fileActions'
import { setActiveItems, getStarredItems } from '../actions/itemActions'
import ConfirmModal from './confirmModal'
import ItemDetailModal from './item-detail-modal'
import ShareItemModal from './shareItemModal'
import FolderFormModal from './folderFormModal'
import { ITEM_TYPE } from '../constants'
import { handleDownload } from '../helpers/helperfunctions'

class PopupView extends Component {
  constructor(props, ref) {
    super(props)
    this.state = {
      showFileEditModal: false,
      showDeleteModal: false,
      showFolderFormModal: false,
      showShareItemModal: false,
      editFolder: {},
      isDetailViewOpen: false,
      showDetailsModal: false
    }
  }

  getOptions = () => {
    const { activeItems, viewingSharedItems, isFilemanagerPublic } = this.props
    const options = [
      {
        key: '1',
        label: 'Edit',
        icon: 'edit',
        condition:
          !viewingSharedItems &&
          activeItems.length == 1 &&
          activeItems[0].type === ITEM_TYPE.file
      },
      {
        key: '2',
        label: 'Download',
        icon: 'download',
        condition: !activeItems.some(item => item.type === ITEM_TYPE.folder)
      },
      {
        key: '3',
        label: 'Delete',
        icon: 'delete',
        condition: !viewingSharedItems
      },
      {
        key: '4',
        label: 'Edit',
        icon: 'edit',
        condition:
          !viewingSharedItems &&
          activeItems.length == 1 &&
          activeItems[0].type == ITEM_TYPE.folder
      },
      {
        key: '5',
        label: 'Share',
        icon: 'share',
        condition:
          !viewingSharedItems &&
          activeItems.length == 1 &&
          (!isFilemanagerPublic || activeItems[0].type === ITEM_TYPE.file)
      },
      {
        key: '7',
        label: 'View details',
        icon: 'info',
        condition: activeItems.length == 1
      }
    ]
    if (activeItems.length == 1) {
      options.push({
        key: '6',
        label: activeItems[0].obj.starred
          ? 'Remove from starred'
          : 'Add to starred',
        icon: activeItems[0].obj.starred ? 'star' : 'star outline',
        condition: !viewingSharedItems && activeItems.length == 1
      })
    }
    return options
  }
  handleOptions = {
    1: () => {
      this.setState({ showFileEditModal: true })
    },
    2: () => {
      handleDownload()
    },
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
    },
    7: () => {
      this.setState({ showDetailsModal: true })
    }
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
      if (activeItems[0].type === ITEM_TYPE.folder) {
        deleteFolder(activeItems[0].obj.id)
      } else {
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
    const {
      showDeleteModal,
      showFileEditModal,
      showFolderFormModal,
      editFolder,
      showShareItemModal,
      showDetailsModal
    } = this.state
    const { activeItems, contextRef, isPopupOpen, setPopupOpen } = this.props
    const options = this.getOptions().filter(option => option.condition)
    return (
      <React.Fragment>
        <Popup
          basic
          context={contextRef}
          onClose={() => setPopupOpen(false)}
          open={isPopupOpen && Boolean(options.length)}
        >
          <Menu vertical>
            {options.map(option => (
              <Menu.Item
                key={option.key}
                name={option.label}
                icon={option.icon ? option.icon : false}
                onClick={e => {
                  e.stopPropagation()
                  setPopupOpen(false)
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
        <ItemDetailModal
          showModal={showDetailsModal}
          close={() => {
            this.setState({ showDetailsModal: false })
          }}
          filemanager={
            this.props.currentFolder
              ? this.props.currentFolder.filemanagername
              : ''
          }
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
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentFolder: state.folders.selectedFolder,
    activeItems: state.items.activeItems,
    viewingSharedItems: state.items.viewingSharedItems,
    isFilemanagerPublic: state.filemanagers.isFilemanagerPublic
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
    setCurrentFolder: data => dispatch(setCurrentFolder(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupView)
