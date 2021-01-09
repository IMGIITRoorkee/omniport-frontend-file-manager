import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editFileUsers } from '../actions/fileActions'
import { editFolderUsers, getFolder } from '../actions/folderActions'
import axios from 'axios'
import {
  Button,
  Form,
  Icon,
  Input,
  Modal,
  Popup,
  Segment,
} from 'semantic-ui-react'

import { FileIcon } from 'react-file-icon'
import {
  BASE_PROTECTED_URL,
  BASE_URL,
  FILE_TYPES,
  ITEM_TYPE
} from '../constants'
import { setActiveItems } from '../actions/itemActions'
import { USER_APIS } from '../urls'

import file from './css/share-item.css'
import { toast } from 'react-semantic-toasts'

class ShareItemModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      selectedUsersInitially: [],
      selectedUsersFinally: [],
      initialOptions: [],
      options: [],
      success: false
    }
  }

  componentDidUpdate = prevProps => {
    const { activeItems } = this.props
    if (JSON.stringify(prevProps.activeItems) != JSON.stringify(activeItems)) {
      if (activeItems.length == 1) {
        const shared_users = [...activeItems[0].obj.sharedUsers]
        const users = shared_users.map(user => {
          return user.id
        })
        const init_options = shared_users.map(user => {
          return {
            key: parseInt(`${user.id}`),
            text: `${user.fullName}`,
            value: parseInt(`${user.id}`)
          }
        })
        this.setState({
          selectedUsersInitially: users,
          selectedUsersFinally: users,
          initialOptions: init_options,
          options: init_options,
          success: false
        })
      }
    }
  }

  handleChange = (e, data) => {
    if (data) {
      this.setState({
        selectedUsersFinally: data.value
      })
    }
  }

  handleSearchChange = (e, data) => {
    const { activeItems } = this.props
    this.setState({ isLoading: true })
    const search = data.searchQuery
    axios.get(`${USER_APIS.getUserOptions}?search=${search}`).then(res => {
      this.setState({
        ...this.state,
        options: [
          ...this.state.options,
          ...res.data
            .filter(user => {
              if (
                user.id ==
                (activeItems[0]
                  ? activeItems[0].type == 'file'
                    ? activeItems[0].obj.folder.person.id
                    : activeItems[0].obj.person.id
                  : '') || this.state.options.some(usr => usr.key === user.id)
              ) {
                return false // skip
              }
              return true
            })
            .map(user => {
              const isStudent = user.roles.some(role => role.role === 'Student')
              const isFaculty = user.roles.some(
                role => role.role === 'FacultyMember'
              )
              const extra_text = isStudent
                ? `${
                    user.roles.find(role => role.role === 'Student').data
                      .enrolmentNumber
                  } - ${
                    user.roles.find(role => role.role === 'Student').data.branch
                      .name
                  }`
                : isFaculty
                ? `${
                    user.roles.find(role => role.role === 'FacultyMember').data
                      .employeeId
                  } - ${
                    user.roles.find(role => role.role === 'FacultyMember').data
                      .department.name
                  }`
                : ``
              return {
                key: parseInt(`${user.id}`),
                text: `${user.fullName} ${extra_text ? '('+ extra_text + ')' : ''}`,
                value: parseInt(`${user.id}`)
              }
            })
        ],
        isLoading: false
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({ isLoading: true })
    const { selectedUsersFinally } = this.state
    const { activeItems, editFileUsers, editFolderUsers } = this.props
    if (selectedUsersFinally != []) {
      let formdata = new FormData()
      if (selectedUsersFinally.length == 0) {
        formdata.append('shared_users', selectedUsersFinally)
      }
      for (let i = 0; i < selectedUsersFinally.length; i++) {
        formdata.append('shared_users', parseInt(selectedUsersFinally[i]))
      }
      if (activeItems[0].type == 'file') {
        editFileUsers(activeItems[0].obj.id, formdata, this.handleSuccess)
      } else {
        editFolderUsers(activeItems[0].obj.id, formdata, this.handleSuccess)
      }
    }
  }

  handleSuccess = () => {
    const { close, setActiveItems } = this.props
    this.setState({ isLoading: false, success: true })
    setActiveItems([])
    const id = this.props.currentFolder.id
    this.props.getFolder(id)
    toast({
      type: 'success',
      description: 'Shared succesfully!'
    })
    close()
  }

  handleClick = () => {
    var copyText = document.getElementById('link')
    copyText.select()
    copyText.setSelectionRange(0, 1000)
    document.execCommand('copy')
  }

  render() {
    const {
      activeItems,
      showModal,
      close,
      filemanager,
      isFilemanagerPublic
    } = this.props
    const { isLoading, options, selectedUsersFinally } = this.state
    let link = ''
    if (activeItems.length) {
      link = `${window.location.origin}${BASE_URL}/${filemanager}/${activeItems[0].obj.sharingId}/${activeItems[0].type}/${activeItems[0].obj.id}/${activeItems[0].type}`
      let protected_link
      let public_link
      if (activeItems[0].type === ITEM_TYPE.file) {
        const base_url = window.location.origin
        protected_link = new URL(
          `${BASE_PROTECTED_URL}${activeItems[0].obj.id}/`,
          base_url
        )
        public_link = new URL(activeItems[0].obj.fileUrl, base_url)

        if (activeItems[0].obj.isFilemanagerPublic) {
          link = public_link
        } else {
          link = protected_link
        }
      }
    }

    return (
      <Modal
        onClick={e => {
          e.stopPropagation()
        }}
        size='large'
        open={showModal}
        closeOnEscape={true}
        closeOnDimmerClick={true}
        onClose={close}
        closeIcon
      >
        {!isFilemanagerPublic && (
          <Modal.Header>
            <div styleName='file.share-div'>
              <div styleName='file.share-icon'>
                <Button
                  circular
                  icon='user plus'
                  color='blue'
                  styleName='file.share-icon'
                />
              </div>
              <div>Share With People</div>
            </div>
          </Modal.Header>
        )}
        {!isFilemanagerPublic && (
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Select
                search
                multiple
                placeholder='Type user name to search'
                name="selectedUsers"
                options={options}
                value={selectedUsersFinally ? selectedUsersFinally : []}
                onSearchChange={(e, data) => this.handleSearchChange(e, data)}
                onChange={(e, data) => this.handleChange(e, data)}
                minCharacters={1}
              />
              <div styleName='file.share-description-div'>
                <div styleName='file.share-div'>
                  {activeItems.length == 1 ? (
                    activeItems[0].type == 'file' ? (
                      <div styleName='file.sharing-file-icon'>
                        <FileIcon
                          {...FILE_TYPES[activeItems[0].obj.extension]}
                          extension={activeItems[0].obj.extension}
                        />
                      </div>
                    ) : (
                      <Icon name='folder open' size='large' color='grey' />
                    )
                  ) : (
                    ''
                  )}
                  {activeItems.length == 1 ? (
                    activeItems[0].type == 'file' ? (
                      <p>{activeItems[0].obj.fileName}</p>
                    ) : (
                      <p>{activeItems[0].obj.folderName}</p>
                    )
                  ) : (
                    ''
                  )}
                </div>
                {!this.state.success ? (
                  <div styleName='file.share-div'>
                    <Button
                      color='blue'
                      loading={isLoading}
                      className='right floated'
                      type='submit'
                    >
                      Submit
                    </Button>
                  </div>
                ) : (
                  <div styleName='file.share-div'>
                    <Icon
                      color='green'
                      className='center'
                      size='large'
                      name='check circle'
                    />
                  </div>
                )}
              </div>
            </Form>
          </Modal.Content>
        )}
        <Modal.Header>
          <div styleName='file.share-div'>
            <div styleName='file.share-icon'>
              <Button
                circular
                icon='share'
                styleName='file.share-icon'
                color='grey'
              />
            </div>
            <div>Get Shareable Link</div>
          </div>
        </Modal.Header>
        <Modal.Content>
          <Segment styleName='file.share-div'>
            <Input
              styleName='file.share-link-input'
              id='link'
              value={link}
              type='text'
            />
            <div className='right floated'>
              <Popup
                trigger={
                  <Icon
                    styleName='file.share-link-copy-icon'
                    name='copy'
                    link
                    title='Click to copy'
                    onClick={this.handleClick}
                    color='grey'
                    size='large'
                  />
                }
                content={`copied!`}
                on='click'
              />
            </div>
          </Segment>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeItems: state.items.activeItems,
    currentFolder: state.folders.selectedFolder,
    isFilemanagerPublic: state.filemanagers.isFilemanagerPublic
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    },
    deleteFolder: id => {
      dispatch(deleteFolder(id))
    },
    editFolderUsers: (id, formObj, callback) => {
      dispatch(editFolderUsers(id, formObj, callback))
    },
    editFileUsers: (pk, data, callback) => {
      return dispatch(editFileUsers(pk, data, callback))
    },
    getFolder: id => {
      return dispatch(getFolder(id))
    },
    setActiveItems: items => dispatch(setActiveItems(items))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareItemModal)
