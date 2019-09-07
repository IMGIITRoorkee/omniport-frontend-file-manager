import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Button } from 'semantic-ui-react'
import { deleteFile, fetchFiles } from '../actions/index'
import file from './css/file.css'
import Upload from './app-upload'

class Bar extends Component {
  componentDidMount() {}
  handleClick = () => {
    // console.log("sdjagk")
  }
  handleDownload = () => {
    const { isSelected, selectedData } = this.props
    console.log(selectedData)
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
    const { isSelected, selectedData, deleteFile } = this.props
    isSelected ? deleteFile(selectedData.pk, this.successCallback) : null
  }
  successCallback = () => {
    this.props.fetchFiles()
  }
  render() {
    const { isSelected } = this.props
    return (
      <Segment styleName="file.navbar">
        <div styleName="file.navbar-first">
          <div>
            <Button onClick={this.handleClick} icon="angle left" />
          </div>
          <div>
            <Button icon="angle right" />
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
    selectedData: state.files.selectedData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFiles: () => {
      dispatch(fetchFiles())
    },
    deleteFile: (pk, callback) => {
      dispatch(deleteFile(pk, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar)
