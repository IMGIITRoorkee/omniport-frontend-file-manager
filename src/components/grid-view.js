import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileCard from './file-card'

import grid from './css/grid-view.css'
import FolderCard from './folder-card'
import { setActiveItems } from '../actions/itemActions'

class GridView extends Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }
  handleReset = e => {
    if (e.target === this.ref.current) {
      this.props.setActiveItems([])
    }
  }

  render() {
    const { currentFolder } = this.props
    return (
      <div
        styleName="grid.view-parent"
        ref={this.ref}
        onClick={this.handleReset}
      >
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
    currentFolder: state.folders.selectedFolder,
  }
}

const mapDispatchToProps = dispatch => {
  return { setActiveItems: items => dispatch(setActiveItems(items)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(GridView)
