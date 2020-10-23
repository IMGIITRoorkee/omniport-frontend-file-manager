import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Menu } from 'semantic-ui-react'
import { getFileIcon } from '../utils/get-file-icon'
import { getTheme } from 'formula_one'
import { setGridViewActiveIndex, setSelected } from '../actions/index'

import grid from './css/grid-view.css'
import { withRouter } from 'react-router-dom'
import { setActiveFolder } from '../actions/folderActions'

class FolderCard extends Component {
  constructor(props) {
    super(props)
  }

  handleSelect = () => {
    const { setActiveFolder, folder } = this.props
    setActiveFolder(folder)
  }
  render() {
    const { index, activeFolder, folder } = this.props
    return (
      <div id={`grid-card-${index}`} styleName="grid.file-card">
        <div styleName="grid.flex-center">
          <Icon
            styleName={folder.id !== activeFolder.id ? '' : 'grid.card-active'}
            size="huge"
            color={getTheme()}
            name={'folder outline'}
            onClick={e => this.handleSelect(e)}
            onDoubleClick={() => {
              const url = `/file-manager/${this.props.match.params.filemanager}/${folder.id}/`
              this.props.history.push(url)
            }}
          />
        </div>
        <div styleName="grid.file-name">
          <p
            onClick={this.handleSelect}
            styleName={folder.id !== activeFolder.id ? '' : 'grid.card-active'}
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

    setActiveFolder: folder => {
      dispatch(setActiveFolder(folder))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FolderCard))
