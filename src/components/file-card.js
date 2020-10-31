import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { FileIcon } from 'react-file-icon'

import { getTheme } from 'formula_one'
import { setActiveItems } from '../actions/itemActions'
import { FILE_TYPES, ITEM_TYPE } from '../constants'

import grid from './css/grid-view.css'
class Filecard extends Component {
  constructor(props) {
    super(props)
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

  render() {
    const { index, activeItems, file } = this.props
    const extension = file.extension

    return (
      <div id={`grid-card-${index}`} styleName="grid.file-card">
        <div
          styleName="grid.file-icon"
          onClick={e => this.handleSelect(e)}
        >
          <FileIcon
            {...FILE_TYPES[extension] }
            extension={extension}
            styleName={
              activeItems.some(
                elem => elem.obj.id === file.id && elem.type == 'file'
              )
                ? 'grid.card-active'
                : ''
            }
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Filecard)
