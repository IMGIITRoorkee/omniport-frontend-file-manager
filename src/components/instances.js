import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardGroup, Card, CardHeader, CardMeta } from 'semantic-ui-react'
import { getAllRootFoldersRequest } from '../actions/folderActions'
import Filemanagercard from '../components/filemanager-card'
import ErrorBoundary from './error-boundary'
import main from './css/instances.css'

class Instances extends Component {
  componentDidMount () {
    this.props.getRootFolders()
  }
  render () {
    const { Folders } = this.props
    const filemanagers = Folders.map(folder => {
      return <Filemanagercard folder={folder} key={folder.id} />
    })
    return (
      <ErrorBoundary>
        <CardGroup styleName='filemanager-cards' className='container'>
          {filemanagers}
        </CardGroup>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => {
  return {
    Folders: state.folders.Folders
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getRootFolders: () => {
      dispatch(getAllRootFoldersRequest())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Instances)
