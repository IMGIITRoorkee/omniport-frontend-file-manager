import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileCard from './file-card'

import grid from './css/grid-view.css'

class GridView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: ''
    }
  }
  render() {
    const { currentData} = this.props
    return (
      <div styleName="grid.view-parent">
        {currentData &&
          currentData.files &&
          currentData.files.map((file, index) => (
            <FileCard
              key={index}
              index={index}
              id={file.id}
              fileName={file.fileName}
              link={file.upload}  
              isPublic={file.isPublic}
            />
          ))}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentData: state.files.currentData,
    progress: state.files.progressArray
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridView)
