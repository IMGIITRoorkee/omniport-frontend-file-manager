import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'

import EditModal from './edit-modal'
import { editFile } from '../actions/fileActions'
import { getFolder } from '../actions/folderActions'

class EditFile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  handleEdit = () => {
    const { activeItems, editFile } = this.props
    if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.folder) {
      editFolder(activeItems[0].obj.id, this.handleSuccess)
    }
    if (activeItems.length === 1 && activeItems[0].type === ITEM_TYPE.file) {
      editFile(activeItems[0].obj.id, this.handleSuccess)
    }
    setActiveItems([])
  }

  handleSuccess = () => {
    const id = this.props.currentFolder.id
    this.props.getFolder(id)
    this.setState({
      showModal: false
    })
  }

  render () {
    const { showModal } = this.state
    const { activeItems } = this.props
    return (
      <React.Fragment>
        <Button
          icon='edit'
          circular
          color='teal'
          inverted
          onClick={() => {
            this.setState({ showModal: true })
          }}
        />
        <EditModal
          showModal={showModal}
          close={() => {
            this.setState({ showModal: false })
          }}
        />
      </React.Fragment>
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
    editFile: (pk, data, callback) => {
      return dispatch(editFile(pk, data, callback))
    },
    getFolder: id => {
      return dispatch(getFolder(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFile)
