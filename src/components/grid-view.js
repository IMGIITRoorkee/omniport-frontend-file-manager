import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchFiles } from '../actions/index'
import FileCard from './file-card'

class GridView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: ''
    }
  }
  componentDidMount() {
    this.props.fetchFiles()
  }
  render() {
    const { currentData } = this.props
    return (
      <React.Fragment>
        {currentData &&
          currentData.files &&
          currentData.files.map((file, index) => (
            <FileCard
              key={index}
              fileName={file.fileName}
              link={file.path}
              isPublic={file.isPublic}
            />
          ))}
      </React.Fragment>
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
  return {
    fetchFiles: () => {
      dispatch(fetchFiles())
    },
    setSelected: pk => {
      dispatch(setSelected(pk))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridView)
