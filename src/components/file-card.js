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
  state = {
    visible: false
  }
  root = React.createRef()

  componentDidMount() {
    document.addEventListener('contextmenu', this._handleContextMenu)
    document.addEventListener('click', this._handleClick)
    document.addEventListener('scroll', this._handleScroll)
  }

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this._handleContextMenu)
    document.removeEventListener('click', this._handleClick)
    document.removeEventListener('scroll', this._handleScroll)
  }

  _handleContextMenu = event => {
    event.preventDefault()

    this.setState({ visible: true })

    const clickX = event.clientX
    const clickY = event.clientY
    const screenW = window.innerWidth
    const screenH = window.innerHeight
    const rootW = this.root.offsetWidth
    const rootH = this.root.offsetHeight

    const right = screenW - clickX > rootW
    const left = !right
    const top = screenH - clickY > rootH
    const bottom = !top

    if (right) {
      this.root.style.left = `${clickX + 5}px`
    }

    if (left) {
      this.root.style.left = `${clickX - rootW - 5}px`
    }

    if (top) {
      this.root.style.top = `${clickY + 5}px`
    }

    if (bottom) {
      this.root.style.top = `${clickY - rootH - 5}px`
    }
  }

  _handleClick = event => {
    const { visible } = this.state
    const wasOutside = !(event.target.contains === this.root)

    if (wasOutside && visible) this.setState({ visible: false })
  }

  _handleScroll = () => {
    const { visible } = this.state

    if (visible) this.setState({ visible: false })
  }

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
    const { visible } = this.state
    const { fileName, link, gridViewActiveIndex, index, setTarget } = this.props
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
        {visible ? (
          <div
            ref={ref => {
              this.root = ref
            }}
            className="contextMenu"
          >
            <div className="contextMenu--option">Share this</div>
            <div className="contextMenu--option">New window</div>
            <div className="contextMenu--option">Visit official site</div>
            <div className="contextMenu--option contextMenu--option__disabled">
              View full version
            </div>
            <div className="contextMenu--option">Settings</div>
            <div className="contextMenu--separator" />
            <div className="contextMenu--option">About this app</div>
          </div>
        ) : null}
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
