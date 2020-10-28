import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

import {
  setSelected,
  setTarget,
  deleteFile,
  unsetSelected,
  fetchFiles,
} from '../actions/index'
import { getModifiedDate } from '../utils/get-modified-date'
import { getTheme } from 'formula_one'
import PopupView from './popup'
import ConfirmModal from './confirmModal'
import index from './css/index.css'
import { deleteFolder } from '../actions/folderActions'
import { setActiveItems } from '../actions/itemActions'
import { ITEM_TYPE } from '../constants'

const options = [
  { key: '1', label: 'Edit' },
  { key: '2', label: 'Download' },
  { key: '3', label: 'Delete' },
]

class TabularView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopupOpen: false,
      showDeleteModal: false,
    }
  }
  handleFolderClick = folder => event => {
    const { setActiveItems, activeItems } = this.props
    if (!event.ctrlKey) {
      setActiveItems([{ type: ITEM_TYPE.folder, obj: folder }])
    } else {
      const newArr = activeItems.some(elem => elem.obj.id === folder.id)
        ? activeItems.filter(elem => elem.obj.id !== folder.id)
        : [...activeItems, { type: ITEM_TYPE.folder, obj: folder }]
      setActiveItems(newArr)
    }
  }
  handleOptions = {
    1: () => {},
    2: () => {},
    3: () => {
      this.setState({ showDeleteModal: true })
    },
  }
  handleDelete = id => {
    this.props.deleteFolder(id)
    this.setState({ showDeleteModal: false })
  }
  render() {
    const { currentFolder, activeItems } = this.props
    const { showDeleteModal } = this.state
    return (
      <Table singleLine styleName="index.table-main" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Last Modified</Table.HeaderCell>
            <Table.HeaderCell>Permissions</Table.HeaderCell>
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
                styleName="index.table-row"
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
                  <Icon size="large" name="folder outline" color={getTheme()} />
                  {folder.folderName}
                </Table.Cell>
                <Table.Cell>
                  {getModifiedDate(folder.datetimeModified)}
                </Table.Cell>
                <Table.Cell>{folder.permission}</Table.Cell>
                <Table.Cell>
                  <PopupView
                    id={folder.id}
                    options={options}
                    handleOptions={this.handleOptions}
                  />
                  <ConfirmModal
                    show={showDeleteModal}
                    handleClose={() => {
                      this.setState({ showDeleteModal: false })
                    }}
                    handleSubmit={() => {
                      this.handleDelete(folder.id)
                    }}
                    type="remove"
                    item="file"
                  />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentData: state.files.currentData,
    progress: state.files.progressArray,
    tabular: state.files.tabular,
    isSelected: state.files.isSelected,
    selectedData: state.files.selectedData,
    currentFolder: state.folders.selectedFolder,
    activeItems: state.items.activeItems,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFiles: () => {
      dispatch(fetchFiles())
    },
    setSelected: data => {
      dispatch(setSelected(data))
    },
    setTarget: () => {
      dispatch(setTarget())
    },
    deleteFile: (pk, callback) => {
      dispatch(deleteFile(pk, callback))
    },
    unsetSelected: () => {
      dispatch(unsetSelected())
    },
    deleteFolder: id => {
      dispatch(deleteFolder(id))
    },
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabularView))
