import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import { Dimmer, Loader } from 'semantic-ui-react'
import { fetchFiles } from '../actions/index'
import axios from 'axios'

import index from './css/index.css'

const Loading = ({ error }) => {
  if (error) return <div>Error loading component</div>
  else
    return (
      <Dimmer active inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
    )
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
        { file: selectedData.link, fileName: selectedData.fileName },
        '*'
      )
      window.close()
    }
  }
  render() {
    const { tabular, isLoading } = this.props
    return (
      <React.Fragment>
        <Bar />
        {isLoading ? (
          <Dimmer active inverted>
            <Loader inverted content="Loading" />
          </Dimmer>
        ) : (
          <React.Fragment>
            <Progress />
            {tabular ? <TabularView /> : <GridView />}
          </React.Fragment>
        )}
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
