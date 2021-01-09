import React, { Component } from 'react'
import { connect } from 'react-redux'
import Filecard from './file-card'

import grid from './css/grid-view.css'
import FolderCard from './folder-card'
import { setActiveItems } from '../actions/itemActions'
import { Divider } from 'semantic-ui-react'

import { ITEM_TYPE, IMAGE_EXTENSIONS } from '../constants'

import MultipleImagesModal from './multipleImageModal'
import PopupView from './popup'
import {
  createContextFromEvent,
  openInNewTab
} from '../helpers/helperfunctions'

class GridView extends Component {
  constructor(props) {
    super(props)
    this.contextRef = React.createRef()
    this.state = {
      isPopupOpen: false,
      showFileEditModal: false,
      showDeleteModal: false,
      showFolderFormModal: false,
      showShareItemModal: false,
      isDetailViewOpen: false,
      showDetailsModal: false
    }
  }

  handleFileDoubleClick = (file, index) => {
    const {
      currentFolder,
      setActiveItems,
      filemanagerIntegrationMode
    } = this.props
    if (filemanagerIntegrationMode) {
      window.opener.postMessage(
        {
          file: file.upload,
          fileName: file.fileName,
          path: file.path,
          filemanager_name: currentFolder.filemanagername
        },
        '*'
      )
      window.close()
    } else {
      setActiveItems([{ type: ITEM_TYPE.file, obj: file }])
      if (IMAGE_EXTENSIONS.includes(file.extension)) {
        this.setState({ isDetailViewOpen: true })
      } else {
        openInNewTab()
      }
    }
  }

  render() {
    const { currentFolder } = this.props
    const { isPopupOpen, isDetailViewOpen } = this.state
    return (
      <div
        onContextMenu={e => {
          e.preventDefault()
          this.contextRef = createContextFromEvent(e)
          if (e.detail === 'folder-card' || e.detail === 'file-card') {
            if (isPopupOpen) {
              this.setState({ isPopupOpen: false })
            } else {
              this.setState({ isPopupOpen: true })
            }
          }
        }}
      >
        <div styleName='grid.view-parent' onClick={this.handleReset}>
          {currentFolder &&
            currentFolder.folders &&
            currentFolder.folders
              .sort(
                ({ id: previousID }, { id: currentID }) =>
                  previousID - currentID
              )
              .map((folder, index) => (
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
        {currentFolder.folders.length == 0 ||
        currentFolder.files.length == 0 ? (
          ''
        ) : (
          <Divider />
        )}
        <div styleName='grid.view-parent' onClick={this.handleReset}>
          {currentFolder &&
            currentFolder.files &&
            currentFolder.files
              .sort(
                ({ id: previousID }, { id: currentID }) =>
                  previousID - currentID
              )
              .map((file, index) => (
                <Filecard
                  key={index}
                  index={index}
                  file={file}
                  handleDoubleClick={this.handleFileDoubleClick}
                />
              ))}
        </div>
        <PopupView
          contextRef={this.contextRef}
          isPopupOpen={isPopupOpen}
          setPopupOpen={value => this.setState({ isPopupOpen: value })}
        />
        <MultipleImagesModal
          show={isDetailViewOpen}
          onHide={() => {
            this.setState({ isDetailViewOpen: false })
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
    filemanagerIntegrationMode: state.filemanagers.filemanagerIntegrationMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveItems: items => dispatch(setActiveItems(items))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GridView)
