import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardGroup, Dimmer, Loader, Segment } from 'semantic-ui-react'

import { getAllRootFoldersRequest } from '../actions/folderActions'
import Filemanagercard from '../components/filemanager-card'
import ErrorBoundary from './error-boundary'
import main from './css/instances.css'
import { withRouter } from 'react-router-dom'
import { setIntegrationMode } from '../actions/filemanagerActions'

class Instances extends Component {
  componentDidMount() {
    const { getRootFolders, location, setIntegrationMode } = this.props
    getRootFolders()
    if (location.search.includes('mode=integration')) {
      setIntegrationMode(true)
    }
  }
  render() {
    const { Folders, getFoldersPending } = this.props
    const filemanagers = Folders.map(folder => {
      return <Filemanagercard folder={folder} key={folder.id} />
    })
    return getFoldersPending ? (
      <Dimmer active inverted>
        <Loader inverted content='Loading' />
      </Dimmer>
    ) : !Boolean(Folders) || Folders.length == 0 ? (
      <Segment basic padded textAlign='center'>
        You don't have any filemanagers now. Contact your administrator or check
        back later.
      </Segment>
    ) : (
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
    Folders: state.folders.Folders,
    getFoldersPending: state.folders.getFoldersPending
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getRootFolders: () => {
      dispatch(getAllRootFoldersRequest())
    },
    setIntegrationMode: isIntegrationMode =>
      dispatch(setIntegrationMode(isIntegrationMode))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Instances))
