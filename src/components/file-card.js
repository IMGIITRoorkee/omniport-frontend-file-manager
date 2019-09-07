import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { getFileIcon } from '../utils/get-file-icon'
import { getTheme } from 'formula_one'
import { setGridViewActiveIndex, setSelected } from '../actions/index'
import grid from './css/grid-view.css'

class FileCard extends Component {
  handleSelect = () => {
    const {
      setGridViewActiveIndex,
      setSelected,
      index,
      link,
      fileName,
      id
    } = this.props
    setGridViewActiveIndex(index)
    setSelected({ pk: id, fileName, link })
  }
  render() {
    const { fileName, link, gridViewActiveIndex, index } = this.props
    return (
      <div styleName="grid.file-card" onClick={this.handleSelect}>
        <div styleName="grid.flex-center">
          <Icon
            styleName={gridViewActiveIndex !== index ? '' : 'grid.card-active'}
            size="huge"
            color={getTheme()}
            name={getFileIcon(link)}
          />
        </div>
        <div styleName="grid.file-name">
          <p
            styleName={gridViewActiveIndex !== index ? '' : 'grid.card-active'}
          >
            {fileName}
          </p>
        </div>
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileCard)
