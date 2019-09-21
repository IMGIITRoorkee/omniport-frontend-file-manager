import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { getFileIcon } from '../utils/get-file-icon'
import { getTheme } from 'formula_one'
import {
  setGridViewActiveIndex,
  setSelected,
  setTarget
} from '../actions/index'

import grid from './css/grid-view.css'

class FileCard extends Component {
  handleSelect = () => {
    const {
      setGridViewActiveIndex,
      setSelected,
      index,
      link,
      fileName,
      id,
      isPublic
    } = this.props
    setGridViewActiveIndex(index)
    setSelected({ pk: id, fileName, link, isPublic })
  }
  render() {
    const {
      fileName,
      link,
      gridViewActiveIndex,
      index,
      setTarget
    } = this.props
    return (
      <div styleName="grid.file-card">
        <div styleName="grid.flex-center">
          <Icon
            styleName={gridViewActiveIndex !== index ? '' : 'grid.card-active'}
            size="huge"
            color={getTheme()}
            name={getFileIcon(link)}
            onClick={this.handleSelect}
            onDoubleClick={setTarget}
          />
        </div>
        <div styleName="grid.file-name">
          <p
            onClick={this.handleSelect}
            onDoubleClick={setTarget}
            styleName={gridViewActiveIndex !== index ? '' : 'grid.card-active'}
          >
            {fileName}
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    gridViewActiveIndex: state.files.gridViewActiveIndex
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setGridViewActiveIndex: index => {
      dispatch(setGridViewActiveIndex(index))
    },
    setSelected: data => {
      dispatch(setSelected(data))
    },
    setTarget: () => {
      dispatch(setTarget())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileCard)
