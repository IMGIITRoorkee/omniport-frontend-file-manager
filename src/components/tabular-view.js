import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'
import {
  setSelected,
  setTarget,
  deleteFile,
  unsetSelected,
  fetchFiles,
} from '../actions/index'
import { getFileIcon } from '../utils/get-file-icon'
import { getModifiedDate } from '../utils/get-modified-date'
import { getTheme } from 'formula_one'
import PopupView from './popup'

import index from './css/index.css'
import { withRouter } from 'react-router-dom'
class TabularView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: [],
      isPopupOpen: false,
    }
  }
  handleClick = index => event => {
    const { active } = this.state
    if (!event.ctrlKey) {
      this.setState({
        active: [index],
      })
    } else {
      console.log(active)
      console.log(active.includes(index))
      const newArr = active.includes(index)
        ? active.filter(elem => elem !== index)
        : [...active, index]
      this.setState({ active: newArr })
    }
  }
  render() {
    const { currentData, setTarget, currentFolder } = this.props
    const { active } = this.state
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
                active={active.includes(index)}
                styleName="index.table-row"
                onClick={this.handleClick(index)}
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabularView))
