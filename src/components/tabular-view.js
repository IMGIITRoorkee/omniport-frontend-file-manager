import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'
import {
  setSelected,
  setTarget,
  deleteFile,
  unsetSelected,
  fetchFiles
} from '../actions/index'
import { getFileIcon } from '../utils/get-file-icon'
import { getModifiedDate } from '../utils/get-modified-date'
import { getTheme } from 'formula_one'
import PopupView from './popup'

import index from './css/index.css'
class TabularView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: '',
      isPopupOpen: false
    }
  }
  handlePopupToggle = (e, value) => {
    this.setState({
      isPopupOpen: value
    })
    if (e.type === 'click') e.stopPropagation()
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
  handleDelete = () => {
    const { isSelected, selectedData, deleteFile, unsetSelected } = this.props
    isSelected ? deleteFile(selectedData.pk, this.successCallback) : null
    unsetSelected()
  }
  successCallback = () => {
    this.props.fetchFiles()
  }
  handleClick = (pk, fileName, link, index, isPublic) => {
    const { setSelected } = this.props
    this.setState({
      active: index
    })
    setSelected({ pk, fileName, link, isPublic })
  }
  render() {
    const { currentData, setTarget } = this.props
    const { active } = this.state
    return (
      <Table singleLine styleName="index.table-main" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Last Modified</Table.HeaderCell>
            <Table.HeaderCell>Public</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentData &&
            currentData.files &&
            currentData.files.map((file, index) => (
              <Table.Row
                key={index}
                active={active === index}
                styleName="index.table-row"
                onClick={() =>
                  this.handleClick(
                    file.id,
                    file.fileName,
                    file.upload,
                    index,
                    file.isPublic
                  )
                }
                onDoubleClick={setTarget}
              >
                <Table.Cell>
                  <Icon
                    size="large"
                    name={getFileIcon(file.path)}
                    color={getTheme()}
                  />
                  {file.fileName}
                </Table.Cell>
                <Table.Cell>
                  {getModifiedDate(file.datetimeModified)}
                </Table.Cell>
                <Table.Cell>{file.isPublic ? 'True' : 'False'}</Table.Cell>
                <Table.Cell>
                  <PopupView
                    id={file.id}
                    handleClick={() =>
                      this.handleClick(
                        file.id,
                        file.fileName,
                        file.upload,
                        index,
                        file.isPublic
                      )
                    }
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
    selectedData: state.files.selectedData
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabularView)
