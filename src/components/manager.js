import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import { Dimmer, Loader, Divider } from 'semantic-ui-react'
import { fetchFiles } from '../actions/index'

import index from './css/index.css'
import manager from './css/manager.css'

const Loading = ({ error }) => {
  if (error) return <div>Error loading component</div>
  else return <p>Loading.....</p>
}

const Bar = Loadable({
  loader: () => import('./bar'),
  loading: Loading
})

const Progress = Loadable({
  loader: () => import('./progress'),
  loading: Loading
})

const GridView = Loadable({
  loader: () => import('./grid-view'),
  loading: Loading
})

const TabularView = Loadable({
  loader: () => import('./tabular-view'),
  loading: Loading
})

class Manager extends Component {
  componentDidMount() {
    this.props.fetchFiles()
  }
  componentDidUpdate(prevProps) {
    const { isTarget, selectedData } = this.props
    if (prevProps.isTarget !== isTarget) {
      window.opener.postMessage(
        {
          file: selectedData.link,
          fileName: selectedData.fileName,
          path: selectedData.path
        },
        '*'
      )
      window.close()
    }
  }
  render() {
    const { tabular, isLoading } = this.props
    return (
      <React.Fragment>
        <div styleName="manager.bar-progress-parent">
          <Bar />
          <Progress />
          <Divider styleName="manager.divider-margin" clearing />
        </div>

        <div styleName="manager.view">
          {isLoading ? (
            <Dimmer active inverted>
              <Loader inverted content="Loading" />
            </Dimmer>
          ) : (
            <React.Fragment>
              {tabular ? <TabularView /> : <GridView />}
            </React.Fragment>
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
    isTarget: state.files.isTarget
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFiles: () => {
      dispatch(fetchFiles())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Manager)
