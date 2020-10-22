import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader, Divider } from 'semantic-ui-react'
import ErrorBoundary from './error-boundary'
import { fetchFiles } from '../actions/index'
import { getFolder, getRootFolder } from '../actions/folderActions'
import index from './css/index.css'
import manager from './css/manager.css'

const Loading = () => {
  return <p>Loading ...</p>
}

const Bar = React.lazy(() => import('./bar'))

const Progress = React.lazy(() => import('./progress'))

const GridView = React.lazy(() => import('./grid-view'))

const TabularView = React.lazy(() => import('./tabular-view'))

class Root extends Component {
  componentDidMount() {
    this.props.fetchFiles()
    this.props.match.params.id
      ? this.props.getFolderDetails(this.props.match.params.id)
      : this.props.getRoot(this.props.match.params.filemanager)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.match.params.id
        ? this.props.getFolderDetails(this.props.match.params.id)
        : this.props.getRoot(this.props.match.params.filemanager)
    }
  }
  render() {
    const { tabular, isLoading } = this.props
    return (
      <React.Fragment>
        <div styleName="manager.bar-progress-parent">
          <ErrorBoundary>
            <Suspense fallback={Loading}>
              <Bar />
              <Progress />
            </Suspense>
          </ErrorBoundary>
          <Divider styleName="manager.divider-margin" clearing />
        </div>

        <div styleName="manager.view">
          {isLoading ? (
            <Dimmer active inverted>
              <Loader inverted content="Loading" />
            </Dimmer>
          ) : (
            <ErrorBoundary>
              <Suspense fallback={Loading}>
                {tabular ? <TabularView /> : <GridView />}
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    tabular: state.files.tabular,
    isLoading: state.files.isLoading,
    selectedData: state.files.selectedData,
    isTarget: state.files.isTarget,
    folder: state.folders.selectedFolder,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFiles: () => {
      dispatch(fetchFiles())
    },
    getRoot: filemanager => {
      dispatch(getRootFolder(filemanager))
    },
    getFolderDetails: id => {
      dispatch(getFolder(id))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
