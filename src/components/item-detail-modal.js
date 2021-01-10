import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalContent, Table } from 'semantic-ui-react'

import { setActiveItems } from '../actions/itemActions'

import file from './css/item-properties-modal.css'
import { formatStorage } from '../helpers/helperfunctions'

class ItemDetailsModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active_item: null
    }
  }

  componentDidUpdate = prevProps => {
    const { activeItems } = this.props
    if (JSON.stringify(prevProps.activeItems) != JSON.stringify(activeItems)) {
      if (activeItems.length == 1) {
        this.setState({
          active_item: activeItems[0]
        })
      }
    }
  }

  formatDate (string) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(string).toLocaleDateString([], options)
  }

  render () {
    const { showModal, close, filemanager, currentFolder } = this.props
    const { active_item } = this.state
    return (
      <Modal
        onClick={e => {
          e.stopPropagation()
        }}
        size='tiny'
        open={showModal}
        closeOnEscape={true}
        closeOnDimmerClick={true}
        onClose={close}
        closeIcon
      >
        <Modal.Header>
          <div styleName='file.detail-div'>
            <div styleName='file.detail-icon'>
              <Button
                circular
                icon='info'
                color='blue'
                styleName='file.detail-icon'
              />
            </div>
            <div>Details</div>
          </div>
        </Modal.Header>
        <ModalContent>
          <Table unstackable>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Type</Table.Cell>
                <Table.Cell>
                  {active_item
                    ? active_item.type +
                      (active_item.type == 'file'
                        ? ' (' + active_item.obj.extension + ')'
                        : '')
                    : ''}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Name</Table.Cell>
                <Table.Cell>
                  {active_item
                    ? active_item.type == 'file'
                      ? active_item.obj.fileName
                      : active_item.obj.folderName
                    : ''}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Size</Table.Cell>
                <Table.Cell>
                  {active_item
                    ? active_item.type == 'file'
                      ? formatStorage(active_item.obj.size)
                      : formatStorage(active_item.obj.contentSize)
                    : ''}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Location</Table.Cell>
                <Table.Cell>
                  {currentFolder
                    ? currentFolder.type == 'shared'
                      ? 'shared_items'
                      : currentFolder.type == 'starred'
                      ? 'starred_items'
                      : currentFolder.folderName
                    : ''}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Owner</Table.Cell>
                <Table.Cell>
                  {active_item
                    ? active_item.type == 'file'
                      ? active_item.obj.folder.person.fullName
                      : active_item.obj.person.fullName
                    : ''}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Modified</Table.Cell>
                <Table.Cell>
                  {active_item
                    ? this.formatDate(active_item.obj.datetimeModified)
                    : ''}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Created</Table.Cell>
                <Table.Cell>
                  {active_item
                    ? this.formatDate(active_item.obj.datetimeCreated)
                    : ''}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </ModalContent>
      </Modal>
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
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetailsModal)
