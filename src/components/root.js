import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader, Divider } from 'semantic-ui-react'

import ErrorBoundary from './error-boundary'
import { getFolder, getRootFolder } from '../actions/folderActions'
import { getSharedItems, getSharedItem } from '../actions/itemActions'
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
  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }
  componentDidMount () {
    const { params } = this.props.match
    const { getSharedItems, getFolderDetails, getRoot } = this.props
    params.uuid && params.id && params.type_shared && params.type_access
      ? this.props.getSharedItem(
          params.uuid,
          params.id,
          params.type_shared,
          params.type_access
        )
      : params.id == 'shared_with_me'
      ? getSharedItems(params.filemanager)
      : params.id
      ? getFolderDetails(params.id)
      : getRoot(params.filemanager)
  }
  componentDidUpdate (prevProps) {
    const { params } = this.props.match
    const { getSharedItems, getFolderDetails, getRoot } = this.props
    if (prevProps.location.pathname !== this.props.location.pathname) {
      params.uuid && params.id && params.type_shared && params.type_access
        ? getSharedItem(
            params.uuid,
            params.id,
            params.type_shared,
            params.type_access
          )
        : params.id == 'shared_with_me'
        ? getSharedItems(params.filemanager)
        : params.id
        ? getFolderDetails(params.id)
        : getRoot(params.filemanager)
    }
  }
  handleReset = e => {
    if (e.target === this.ref.current) {
      this.props.setActiveItems([])
    }
  }

  render () {
    const { tabular, isLoading } = this.props
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
    // isLoading: state.files.isLoading,
    // selectedData: state.files.selectedData,
    // isTarget: state.files.isTarget,
    folder: state.folders.selectedFolder
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
    setActiveItems: items => dispatch(setActiveItems(items))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
