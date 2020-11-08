import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import EditModal from './edit-modal'

import { deleteFile } from '../actions/fileActions'
import { getModifiedDate } from '../utils/get-modified-date'
import { getTheme } from 'formula_one'
import PopupView from './popup'
import ConfirmModal from './confirmModal'
import index from './css/index.css'
import { deleteFolder } from '../actions/folderActions'
import { setActiveItems } from '../actions/itemActions'
import { FILE_TYPES, ITEM_TYPE } from '../constants'
import { FileIcon } from 'react-file-icon'

const options = [
  { key: '1', label: 'Edit' },
  { key: '2', label: 'Download' },
  { key: '3', label: 'Delete' }
]

class TabularView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isPopupOpen: false,
      showDeleteModal: false,
      showEditModal: false
    }
  }
  handleFolderClick = folder => event => {
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
  handleOptions = {
    1: () => {
      this.setState({ showEditModal: true })
    },
    2: () => {},
    3: () => {
      this.setState({ showDeleteModal: true })
    }
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
    this.setState({ showDeleteModal: false })
  }
  render () {
    const { currentFolder, activeItems } = this.props
    const { showDeleteModal, showEditModal } = this.state
    return (
      <div>
        <Table singleLine styleName='index.table-main' selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Last Modified</Table.HeaderCell>
              <Table.HeaderCell>Permissions</Table.HeaderCell>
              <Table.HeaderCell>Starred</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentFolder &&
              currentFolder.folders &&
              currentFolder.folders.map((folder, index) => (
                <Table.Row
                  key={index}
                  active={activeItems.some(elem => elem.obj.id == folder.id)}
                  styleName='index.table-row'
                  onClick={this.handleFolderClick(folder)}
                  onDoubleClick={() => {
                    const url =
                      this.props.location.pathname.slice(-1) === '/'
                        ? `${this.props.match.url}${folder.id}`
                        : `${this.props.match.url}/${folder.id}`
                    this.props.history.push(url)
                  }}
                >
                  <Table.Cell>
                    <Icon size='large' name='folder open' color='grey' />
                    {folder.folderName}
                  </Table.Cell>
                  <Table.Cell>
                    {getModifiedDate(folder.datetimeModified)}
                  </Table.Cell>
                  <Table.Cell>{folder.permission}</Table.Cell>
                  <Table.Cell>{folder.starred ? <Icon name='star' /> : <Icon name='star outline' />}</Table.Cell>
                </Table.Row>
              ))}

            {currentFolder &&
              currentFolder.files &&
              currentFolder.files.map((file, index) => (
                <Table.Row
                  key={index}
                  active={activeItems.some(elem => elem.obj.id == file.id)}
                  styleName='index.table-row'
                  onClick={this.handleFileClick(file)}
                >
                  <Table.Cell>
                    <div styleName='index.table-cell-file-icon-name'>
                      <div styleName='index.table-cell-file-icon'>
                        <FileIcon
                          {...FILE_TYPES[file.extension]}
                          extension={file.extension}
                        />
                      </div>
                      <div styleName='index.table-cell-file-name'>
                        {file.fileName}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {getModifiedDate(file.datetimeModified)}
                  </Table.Cell>
                  <Table.Cell>{file.permission}</Table.Cell>
                  <Table.Cell>{file.starred ? <Icon name='star' /> : <Icon name='star outline' />}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <ConfirmModal
          show={showDeleteModal}
          handleClose={() => {
            this.setState({ showDeleteModal: false })
          }}
          handleSubmit={() => {
            this.handleDelete()
          }}
          type='remove'
          item='file'
        />
        <EditModal
          showModal={showEditModal}
          close={() => {
            this.setState({ showEditModal: false })
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
    activeItems: state.items.activeItems
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteFile: pk => {
      dispatch(deleteFile(pk))
    },
    deleteFolder: id => {
      dispatch(deleteFolder(id))
    },
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabularView))
