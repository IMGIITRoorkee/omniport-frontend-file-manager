import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Button, Icon, Modal } from 'semantic-ui-react'
// import {
//   lastVisited,
//   fetchFilesFolder,
//   tabulation,
//   unsetSelected,
//   deleteFile,
//   fetchFiles,
// } from '../actions/index'
import { tabulation } from '../actions/itemActions'
import Upload from './app-upload'
import Edit from './edit-file'
import ConfirmModal from './confirmModal'

import file from './css/file.css'
import CreateFolderModal from './createFolderModal'
import { withRouter } from 'react-router-dom'
import { deleteFolder, setActiveFolder } from '../actions/folderActions'
import { deleteFile } from '../actions/fileAction'
import { setActiveItems } from '../actions/itemActions'
import { ITEM_TYPE } from '../constants'
class Bar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDelete: false
    }
  }
  handleDownload = () => {
    const { isSelected, selectedData } = this.props
    if (isSelected) {
      let link = document.createElement('a')
      link.download = selectedData.fileName
      link.href = selectedData.link
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
  handleBack = () => {
    this.props.history.goBack()
  }
  successBackCallback = () => {
    const { currentFolder, lastVisitedAct } = this.props
    lastVisitedAct(currentFolder)
  }
  handleTabulation = () => {
    const { tabulation, tabular, setActiveItems } = this.props
    tabulation(!tabular)
    setActiveItems([])
  }

  handleDelete = () => {
    const { deleteFolder, activeItems, deleteFile } = this.props
    if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.folder) {
      deleteFolder(activeItems[0].obj.id)
    }
    if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.file) {
      deleteFile(activeItems[0].obj.id)
    }
    setActiveItems([])
    this.setState({ isDelete: false })
  }
  successCallback = () => {
    this.props.fetchFiles()
    this.setState({
      isDelete: false
    })
  }
  render () {
    const { tabular, activeItems } = this.props
    const { isDelete } = this.state
    return (
      <Segment styleName='file.navbar'>
        <div styleName='file.navbar-first'>
          <div>
            <Button
              disabled={
                !Boolean(
                  this.props.currentFolder && this.props.currentFolder.root
                )
              }
              onClick={this.handleBack}
              icon='angle left'
            />
          </div>
          <div>
            <Button
              icon='angle right'
              onClick={() => {
                this.props.history.goForward()
              }}
            />
          </div>
          <div>
            <Button
              onClick={this.handleTabulation}
              icon={tabular ? 'columns' : 'table'}
            />
          </div>
        </div>
        <div styleName='file.navbar-first'>
          <div>
            <Upload />
          </div>
          <CreateFolderModal />
          <div></div>
          {!tabular ? (
            <React.Fragment>
              <div>
                <Edit />
              </div>
              <div>
                <Button
                  disabled={activeItems.length !== 1}
                  onClick={this.handleDownload}
                  icon
                  labelPosition='left'
                  primary
                  basic
                >
                  <Icon name='download' />
                  Download
                </Button>
              </div>
              <div>
                <Button
                  disabled={activeItems.length !== 1}
                  onClick={() => {
                    this.setState({ isDelete: true })
                  }}
                  icon
                  labelPosition='left'
                  primary
                  basic
                >
                  <Icon name='delete' />
                  Delete
                </Button>
              </div>
            </React.Fragment>
          ) : null}
          <ConfirmModal
            show={isDelete}
            handleClose={() => {
              this.setState({ isDelete: false })
            }}
            handleSubmit={this.handleDelete}
          />
        </div>
      </Segment>
    )
  }
}

const mapStateToProps = state => {
  return {
    // isSelected: state.files.isSelected,
    // selectedData: state.files.selectedData,
    // topLevel: state.files.topLevel,
    // currentFolder: state.files.currentFolder,
    // lastVisited: state.files.lastVisited,
    tabular: state.items.tabular,
    currentFolder: state.folders.selectedFolder,
    // activeFolder: state.folders.activeFolder,
    activeItems: state.items.activeItems
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // lastVisitedAct: data => {
    //   dispatch(lastVisited(data))
    // },
    // fetchFilesFolder: (data, callback) => {
    //   dispatch(fetchFilesFolder(data, callback))
    // },
    tabulation: bool => {
      dispatch(tabulation(bool))
    },
    // unsetSelected: () => {
    //   dispatch(unsetSelected())
    // },
    // deleteFile: (pk, callback) => {
    //   dispatch(deleteFile(pk, callback))
    // },
    // fetchFiles: () => {
    //   dispatch(fetchFiles())
    // },
    deleteFile: id => {
      dispatch(deleteFile(id))
    },
    deleteFolder: id => {
      dispatch(deleteFolder(id))
    },
    setActiveFolder: obj => {
      dispatch(setActiveFolder(obj))
    },
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Bar))
