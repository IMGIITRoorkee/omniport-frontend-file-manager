import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileCard from './file-card'

import grid from './css/grid-view.css'
import FolderCard from './folder-card'

class GridView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: ''
    }
  }
  render() {
    const { currentFolder } = this.props
    return (
      <div styleName="grid.view-parent">
        {currentFolder &&
          currentFolder.folders &&
          currentFolder.folders.map((folder, index) => (
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
    )
  }
}

const mapStateToProps = state => {
  return {
    currentData: state.files.currentData,
    progress: state.files.progressArray,
    currentFolder: state.folders.selectedFolder
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridView)
