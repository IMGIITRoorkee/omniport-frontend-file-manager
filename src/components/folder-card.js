import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Menu } from 'semantic-ui-react'

import { getTheme } from 'formula_one'
import { setGridViewActiveIndex, setSelected } from '../actions/index'
import grid from './css/grid-view.css'
import { withRouter } from 'react-router-dom'
import { setActiveItems } from '../actions/itemActions'
import { ITEM_TYPE } from '../constants'
class FolderCard extends Component {
  constructor(props) {
    super(props)
  }

  handleSelect = e => {
    const { setActiveFolder, folder, activeItems, setActiveItems } = this.props
    if (e.ctrlKey) {
      const newActiveItems = activeItems.some(elem => elem.obj.id === folder.id)
        ? activeItems.filter(elem => elem.obj.id !== folder.id)
        : [...activeItems, { type: ITEM_TYPE.folder, obj: folder }]
      setActiveItems(newActiveItems)
    } else {
      setActiveItems([{ type: ITEM_TYPE.folder, obj: folder }])
    }
  }
  render() {
    const { index, activeFolder, folder, activeItems } = this.props
    return (
      <div id={`grid-card-${index}`} styleName="grid.file-card">
        <div styleName="grid.flex-center">
          <Icon
            styleName={
              activeItems.some(elem => elem.obj.id === folder.id)
                ? 'grid.card-active'
                : ''
            }
            size="huge"
            color={getTheme()}
            name={'folder outline'}
            onClick={e => this.handleSelect(e)}
            onDoubleClick={() => {
              const url = `/file-manager/${this.props.match.params.filemanager}/${folder.id}/`
              this.props.history.push(url)
            }}
          />
        </div>
        <div styleName="grid.file-name">
          <p
            onClick={this.handleSelect}
            styleName={
              activeItems.some(elem => elem.obj.id === folder.id)
                ? 'grid.card-active'
                : ''
            }
            onDoubleClick={() => {
              const url = `/file-manager/${this.props.match.params.filemanager}/${folder.id}/`
              this.props.history.push(url)
            }}
          >
            {folder.folderName}
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    gridViewActiveIndex: state.files.gridViewActiveIndex,
    activeFolder: state.folders.activeFolder,
    activeItems: state.items.activeItems,
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
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FolderCard))
