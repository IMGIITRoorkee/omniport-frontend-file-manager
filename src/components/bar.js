import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Button } from 'semantic-ui-react'
import {
  deleteFile,
  fetchFiles,
  lastVisited,
  fetchFilesFolder,
  tabulation,
  unsetSelected
} from '../actions/index'
import file from './css/file.css'
import Upload from './app-upload'
import Edit from './edit-file'

class Bar extends Component {
  componentDidMount() {}
  handleClick = () => {
    // console.log("sdjagk")
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
  handleBack = () => {
    const { fetchFilesFolder, lastVisited, unsetSelected } = this.props
    fetchFilesFolder(lastVisited, this.successBackCallback)
    unsetSelected()
  }
  successBackCallback = () => {
    const { currentFolder, lastVisitedAct } = this.props
    lastVisitedAct(currentFolder)
  }
  handleEdit = () => {}
  handleDelete = () => {
    const { isSelected, selectedData, deleteFile, unsetSelected } = this.props
    isSelected ? deleteFile(selectedData.pk, this.successCallback) : null
    unsetSelected()
  }
  handleTabulation = () => {
    const { tabulation, tabular, unsetSelected } = this.props
    tabulation(!tabular)
    unsetSelected()
  }
  successCallback = () => {
    this.props.fetchFiles()
  }
  render() {
    const {
      isSelected,
      topLevel,
      currentFolder,
      lastVisited,
      tabular
    } = this.props
    return (
      <Segment styleName="file.navbar">
        <div styleName="file.navbar-first">
          <div>
            <Button
              disabled={topLevel === currentFolder}
              onClick={this.handleBack}
              icon="angle left"
            />
          </div>
          <div>
            <Button disabled={lastVisited === ''} icon="angle right" />
          </div>
          <div>
            <Button
              onClick={this.handleTabulation}
              icon={tabular ? 'columns' : 'table'}
            />
          </div>
        </div>
        <div styleName="file.navbar-first">
          <div>
            <Button onClick={this.handleClick} icon="add square" />
          </div>
          <div>
            <Upload />
          </div>
          <div>
            <Edit />
          </div>
          <div>
            <Button
              disabled={!isSelected}
              onClick={this.handleDownload}
              icon="download"
            />
          </div>
          <div>
            <Button
              disabled={!isSelected}
              onClick={this.handleDelete}
              icon="delete"
            />
          </div>
        </div>
      </Segment>
    )
  }
}

const mapStateToProps = state => {
  return {
    isSelected: state.files.isSelected,
    selectedData: state.files.selectedData,
    topLevel: state.files.topLevel,
    currentFolder: state.files.currentFolder,
    lastVisited: state.files.lastVisited,
    tabular: state.files.tabular
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFiles: () => {
      dispatch(fetchFiles())
    },
    deleteFile: (pk, callback) => {
      dispatch(deleteFile(pk, callback))
    },
    lastVisitedAct: data => {
      dispatch(lastVisited(data))
    },
    fetchFilesFolder: (data, callback) => {
      dispatch(fetchFilesFolder(data, callback))
    },
    tabulation: bool => {
      dispatch(tabulation(bool))
    },
    unsetSelected: () => {
      dispatch(unsetSelected())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar)
