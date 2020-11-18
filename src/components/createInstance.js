import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Breadcrumb,
  Header,
  Form,
  Button,
  Icon
} from 'semantic-ui-react'
import css from './css/approveRequest.css'
import ErrorBoundary from './error-boundary'
import { createFilemanager } from '../actions/filemanagerActions'
import { spaceOptions, roleOptions } from '../constants'

class CreateInstance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formObj: {
        filemanagerName: '',
        rootFolderName: '',
        rolesAllowed: [],
        logo: null,
        maxSpace: null,
        // isLoading: false,
        success: false
      }
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
      filemanagerUrlPath:'',
      rolesAllowed: [],
      logo: null,
      maxSpace: null,
      success: false
    }
  }

  handleChange = (e, { name, value }) =>
    this.setState({ formObj: { ...this.state.formObj, [name]: value } })

  handleImageChange = e => {
    const image = e.target.files[0]
    this.setState({
      formObj: {
        ...this.state.formObj,
        logo: image
      }
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

  handleSubmit = e => {
    e.preventDefault()
    const {
      filemanagerName,
      filemanagerUrlPath,
      rootFolderName,
      logo,
      rolesAllowed,
      maxSpace
    } = this.state.formObj
    const { createFilemanager } = this.props
    if (filemanagerName && rootFolderName && logo && rolesAllowed) {
      let formdata = new FormData()
      formdata.append(`logo`, logo)
      formdata.append('filemanager_name', filemanagerName)
      formdata.append('filemanager_url_path',filemanagerUrlPath)
      formdata.append('folder_name_template', rootFolderName)
      for (let i = 0; i < rolesAllowed.length; i++) {
        formdata.append('filemanager_access_roles', rolesAllowed[i].toString())
      }
      formdata.append('max_space', parseInt(maxSpace))
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
  render () {
    const {
      filemanagerName,
      rootFolderName,
      filemanagerUrlPath,
      rolesAllowed,
      logo,
      maxSpace,
      success
    } = this.state.formObj
    const { createFilemanagerPending } = this.props

    return (
      <ErrorBoundary>
        <Container styleName='css.main-container'>
          <Breadcrumb size='big'>
            <Breadcrumb.Section>
              <Header>Create new filemanager instance</Header>
            </Breadcrumb.Section>
          </Breadcrumb>
          <Header dividing />
          <Form center ui inverted onSubmit={this.handleSubmit}>
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
              placeholder='Root Folder name'
              name='rootFolderName'
              label='Root Folder name :'
              value={rootFolderName}
              onChange={this.handleChange}
            />
            <Form.Select
              search
              placeholder='Max Space'
              name='maxSpace'
              options={spaceOptions}
              label='Max Space : '
              value={maxSpace}
              onChange={this.handleChangeSelect}
            />
            <Form.Input
              placeholder='Logo'
              name='image'
              label='Add Logo : '
              id='image'
              type='file'
              accept='image/png, image/jpeg, image/jfif'
              // value = {logo}
              onChange={this.handleImageChange}
            />
            <Form.Select
              search
              multiple
              placeholder='Roles Allowed'
              name='rolesAllowed'
              options={roleOptions}
              label='Roles Allowed : '
              value={rolesAllowed}
              onChange={this.handleChangeSelect}
            />
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
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => {
  return {
    createFilemanagerPending: state.filemanagers.createFilemanagerPending
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
