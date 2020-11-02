import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Menu } from 'semantic-ui-react'

import { getTheme } from 'formula_one'
import ConfirmModal from './confirmModal'
import grid from './css/grid-view.css'
import { withRouter } from 'react-router-dom'
import { setActiveItems } from '../actions/itemActions'
import { deleteFolder } from '../actions/folderActions'
import { ITEM_TYPE } from '../constants'

const options = [
  { key: '1', label: 'Edit', icon: 'edit' },
  { key: '2', label: 'Download' },
  { key: '3', label: 'Delete', icon: 'delete' }
]

function createContextFromEvent (e) {
  const left = e.clientX
  const top = e.clientY
  const right = left + 1
  const bottom = top + 1

  return {
    getBoundingClientRect: () => ({
      left,
      top,
      right,
      bottom,

      height: 0,
      width: 0
    })
  }
}

class FolderCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showEditModal: false,
      showDeleteModal: false,
      isPopupOpen: false
    }
    this.contextRef = React.createRef()
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

  handleOptions = {
    1: () => {
      this.setState({ showEditModal: true })
    },
    2: () => {},
    3: () => {
      this.setState({ showDeleteModal: true })
    }
  }

  handleDelete = () => {
    const { deleteFolder, activeItems, setActiveItems } = this.props
    if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.folder) {
      deleteFolder(activeItems[0].obj.id)
    }
    setActiveItems([])
    this.setState({ showDeleteModal: false })
  }

  render () {
    const { isPopupOpen, showDeleteModal, showEditModal } = this.state
    const { index, folder, activeItems } = this.props
    const folderName =
      folder.folderName.length > 12
        ? folder.folderName.slice(0, 10) + '..'
        : folder.folderName
    return (
      <div
        id={`grid-card-${index}`}
        styleName='grid.file-card'
        onContextMenu={e => {
          e.preventDefault()
          console.log(e)
          this.contextRef = createContextFromEvent(e)
          this.setState({ isPopupOpen: true })
          this.handleSelect(e)
        }}
        secondary
      >
        <div
          styleName={
            activeItems.some(
              elem => elem.obj.id === folder.id && elem.type == 'folder'
            )
              ? 'grid.folder-active'
              : 'grid.folder-inactive'
          }
        >
          <div styleName='grid.folder-icon' onClick={e => this.handleSelect(e)}>
            <Icon
              size='huge'
              color='grey'
              name={'folder open'}
              onDoubleClick={() => {
                const url = `/file-manager/${this.props.match.params.filemanager}/${folder.id}/`
                this.props.history.push(url)
              }}
            />
          </div>
          <div styleName='grid.folder-name'>
            <p
              onDoubleClick={() => {
                const url = `/file-manager/${this.props.match.params.filemanager}/${folder.id}/`
                this.props.history.push(url)
              }}
            >
              {folderName}
            </p>
          </div>
        </div>
        <Popup
          basic
          context={this.contextRef}
          onClose={() => this.setState({ isPopupOpen: false })}
          open={isPopupOpen}
        >
          <Menu vertical>
            {options.map(option => (
              <Menu.Item
                key={option.key}
                name={option.label}
                icon={option.icon ? option.icon : false}
                onClick={() => {
                  this.setState({ isPopupOpen: false })
                  this.handleOptions[option.key]()
                }}
              />
            ))}
          </Menu>
        </Popup>
        <ConfirmModal
          show={showDeleteModal}
          handleClose={() => {
            this.setState({ showDeleteModal: false })
          }}
          handleSubmit={() => {
            this.handleDelete()
          }}
          type='remove'
          item='file'
        />
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
