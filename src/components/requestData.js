import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Form,
  Checkbox,
  Button,
  Modal,
  Icon,
  Label,
  Divider,
  LabelGroup
} from 'semantic-ui-react'
import {
  getAllRootFoldersRequest,
  generateDataRequest
} from '../actions/folderActions'
import setActiveItems from '../actions/itemActions'
import { ONE_GB } from '../constants'
import { formatStorage } from '../helpers/helperfunctions'

const options = [
  { key: '1', label: '1 GB', value: 1 * ONE_GB, color: 'red' },
  { key: '2', label: '2 GB', value: 5 * ONE_GB, color: 'orange' },
  { key: '3', label: '5 GB', value: 5 * ONE_GB, color: 'green' }
]

class RequestData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      add_data: null,
      showModal: false,
      labelColor: null
    }
  }

  handleChange = (value, color) => {
    this.setState({ add_data: value, labelColor: color })
  }

  handleSubmit = () => {
    let { add_data } = this.state
    const { currentFolder, generateDataRequest } = this.props

    if (add_data && currentFolder) {
      let formdata = new FormData()
      formdata.append('additional_space', add_data)
      generateDataRequest(currentFolder.id, formdata, this.handleSuccess)
    }
  }

  handleSuccess = () => {
    this.props.getRootFolders()
    this.setState({
      add_data: null,
      showModal: false
    })
  }
  close = () => {
    this.setState({
      showModal: false
    })
  }
  render() {
    const { add_data, showModal, labelColor } = this.state
    const { currentFolder } = this.props
    return (
      <React.Fragment>
        <Icon
          name='add'
          onClick={() => this.setState({ showModal: true })}
          title='Request more space'
          color='yellow'
          size='large'
        />
        {showModal ? (
          <Modal
            size='large'
            open={showModal}
            closeOnEscape={true}
            closeOnDimmerClick={true}
            onClose={this.close}
            closeIcon
          >
            <Modal.Header>Request More Space</Modal.Header>
            <Modal.Content>
              <h4>Extra Data needed</h4>
              <LabelGroup>
                {options.map(opt => (
                  <Label
                    color={opt.color}
                    key={opt.key}
                    as='a'
                    title={`add ${opt.label} extra`}
                    onClick={() => this.handleChange(opt.value, opt.color)}
                    horizontal
                    size='large'
                  >
                    {opt.label}
                  </Label>
                ))}
              </LabelGroup>
              <Divider />
              {add_data ? (
                <div>
                  <Label color={labelColor} horizontal size='large'>
                    {`Request for ${formatStorage(add_data)} extra data on 
                  ${currentFolder.filemanagername} will be initiated.`}
                  </Label>
                </div>
              ) : (
                ''
              )}
              <Divider />
              <Button primary onClick={() => this.handleSubmit()}>
                Submit
              </Button>
            </Modal.Content>
          </Modal>
        ) : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeItems: state.items.activeItems,
    currentFolder: state.folders.activeFolder
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getRootFolders: () => {
      dispatch(getAllRootFoldersRequest())
    },
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    },
    generateDataRequest: (id, data, callback) => {
      dispatch(generateDataRequest(id, data, callback))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestData)
