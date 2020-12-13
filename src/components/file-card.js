import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FileIcon } from 'react-file-icon'
import { Icon, Popup } from 'semantic-ui-react'

import { deleteFile } from '../actions/fileActions'
import { setActiveItems } from '../actions/itemActions'
import { FILE_TYPES, IMAGE_EXTENSIONS, ITEM_TYPE } from '../constants'

import grid from './css/grid-view.css'
class Filecard extends Component {
  constructor(props) {
    super(props)
  }

  handleSelect = e => {
    e.stopPropagation()
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

  handleContextSelect = e => {
    const { file, activeItems, setActiveItems } = this.props
    const newActiveItems = activeItems.some(
      elem => elem.obj.id === file.id && elem.type == 'file'
    )
      ? activeItems
      : [{ type: ITEM_TYPE.file, obj: file }]
    setActiveItems(newActiveItems)
  }

  render() {
    const {
      index,
      activeItems,
      file,
      viewingSharedItems,
      handleDoubleClick = () => {}
    } = this.props
    const extension = file.extension
    const fileName =
      file.fileName.length > 12
        ? file.fileName.slice(0, 9) + '..'
        : file.fileName

    return (
      <div id={`grid-card-${index}`} styleName='grid.file-card' secondary>
        <Popup
          trigger={
            <div
              styleName='grid.file-icon'
              onClick={e => this.handleSelect(e)}
              onContextMenu={this.handleContextSelect}
              onDoubleClick={() => {
                handleDoubleClick(file, index)
              }}
              styleName={
                activeItems.some(
                  elem => elem.obj.id === file.id && elem.type == 'file'
                )
                  ? 'grid.file-active'
                  : 'grid.file-inactive'
              }
            >
              {file.starred && !viewingSharedItems && (
                <Icon
                  corner='top right'
                  name='star'
                  styleName='grid.file-star-icon'
                  color='yellow'
                />
              )}
              {!IMAGE_EXTENSIONS.includes(file.extension) ? (
                <FileIcon {...FILE_TYPES[extension]} extension={extension} />
              ) : (
                  <img
                    src={file.fileUrl}
                    alt={file.name}
                    styleName='grid.image'
                  />
              )}
              <div styleName='grid.file-name'>{fileName}</div>
            </div>
          }
          content={file.fileName}
          basic
          size='small'
          position='bottom left'
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeItems: state.items.activeItems,
    currentFolder: state.folders.selectedFolder,
    viewingSharedItems: state.items.viewingSharedItems
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
