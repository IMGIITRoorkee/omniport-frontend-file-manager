import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader } from 'semantic-ui-react'
import { fetchFiles } from '../actions/index'
import Bar from './bar'
import Progress from './progress'
import GridView from './grid-view'
import TabularView from './tabular-view'
import index from './css/index.css'

class Manager extends Component {
  componentDidMount() {
    this.props.fetchFiles()
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
    isLoading: state.files.isLoading
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
