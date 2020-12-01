import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

import { getModifiedDate } from '../utils/get-modified-date'
import { getTheme } from 'formula_one'
import PopupView from './popup'

import index from './css/index.css'
import { setActiveItems } from '../actions/itemActions'
import { FILE_TYPES, ITEM_TYPE } from '../constants'
import { FileIcon } from 'react-file-icon'
import {
  createContextFromEvent,
  formatStorage
} from '../helpers/helperfunctions'

class TabularView extends Component {
  constructor(props) {
    super(props)
    this.contextRef = React.createRef()
    this.headerRef = React.createRef()
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

  handleFileContextSelect = file => e => {
    const { activeItems, setActiveItems } = this.props
    const newActiveItems = activeItems.some(
      elem => elem.obj.id === file.id && elem.type == 'file'
    )
      ? activeItems
      : [{ type: ITEM_TYPE.file, obj: file }]
    setActiveItems(newActiveItems)
  }

  handleFolderContextSelect = folder => e => {
    // e.stopPropagation()
    const { activeItems, setActiveItems } = this.props
    const newActiveItems = activeItems.some(
      elem => elem.obj.id === folder.id && elem.type == 'folder'
    )
      ? activeItems
      : [{ type: ITEM_TYPE.folder, obj: folder }]
    setActiveItems(newActiveItems)
  }

  render() {
    const { currentFolder, activeItems } = this.props
    const { isPopupOpen } = this.state
    return (
      <div
        onContextMenu={e => {
          e.preventDefault()
          // if (e.target === this.headerRef.current) {
          //   return
          // }
          this.contextRef = createContextFromEvent(e)
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
                      <Icon name='star' />
                    ) : (
                      <Icon name='star outline' />
                    )}
                  </Table.Cell>
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
                  onContextMenu={this.handleFileContextSelect(file)}
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
                  <Table.Cell>{formatStorage(file.size)}</Table.Cell>
                  <Table.Cell>
                    {file.starred ? (
                      <Icon name='star' />
                    ) : (
                      <Icon name='star outline' />
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
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabularView))
