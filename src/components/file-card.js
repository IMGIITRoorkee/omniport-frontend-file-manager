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

class FileCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      activeItem: ''
    }
    // this.root = React.createRef()
  }
  // componentDidMount() {
  //   // document.addEventListener('contextmenu', this._handleContextMenu)
  //   document.addEventListener('click', this._handleClick)
  //   document.addEventListener('scroll', this._handleScroll)
  // }

  // componentWillUnmount() {
  //   // document.removeEventListener('contextmenu', this._handleContextMenu)
  //   document.removeEventListener('click', this._handleClick)
  //   document.removeEventListener('scroll', this._handleScroll)
  // }
  // _handleClick = event => {
  //   const { visible } = this.state
  //   const wasOutside = !(event.target.contains === this.root)

  //   if (wasOutside && visible) this.setState({ visible: false })
  // }

  // handleContextMenuToggle = (e, value) => {
  //   e.preventDefault()
  //   const { setGridViewActiveIndex, index } = this.props
  //   setGridViewActiveIndex(index)
  //   this.setState({
  //     visible: value
  //   })
  //   if (e && e.type === 'click') e.stopPropagation()
  // }

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
    // const { visible, activeItem } = this.state
    const { fileName, link, gridViewActiveIndex, index, setTarget } = this.props
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
            name={getFileIcon(link)}
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
            {fileName}
          </p>
        </div>
      </div>
      // <Popup
      //   on="click"
      //   trigger={

      //   }
      //   open={visible}
      //   onClose={e => this.handleContextMenuToggle(e, false)}
      //   onOpen={e => this.handleContextMenuToggle(e, true)}
      //   onClick={e => this.handleSelect(e)}
      // >
      //   <Menu vertical>
      //     <Menu.Item
      //       name="edit"
      //       active={activeItem === 'edit'}
      //       onClick={this.handleEdit}
      //     >
      //       Edit
      //     </Menu.Item>

      //     <Menu.Item
      //       name="download"
      //       active={activeItem === 'download'}
      //       onClick={this.handleItemClick}
      //     >
      //       Download
      //     </Menu.Item>

      //     <Menu.Item
      //       name="delete"
      //       active={activeItem === 'delete'}
      //       onClick={this.handleDelete}
      //     >
      //       Delete
      //     </Menu.Item>
      //   </Menu>
      // </Popup>
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
