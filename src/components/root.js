import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader, Divider } from 'semantic-ui-react'

import ErrorBoundary from './error-boundary'
import { getFolder, getRootFolder } from '../actions/folderActions'
import {
  getSharedItems,
  getSharedItem,
  getStarredItems
} from '../actions/itemActions'
import { setActiveItems } from '../actions/itemActions'

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
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }
  componentDidMount() {
    const {
      uuid,
      id,
      type_access,
      type_shared,
      filemanager
    } = this.props.match.params
    const {
      getSharedItems,
      getSharedItem,
      getFolderDetails,
      getRoot,
      getStarredItems
    } = this.props
    uuid && id && type_shared && type_access
      ? getSharedItem(uuid, id, type_shared, type_access)
      : id == 'all_starred_items'
      ? getStarredItems(filemanager)
      : id == 'shared_with_me'
      ? getSharedItems(filemanager)
      : id
      ? getFolderDetails(id)
      : getRoot(filemanager)
  }
  componentDidUpdate(prevProps) {
    const {
      uuid,
      id,
      type_access,
      type_shared,
      filemanager
    } = this.props.match.params
    const {
      getSharedItems,
      getSharedItem,
      getFolderDetails,
      getRoot,
      getStarredItems
    } = this.props
    if (prevProps.location.pathname !== this.props.location.pathname) {
      uuid && id && type_shared && type_access
        ? getSharedItem(uuid, id, type_shared, type_access)
        : id == 'all_starred_items'
        ? getStarredItems(filemanager)
        : id == 'shared_with_me'
        ? getSharedItems(filemanager)
        : id
        ? getFolderDetails(id)
        : getRoot(filemanager)
    }
  }
  handleReset = e => {
    if (e.target === this.ref.current) {
      this.props.setActiveItems([])
    }
  }

  render() {
    const {
      tabular,
      getFilePending,
      getFilesPending,
      getFolderPending,
      getFoldersPending
    } = this.props
    const isLoading =
      getFilePending || getFilesPending || getFolderPending || getFoldersPending
    return (
      <React.Fragment>
        <div styleName='manager.bar-progress-parent'>
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <Bar />
              <Progress />
            </Suspense>
          </ErrorBoundary>
          <Divider styleName='manager.divider-margin' clearing />
        </div>

        <div styleName='manager.view' ref={this.ref} onClick={this.handleReset}>
          {isLoading ? (
            <Dimmer active inverted>
              <Loader inverted content='Loading' />
            </Dimmer>
          ) : (
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
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
    tabular: state.items.tabular,
    folder: state.folders.selectedFolder,
    getFolderPending: state.folders.getFolderPending,
    getFoldersPending: state.folders.getFoldersPending,
    getFilePending: state.files.getFilePending,
    getFilesPending: state.files.getFilesPending
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getRoot: filemanager => {
      dispatch(getRootFolder(filemanager))
    },
    getFolderDetails: id => {
      dispatch(getFolder(id))
    },
    getSharedItems: filemanager => {
      dispatch(getSharedItems(filemanager))
    },
    getSharedItem: (uuid, id, type_shared, type_access) => {
      dispatch(getSharedItem(uuid, id, type_shared, type_access))
    },
    getStarredItems: filemanager => {
      dispatch(getStarredItems(filemanager))
    },
    setActiveItems: items => dispatch(setActiveItems(items))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
