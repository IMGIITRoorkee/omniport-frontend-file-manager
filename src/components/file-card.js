import React, { Component } from 'react'
import { Icon, Popup, Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { FileIcon } from 'react-file-icon'
import EditModal from './edit-modal'

import { deleteFile } from '../actions/fileActions'
import ConfirmModal from './confirmModal'
import { getTheme } from 'formula_one'
import { setActiveItems } from '../actions/itemActions'
import { FILE_TYPES, ITEM_TYPE } from '../constants'

import grid from './css/grid-view.css'

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

class Filecard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showEditModal: false,
      showDeleteModal: false,
      isPopupOpen: false
    }
    this.contextRef = React.createRef()
  }

  handleSelect = e => {
    const { file, activeItems, setActiveItems } = this.props
    if (e.ctrlKey) {
      const newActiveItems = activeItems.some(
        elem => elem.obj.id === file.id && elem.type == 'file'
      )
        ? activeItems.filter(elem => elem.obj.id !== file.id)
        : [...activeItems, { type: ITEM_TYPE.file, obj: file }]
      setActiveItems(newActiveItems)
    } else {
      setActiveItems([{ type: ITEM_TYPE.file, obj: file }])
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
    const { activeItems, deleteFile, setActiveItems } = this.props
    if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.file) {
      deleteFile(activeItems[0].obj.id)
    }
    setActiveItems([])
    this.setState({ showDeleteModal: false })
  }

  render () {
    const { isPopupOpen, showDeleteModal, showEditModal } = this.state
    const { index, activeItems, file } = this.props
    const extension = file.extension
    const fileName =
      file.fileName.length > 12
        ? file.fileName.slice(0, 9) + '..'
        : file.fileName
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
          styleName='grid.file-icon'
          onClick={e => this.handleSelect(e)}
          styleName={
            activeItems.some(
              elem => elem.obj.id === file.id && elem.type == 'file'
            )
              ? 'grid.file-active'
              : 'grid.file-inactive'
          }
        >
          <FileIcon {...FILE_TYPES[extension]} extension={extension} />
          <div styleName='grid.file-name'>{fileName}</div>
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
        <EditModal
          showModal={showEditModal}
          close={() => {
            this.setState({ showEditModal: false })
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeItems: state.items.activeItems,
    currentFolder: state.folders.selectedFolder
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    },
    deleteFile: pk => {
      dispatch(deleteFile(pk))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filecard)
