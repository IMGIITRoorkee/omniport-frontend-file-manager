import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Checkbox, Button, Modal, Icon } from 'semantic-ui-react'
import { editFile } from '../actions/index'

class EditModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileName: '',
      isPublic: false
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
  handleChange = e => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }
  handleSubmit = e => {
    e.preventDefault()
    let { fileName, isPublic } = this.state
    const { selectedData, editFile } = this.props

    if (fileName) {
      var formData = new FormData()
      formData.append('file_name', fileName)
      formData.append('is_public', isPublic)
      editFile(selectedData.pk, formData, this.successCallback)
    }
  }
  handleCheck = () => {
    this.setState({
      isPublic: !this.state.isPublic
    })
  }
  successCallback = () => {
    this.props.close()
  }
  render() {
    const { fileName, isPublic } = this.state
    const { isLoading, showModal, close } = this.props
    return (
      <Modal
        size="large"
        open={showModal}
        closeOnEscape={true}
        closeOnDimmerClick={true}
        onClose={close}
        closeIcon
      >
        <Modal.Header>Editing file</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>File Name</label>
              <input
                name="fileName"
                value={fileName}
                onChange={this.handleChange}
                placeholder="File Name"
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                checked={isPublic}
                onChange={this.handleCheck}
                label="Public"
              />
            </Form.Field>
            <Button loading={isLoading} type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedData: state.files.selectedData,
    isLoading: state.files.isLoading,
    tabular: state.files.tabular
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
)(EditModal)
