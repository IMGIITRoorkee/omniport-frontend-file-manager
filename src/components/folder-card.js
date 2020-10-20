import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Menu } from 'semantic-ui-react'
import { getFileIcon } from '../utils/get-file-icon'
import { getTheme } from 'formula_one'
import {
  setGridViewActiveIndex,
  setSelected,
  setTarget
} from '../actions/index'

import grid from './css/grid-view.css'

class FolderCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      activeItem: ''
    }
  }

  handleSelect = () => {
    const {
      setGridViewActiveIndex,
      setSelected,
      index,
      link,
      fileName,
      id,
      isPublic,
      path
    } = this.props
    setGridViewActiveIndex(index)
    setSelected({ pk: id, fileName, link, isPublic, path })
  }
  render() {
    // const { visible, activeItem } = this.state
    const { folderName , gridViewActiveIndex, index, setTarget } = this.props
    return (
      <div
        id={`grid-card-${index}`}
        styleName="grid.file-card"
        // onContextMenu={e => this.handleContextMenuToggle(e, true)}
      >
        <div styleName="grid.flex-center">
          <Icon
            styleName={gridViewActiveIndex !== index ? '' : 'grid.card-active'}
            size="huge"
            color={getTheme()}
            name={'folder outline'}
            onClick={e => this.handleSelect(e)}
            onDoubleClick={setTarget}
          />
        </div>
        <div styleName="grid.file-name">
          <p
            onClick={this.handleSelect}
            onDoubleClick={setTarget}
            styleName={gridViewActiveIndex !== index ? '' : 'grid.card-active'}
          >
            {folderName}
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
)(FolderCard)
