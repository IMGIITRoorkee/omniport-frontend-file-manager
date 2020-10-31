import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Menu } from 'semantic-ui-react'

import { getTheme } from 'formula_one'
import grid from './css/grid-view.css'
import { withRouter } from 'react-router-dom'
import { setActiveItems } from '../actions/itemActions'
import { ITEM_TYPE } from '../constants'
class FolderCard extends Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  handleSelect = e => {
    const { setActiveFolder, folder, activeItems, setActiveItems } = this.props
    if (e.ctrlKey) {
      const newActiveItems = activeItems.some(
        elem => elem.obj.id === folder.id && elem.type == 'folder'
      )
        ? activeItems.filter(elem => elem.obj.id !== folder.id)
        : [...activeItems, { type: ITEM_TYPE.folder, obj: folder }]
      setActiveItems(newActiveItems)
    } else {
      setActiveItems([{ type: ITEM_TYPE.folder, obj: folder }])
    }
  }
  render() {
    const { index, folder, activeItems } = this.props
    return (
      <div id={`grid-card-${index}`} styleName="grid.file-card">
        <div
          styleName={
            activeItems.some(
              elem => elem.obj.id === folder.id && elem.type == 'folder'
            )
              ? 'grid.folder-active'
              : 'grid.folder-inactive'
          }
        >
          <div styleName="grid.folder-icon" onClick={e => this.handleSelect(e)}>
            <Icon
              size="huge"
              color="grey"
              name={'folder open'}
              onDoubleClick={() => {
                const url = `/file-manager/${this.props.match.params.filemanager}/${folder.id}/`
                this.props.history.push(url)
              }}
            />
          </div>
          <div styleName="grid.folder-name">
            <p
              onDoubleClick={() => {
                const url = `/file-manager/${this.props.match.params.filemanager}/${folder.id}/`
                this.props.history.push(url)
              }}
            >
              {folder.folderName}
            </p>
          </div>
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
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FolderCard))
