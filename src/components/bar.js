import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Button } from 'semantic-ui-react'
import {
  lastVisited,
  fetchFilesFolder,
  tabulation,
  unsetSelected
} from '../actions/index'
import Upload from './app-upload'

import file from './css/file.css'
class Bar extends Component {
  handleBack = () => {
    const { fetchFilesFolder, lastVisited, unsetSelected } = this.props
    fetchFilesFolder(lastVisited, this.successBackCallback)
    unsetSelected()
  }
  successBackCallback = () => {
    const { currentFolder, lastVisitedAct } = this.props
    lastVisitedAct(currentFolder)
  }
  handleTabulation = () => {
    const { tabulation, tabular, unsetSelected } = this.props
    tabulation(!tabular)
    unsetSelected()
  }
  render() {
    const {
      topLevel,
      currentFolder,
      lastVisited,
      tabular
    } = this.props
    return (
      <Segment styleName="file.navbar">
        <div styleName="file.navbar-first">
          <div>
            <Button
              disabled={topLevel === currentFolder}
              onClick={this.handleBack}
              icon="angle left"
            />
          </div>
          <div>
            <Button disabled={lastVisited === ''} icon="angle right" />
          </div>
          <div>
            <Button
              onClick={this.handleTabulation}
              icon={tabular ? 'columns' : 'table'}
            />
          </div>
        </div>
        <div styleName="file.navbar-first">
          <div>
            <Upload />
          </div>
        </div>
      </Segment>
    )
  }
}

const mapStateToProps = state => {
  return {
    isSelected: state.files.isSelected,
    selectedData: state.files.selectedData,
    topLevel: state.files.topLevel,
    currentFolder: state.files.currentFolder,
    lastVisited: state.files.lastVisited,
    tabular: state.files.tabular
  }
}

const mapDispatchToProps = dispatch => {
  return {
    lastVisitedAct: data => {
      dispatch(lastVisited(data))
    },
    fetchFilesFolder: (data, callback) => {
      dispatch(fetchFilesFolder(data, callback))
    },
    tabulation: bool => {
      dispatch(tabulation(bool))
    },
    unsetSelected: () => {
      dispatch(unsetSelected())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar)
