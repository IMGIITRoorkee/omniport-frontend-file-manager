import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader, Divider } from 'semantic-ui-react'
import ErrorBoundary from './error-boundary'

import index from './css/index.css'
import manager from './css/manager.css'

const Loading = () => {
  return <p>Loading ...</p>
}

const Bar = React.lazy(() => import('./bar'))

const Progress = React.lazy(() => import('./progress'))

const GridView = React.lazy(() => import('./grid-view'))

const TabularView = React.lazy(() => import('./tabular-view'))

class Manager extends Component {
  componentDidMount () {
    this.props.fetchFiles()
  }
  componentDidUpdate (prevProps) {
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
  render () {
    const { tabular } = this.props
    return (
      <React.Fragment>
        <div styleName='manager.bar-progress-parent'>
          <ErrorBoundary>
            <Suspense fallback={Loading}>
              <Bar />
              <Progress />
            </Suspense>
          </ErrorBoundary>
          <Divider styleName='manager.divider-margin' clearing />
        </div>

        <div styleName='manager.view'>
          {isLoading ? (
            <Dimmer active inverted>
              <Loader inverted content='Loading' />
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
    tabular: state.files.tabular
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Manager)
