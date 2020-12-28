import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Breadcrumb,
  Header,
  Form,
  Button,
  Icon,
  Divider,
  Label,
} from 'semantic-ui-react'
import css from './css/approveRequest.css'
import ErrorBoundary from './error-boundary'
import { createFilemanager } from '../actions/filemanagerActions'
import { spaceOptions, roleOptions, spaceOptionUnits } from '../constants'
import UploadFilesModal from './uploadFileModal'
import { formatStorage } from '../helpers/helperfunctions'
import { string } from 'prop-types'

class CreateInstance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formObj: {
        filemanagerName: '',
        rootFolderName: '',
        accessPermissions: "'Student' in get_all_roles(person).keys()",
        extraSpaceOptions: [],
        extraSpaceNumber: null,
        extraSpaceUnit: null,
        isPublic: false,
        maxSpaceNumber: null,
        maxSpaceUnit: null,
        logo: null,
        success: false
      },
      showModal: false,
      files: []
    }
  }

  componentDidMount = () => {
    this.state = {
      formObj: this.getInitialObj()
    }
  }

  getInitialObj = () => {
    return {
      filemanagerName: '',
      rootFolderName: '',
      filemanagerUrlPath: '',
      accessPermissions: "'Student' in get_all_roles(person).keys()",
      extraSpaceOptions: [],
      extraSpaceNumber: null,
      extraSpaceUnit: null,
      isPublic: false,
      logo: null,
      maxSpaceUnit: '',
      maxSpaceNumber: '',
      success: false
    }
  }

  handleChange = (e, { name, value }) =>
    this.setState({ formObj: { ...this.state.formObj, [name]: value } })

  handleImageChange = e => {
    e.preventDefault()
    const image = this.state.files[0]
    this.setState({
      formObj: {
        ...this.state.formObj,
        logo: image
      },
      showModal: false
    })
  }

  handleChangeSelect = (e, data) => {
    this.setState({
      formObj: {
        ...this.state.formObj,
        [data.name]: data.value
      }
    })
  }

  handleExtraDataSubmit = e => {
    e.preventDefault()
    const { extraSpaceNumber, extraSpaceUnit } = this.state.formObj
    if (Boolean(parseInt(extraSpaceNumber)) && extraSpaceUnit) {
      this.setState({
        formObj: {
          ...this.state.formObj,
          extraSpaceOptions: [
            ...this.state.formObj.extraSpaceOptions,
            parseInt(extraSpaceNumber) * extraSpaceUnit
          ],
          extraSpaceNumber: '',
          extraSpaceUnit: ''
        }
      })
    }
  }

  handleExtraSpaceOptionsChange = opt => {
    var array = [...this.state.formObj.extraSpaceOptions] // make a separate copy of the array
    var index = array.indexOf(opt)
    array.splice(index, 1)
    this.setState({
      formObj: {
        ...this.state.formObj,
        extraSpaceOptions: array
      }
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const {
      filemanagerName,
      filemanagerUrlPath,
      rootFolderName,
      logo,
      accessPermissions,
      maxSpaceNumber,
      maxSpaceUnit,
      extraSpaceOptions,isPublic
    } = this.state.formObj
    const { createFilemanager } = this.props
    if (
      filemanagerName &&
      filemanagerUrlPath &&
      logo &&
      accessPermissions &&
      extraSpaceOptions &&
      extraSpaceOptions.length &&
      maxSpaceUnit &&
      maxSpaceNumber
    ) {
      let formdata = new FormData()
      let max_space = maxSpaceNumber*maxSpaceUnit
      formdata.append(`logo`, logo)
      formdata.append('filemanager_name', filemanagerName)
      formdata.append('filemanager_url_path', filemanagerUrlPath)
      formdata.append('folder_name_template', rootFolderName)
      formdata.append('filemanager_access_permissions', accessPermissions)
      for (let i = 0; i < extraSpaceOptions.length; i++) {
        formdata.append('filemanager_extra_space_options', extraSpaceOptions[i])
      }
      formdata.append('max_space', parseInt(max_space))
      formdata.append('is_public', Boolean(isPublic))
      createFilemanager(formdata, this.handleSuccess)
    }
  }

  handleSuccess = () => {
    this.setState({
      formObj: {
        ...this.state.formObj,
        success: true
      }
    })
  }

  handleCreateAnother = () => {
    this.setState({
      formObj: this.getInitialObj()
    })
  }
  render() {
    const {
      filemanagerName,
      rootFolderName,
      filemanagerUrlPath,
      accessPermissions,
      extraSpaceNumber,
      extraSpaceOptions,
      logo,
      maxSpaceNumber,
      maxSpaceUnit,
      extraSpaceUnit,
      success,
      isPublic
    } = this.state.formObj
    const { showModal, files } = this.state
    const { createFilemanagerPending, uploadFilePending } = this.props

    return (
      <ErrorBoundary>
        <Container styleName='css.main-container'>
          <Breadcrumb size='big'>
            <Breadcrumb.Section>
              <Header>Create new filemanager instance</Header>
            </Breadcrumb.Section>
          </Breadcrumb>
          <Header dividing />
          <Form center ui onSubmit={this.handleSubmit}>
            <Form.Input
              placeholder='Filemanager Name'
              name='filemanagerName'
              label='Filemanager Name : '
              value={filemanagerName}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder='Root Folder url path'
              name='filemanagerUrlPath'
              label='Root Folder Url Path :'
              value={filemanagerUrlPath}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder='Default: person.user.username'
              name='rootFolderName'
              label='Root Folder Template :'
              value={rootFolderName}
              onChange={this.handleChange}
            />
            <Form.Group widths='equal' styleName='css.extra-data-form-group'>
                <Form.Input
                  placeholder='Int'
                  type='number'
                  name='maxSpaceNumber'
                  label='Max Space Value'
                  value={maxSpaceNumber}
                  onChange={this.handleChange}
                />
                <Form.Select
                  search
                  placeholder='Max Space Unit'
                  name='maxSpaceUnit'
                  options={spaceOptionUnits}
                  label='Max Space Unit : '
                  value={maxSpaceUnit}
                  onChange={this.handleChangeSelect}
                />
              </Form.Group>
            <Form.TextArea
              placeholder='Access Permission'
              type='TextArea'
              name='accessPermissions'
              label='Access Permission'
              value={accessPermissions}
              onChange={this.handleChange}
            />

            <Form
              onSubmit={this.handleExtraDataSubmit}
              styleName='css.extra-data-form'
            >
              <Form.Group widths='equal' styleName='css.extra-data-form-group'>
                <Form.Input
                  placeholder='Int'
                  type='number'
                  name='extraSpaceNumber'
                  label='Extra Space Value'
                  value={extraSpaceNumber}
                  onChange={this.handleChange}
                />
                <Form.Select
                  search
                  placeholder='Extra Space Unit'
                  name='extraSpaceUnit'
                  options={spaceOptionUnits}
                  label='Extra Space Unit : '
                  value={extraSpaceUnit}
                  onChange={this.handleChangeSelect}
                />
                <Form.Button success content='Submit' />
              </Form.Group>
              {extraSpaceOptions &&
                extraSpaceOptions.map(opt => (
                  <Label
                    as='a'
                    title={`add ${formatStorage(opt)} extra`}
                    onClick={() => this.handleExtraSpaceOptionsChange(opt)}
                    horizontal
                    size='large'
                  >
                    {formatStorage(opt)}
                  </Label>
                ))}
            </Form>

            <Form.Checkbox
              checked={isPublic}
              onChange={(e, { name, checked }) =>
                this.setState({
                  formObj: { ...this.state.formObj, [name]: checked }
                })
              }
              name={'isPublic'}
              label='Public Filemanager'
            />
            <Button
              onClick={() => {
                this.setState({ showModal: true })
              }}
              label={!Boolean(logo) ? 'Add Logo' : 'Update Logo'}
              icon='upload'
            />
            {Boolean(logo) && (
              <div>
                <img src={logo.preview} alt={logo.name} styleName='css.image' />
              </div>
            )}
            <Divider hidden />
            {success ? (
              <span>
                <Button onClick={this.handleCreateAnother}>
                  Create Another Filemanager
                </Button>
                <Icon
                  color='green'
                  className='center'
                  size='large'
                  name='check circle'
                />
              </span>
            ) : (
              <Form.Button
                success
                content='Submit'
                loading={createFilemanagerPending}
              />
            )}
          </Form>
        </Container>
        <UploadFilesModal
          isMultiple={false}
          files={files}
          label="Click to upload your filemanager's logo"
          isUploading={uploadFilePending}
          setFiles={files => {
            this.setState({ files: files })
          }}
          acceptedFiles={['image/*']}
          show={showModal}
          onHide={() => {
            this.setState({ showModal: false })
          }}
          handleUpload={e => {
            this.handleImageChange(e)
          }}
        />
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => {
  return {
    createFilemanagerPending: state.filemanagers.createFilemanagerPending,
    uploadFilePending: state.files.uploadFilePending
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createFilemanager: (data, callback) => {
      return dispatch(createFilemanager(data, callback))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateInstance)
