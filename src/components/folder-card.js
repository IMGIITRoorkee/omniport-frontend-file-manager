import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Menu } from 'semantic-ui-react'

import { getTheme } from 'formula_one'
import ConfirmModal from './confirmModal'
import grid from './css/grid-view.css'
import { withRouter } from 'react-router-dom'
import { setActiveItems } from '../actions/itemActions'
import { deleteFolder } from '../actions/folderActions'
import { BASE_URL, ITEM_TYPE } from '../constants'

class FolderCard extends Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  handleSelect = e => {
    e.stopPropagation()
    const { folder, activeItems, setActiveItems } = this.props
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
  handleContextSelect = e => {
    const { folder, activeItems, setActiveItems } = this.props

    const newActiveItems = activeItems.some(
      elem => elem.obj.id === folder.id && elem.type == 'folder'
    )
      ? activeItems
      : [{ type: ITEM_TYPE.folder, obj: folder }]
    setActiveItems(newActiveItems)
    e.detail = 'folder-card'
  }

  handleDoubleClick = () => {
    const { folder, viewingSharedItems } = this.props
    const uuid = this.props.match.params.uuid
      ? this.props.match.params.uuid
      : folder.sharingId
    const type_shared = this.props.match.type_shared
      ? this.props.match.type_shared
      : 'folder'
    const url = viewingSharedItems
      ? `${BASE_URL}/${this.props.match.params.filemanager}/${uuid}/${type_shared}/${folder.id}/folder/`
      : `${BASE_URL}/${this.props.match.params.filemanager}/${folder.id}/`
    this.props.history.push(url)
  }

  render() {
    const { index, folder, activeItems, viewingSharedItems } = this.props
    const folderName =
      folder.folderName.length > 12
        ? folder.folderName.slice(0, 10) + '..'
        : folder.folderName
    return (
      <div
        id={`grid-card-${index}`}
        styleName='grid.file-card'
        secondary
        onContextMenu={this.handleContextSelect}
      >
        <Popup
          content={folder.folderName}
          basic
          size='small'
          position='bottom left'
          trigger={
            <div
              styleName={
                activeItems.some(
                  elem => elem.obj.id === folder.id && elem.type == 'folder'
                )
                  ? 'grid.folder-active'
                  : 'grid.folder-inactive'
              }
            >
              <div
                styleName='grid.folder-icon'
                onClick={e => this.handleSelect(e)}
              >
                <Icon
                  size='huge'
                  color='grey'
                  name={'folder open'}
                  onDoubleClick={this.handleDoubleClick}
                />
              </div>
              {folder.starred && !viewingSharedItems && (
                <Icon
                  corner='top right'
                  name='star'
                  styleName='grid.folder-star-icon'
                  color='yellow'
                />
              )}
              <div styleName='grid.folder-name'>
                <p onDoubleClick={this.handleDoubleClick}>{folderName}</p>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    gridViewActiveIndex: state.files.gridViewActiveIndex,
    activeItems: state.items.activeItems,
    viewingSharedItems: state.items.viewingSharedItems
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    },
    deleteFolder: id => {
      dispatch(deleteFolder(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FolderCard))
