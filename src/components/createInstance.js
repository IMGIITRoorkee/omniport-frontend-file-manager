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
import { createFilemanager } from '../actions/itemActions'
import { ONE_GB } from '../constants'

const spaceOptions = [
  { key: '1', text: '1 GB', value: 1 * ONE_GB },
  { key: '2', text: '2 GB', value: 2 * ONE_GB },
  { key: '3', text: '5 GB', value: 5 * ONE_GB },
  { key: '4', text: '10 GB', value: 10 * ONE_GB }
]

const roleOptions = [
  { key: '1', text: 'Student', value: 'Student' },
  { key: '2', text: 'FacultyMember', value: 'FacultyMember' },
  { key: '3', text: 'Maintainer', value: 'Maintainer' },
  { key: '4', text: 'Guest', value: 'Guest' }
]

class CreateInstance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filemanagerName: '',
      rootFolderName: '',
      rolesAllowed: [],
      logo: null,
      maxSpace: null,
      isLoading: false,
      success: false
    }
  }
  componentDidMount = () => {}

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleImageChange = e => {
    const image = e.target.files[0]
    this.setState({
      ...this.state,
      logo: image
    })
  }

  handleChangeSelect = (e, data) => {
    console.log(data)
    this.setState({
      ...this.state,
      [data.name]: data.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({ isLoading: true })
    const {
      filemanagerName,
      rootFolderName,
      logo,
      rolesAllowed,
      maxSpace
    } = this.state
    const { createFilemanager } = this.props
    if (filemanagerName && rootFolderName && logo && rolesAllowed) {
      let formdata = new FormData()
      formdata.append(`logo`, logo)
      formdata.append('filemanager_name', filemanagerName)
      formdata.append('folder_name_template', rootFolderName)
      for (let i = 0; i < rolesAllowed.length; i++) {
        formdata.append('filemanager_access_roles', rolesAllowed[i].toString())
      }
      formdata.append('max_space', parseInt(maxSpace))
      console.log(formdata['filemanager_access_roles'])
      createFilemanager(formdata, this.handleSuccess)
    }
  }

  handleSuccess = () => {
    this.setState({
      isLoading: false,
      success: true
    })
  }

  handleCreateAnother = () => {
    this.setState({
      filemanagerName: '',
      rootFolderName: '',
      rolesAllowed: [],
      logo: null,
      maxSpace: null,
      isLoading: false,
      success: false
    })
  }
  render () {
    const {
      filemanagerName,
      rootFolderName,
      rolesAllowed,
      logo,
      maxSpace,
      success,
      isLoading
    } = this.state
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
              <Form.Button success content='Submit' loading={isLoading} />
            )}
          </Form>
        </Container>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    createFilemanager: (data, callback) => {
      return dispatch(createFilemanager(data, callback))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateInstance)
