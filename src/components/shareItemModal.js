import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editFileUsers } from '../actions/fileActions'
import { editFolderUsers } from '../actions/folderActions'
import axios from 'axios'
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Label,
  Modal,
  Popup,
  Segment,
  Table,
  TableCell
} from 'semantic-ui-react'

import { FileIcon } from 'react-file-icon'
import { FILE_TYPES } from '../constants'
import { setActiveItems } from '../actions/itemActions'
import { USER_APIS } from '../urls'

import file from './css/share-item.css'

class ShareItemModal extends Component {
  constructor (props) {
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
    this.setState({ isLoading: true })
    const search = data.searchQuery
    axios.get(`${USER_APIS.getUserOptions}?search=${search}`).then(res => {
      this.setState({
        ...this.state,
        options: [
          ...this.state.initialOptions,
          ...res.data.map(user => {
            return {
              key: parseInt(`${user.id}`),
              text: `${user.fullName}`,
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
    close()
  }

  handleClick = () => {
    var copyText = document.getElementById('link')
    copyText.select()
    copyText.setSelectionRange(0, 100)
    document.execCommand('copy')
  }

  render () {
    const { activeItems, showModal, close, filemanager } = this.props
    const { isLoading, options, selectedUsersFinally } = this.state
    const link =
      activeItems.length == 1
        ? `http://0.0.0.0:61000/file-manager/${filemanager}/${activeItems[0].obj.sharingId}/${activeItems[0].type}/${activeItems[0].obj.id}/${activeItems[0].type}`
        : ''
    return (
      <Modal
        size='large'
        open={showModal}
        closeOnEscape={true}
        closeOnDimmerClick={true}
        onClose={close}
        closeIcon
      >
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
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Select
              search
              multiple
              placeholder='Type user name to search'
              name='selectedUsers'
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
    activeItems: state.items.activeItems
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
    setActiveItems: items => dispatch(setActiveItems(items))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareItemModal)