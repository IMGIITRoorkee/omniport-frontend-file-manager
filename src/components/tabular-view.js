import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

import { getModifiedDate } from '../utils/get-modified-date'
import { getTheme } from 'formula_one'
import PopupView from './popup'

import index from './css/index.css'
import { getStarredItems, setActiveItems } from '../actions/itemActions'
import { BASE_URL, FILE_TYPES, IMAGE_EXTENSIONS, ITEM_TYPE } from '../constants'
import { FileIcon } from 'react-file-icon'
import {
  createContextFromEvent,
  formatStorage,
  openInNewTab
} from '../helpers/helperfunctions'
import { editFile } from '../actions/fileActions'
import { editFolder, setCurrentFolder } from '../actions/folderActions'
import MultipleImageModal from './multipleImageModal'

class TabularView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopupOpen: false,
      isDetailViewOpen: false
    }
  }
  handleStarClick = (type, id, value) => {
    const { editFile, editFolder } = this.props
    var formdata = new FormData()
    formdata.append('starred', !value)
    if (type == 'file') {
      editFile(id, formdata, this.handleStarSuccess)
    } else {
      editFolder(id, formdata, this.handleStarSuccess)
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
  handleFolderClick = folder => event => {
    event.stopPropagation()
    const { setActiveItems, activeItems } = this.props
    if (!event.ctrlKey) {
      setActiveItems([{ type: ITEM_TYPE.folder, obj: folder }])
    } else {
      const newArr = activeItems.some(
        elem => elem.obj.id === folder.id && elem.type == 'folder'
      )
        ? activeItems.filter(
            elem => elem.obj.id !== folder.id || elem.type == 'file'
          )
        : [...activeItems, { type: ITEM_TYPE.folder, obj: folder }]
      setActiveItems(newArr)
    }
  }
  handleFileClick = file => event => {
    event.stopPropagation()
    const { setActiveItems, activeItems } = this.props
    if (!event.ctrlKey) {
      setActiveItems([{ type: ITEM_TYPE.file, obj: file }])
    } else {
      const newArr = activeItems.some(
        elem => elem.obj.id === file.id && elem.type == 'file'
      )
        ? activeItems.filter(
            elem => elem.obj.id !== file.id && elem.type == 'folder'
          )
        : [...activeItems, { type: ITEM_TYPE.file, obj: file }]
      setActiveItems(newArr)
    }
  }

  handleFileContextSelect = file => e => {
    const { activeItems, setActiveItems } = this.props
    const newActiveItems = activeItems.some(
      elem => elem.obj.id === file.id && elem.type == 'file'
    )
      ? activeItems
      : [{ type: ITEM_TYPE.file, obj: file }]
    setActiveItems(newActiveItems)
    e.detail = 'file-row'
  }

  handleFolderContextSelect = folder => e => {
    const { activeItems, setActiveItems } = this.props
    const newActiveItems = activeItems.some(
      elem => elem.obj.id === folder.id && elem.type == 'folder'
    )
      ? activeItems
      : [{ type: ITEM_TYPE.folder, obj: folder }]
    setActiveItems(newActiveItems)
    e.detail = 'folder-row'
  }

  handleFolderDoubleClick = folder => event => {
    const { viewingSharedItems } = this.props
    const uuid = this.props.match.params.uuid
      ? this.props.match.params.uuid
      : folder.sharingId
    const type_shared = this.props.match.type_shared
      ? this.props.match.type_shared
      : 'folder'
    const url = viewingSharedItems
      ? `${BASE_URL}/${this.props.match.params.filemanager}/${uuid}/${type_shared}/${folder.id}/folder/`
      : `${BASE_URL}/${this.props.match.params.filemanager}/${folder.id}/`
    this.props.history.push(url)
  }

  handleFileDoubleClick = file => event => {
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
    const { currentFolder, activeItems } = this.props
    const { isPopupOpen, isDetailViewOpen } = this.state
    return (
      <div
        onContextMenu={e => {
          e.preventDefault()
          this.contextRef = createContextFromEvent(e)
          if (e.detail === 'file-row' || e.detail === 'folder-row')
            if (isPopupOpen) {
              this.setState({ isPopupOpen: false })
            } else {
              this.setState({ isPopupOpen: true })
            }
        }}
      >
        <Table singleLine styleName='index.table-main' selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Last Modified</Table.HeaderCell>
              <Table.HeaderCell>Space Used</Table.HeaderCell>
              <Table.HeaderCell>Starred</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {currentFolder &&
              currentFolder.folders &&
              currentFolder.folders
                .sort(
                  ({ id: previousID }, { id: currentID }) =>
                    previousID - currentID
                )
                .map((folder, index) => (
                  <Table.Row
                    key={index}
                    active={activeItems.some(elem => elem.obj.id == folder.id)}
                    styleName='index.table-row'
                    onClick={this.handleFolderClick(folder)}
                    onDoubleClick={this.handleFolderDoubleClick(folder)}
                    onContextMenu={this.handleFolderContextSelect(folder)}
                  >
                    <Table.Cell>
                      <Icon size='large' name='folder open' color='grey' />
                      {folder.folderName}
                    </Table.Cell>
                    <Table.Cell>
                      {getModifiedDate(folder.datetimeModified)}
                    </Table.Cell>
                    <Table.Cell>{formatStorage(folder.contentSize)}</Table.Cell>
                    <Table.Cell>
                      {folder.starred ? (
                        <Icon
                          name='star'
                          title='Remove from starred'
                          onClick={() =>
                            this.handleStarClick('folder', folder.id, true)
                          }
                        />
                      ) : (
                        <Icon
                          name='star outline'
                          title='Add to starred'
                          onClick={() =>
                            this.handleStarClick('folder', folder.id, false)
                          }
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}

            {currentFolder &&
              currentFolder.files &&
              currentFolder.files
                .sort(
                  ({ id: previousID }, { id: currentID }) =>
                    previousID - currentID
                )
                .map((file, index) => (
                  <Table.Row
                    key={index}
                    active={activeItems.some(elem => elem.obj.id == file.id)}
                    styleName='index.table-row'
                    onClick={this.handleFileClick(file)}
                    onContextMenu={this.handleFileContextSelect(file)}
                    onDoubleClick={this.handleFileDoubleClick(file)}
                  >
                    <Table.Cell>
                      <div styleName='index.table-cell-file-icon-name'>
                        <div styleName='index.table-cell-file-icon'>
                          {!IMAGE_EXTENSIONS.includes(file.extension) ? (
                            <FileIcon
                              {...FILE_TYPES[file.extension]}
                              extension={file.extension}
                            />
                          ) : (
                            <img
                              src={file.upload}
                              alt={file.name}
                              styleName='index.image'
                            />
                          )}
                        </div>
                        <div styleName='index.table-cell-file-name'>
                          {file.fileName}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {getModifiedDate(file.datetimeModified)}
                    </Table.Cell>
                    <Table.Cell>{formatStorage(file.size)}</Table.Cell>
                    <Table.Cell>
                      {file.starred ? (
                        <Icon
                          name='star'
                          title='Remove from starred'
                          onClick={() =>
                            this.handleStarClick('file', file.id, true)
                          }
                        />
                      ) : (
                        <Icon
                          name='star outline'
                          title='Add to starred'
                          onClick={() =>
                            this.handleStarClick('file', file.id, false)
                          }
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
          </Table.Body>
        </Table>
        <PopupView
          contextRef={this.contextRef}
          isPopupOpen={isPopupOpen}
          setPopupOpen={value => this.setState({ isPopupOpen: value })}
        />
        <MultipleImageModal
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
    tabular: state.files.tabular,
    currentFolder: state.folders.selectedFolder,
    activeItems: state.items.activeItems,
    viewingSharedItems: state.items.viewingSharedItems,
    filemanagerIntegrationMode: state.filemanagers.filemanagerIntegrationMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabularView))
