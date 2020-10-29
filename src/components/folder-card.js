import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Menu } from 'semantic-ui-react'

import { getTheme } from 'formula_one'
import grid from './css/grid-view.css'
import { withRouter } from 'react-router-dom'
import { setActiveItems } from '../actions/itemActions'
import { ITEM_TYPE } from '../constants'
class FolderCard extends Component {
  constructor (props) {
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
  render () {
    const { index, folder, activeItems } = this.props
    console.log(activeItems)
    return (
      <div id={`grid-card-${index}`} styleName='grid.file-card'>
        <div styleName='grid.flex-center' onClick={e => this.handleSelect(e)}>
          <Icon
            styleName={
              activeItems.some(
                elem => elem.obj.id === folder.id && elem.type == 'folder'
              )
                ? 'grid.card-active'
                : ''
            }
            size='huge'
            color={getTheme()}
            name={'folder outline'}
            onDoubleClick={() => {
              const url = `/file-manager/${this.props.match.params.filemanager}/${folder.id}/`
              this.props.history.push(url)
            }}
          />
        </div>
        <div styleName='grid.file-name'>
          <p
            styleName={
              activeItems.some(
                elem => elem.obj.id === folder.id && elem.type == 'folder'
              )
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
    activeItems: state.items.activeItems
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FolderCard))
