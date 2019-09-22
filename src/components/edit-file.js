import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import { editFile } from '../actions/index'
import EditModal from './edit-modal'

class EditFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
  }
  componentDidUpdate(prevProps) {
    const { selectedData } = this.props
    if (
      JSON.stringify(prevProps.selectedData) !== JSON.stringify(selectedData)
    ) {
      this.setState({
        fileName: selectedData.fileName,
        isPublic: selectedData.isPublic
      })
    }
  }
  handleEdit = () => {
    this.setState({
      showModal: true
    })
  }
  close = () => {
    this.setState({
      showModal: false
    })
  }
  render() {
    const { showModal } = this.state
    const { isSelected } = this.props
    return (
      <React.Fragment>
        <Button
          disabled={!isSelected}
          icon
          labelPosition="left"
          positive
          onClick={this.handleEdit}
        >
          <Icon name="edit" />
          Edit
        </Button>

        <EditModal showModal={showModal} close={this.close} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    isSelected: state.files.isSelected,
    selectedData: state.files.selectedData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editFile: (pk, data, callback) => {
      return dispatch(editFile(pk, data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditFile)
