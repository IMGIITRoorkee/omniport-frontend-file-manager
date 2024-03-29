import React from 'react'
import { Icon, Modal, Button, Header } from 'semantic-ui-react'

import modal from './css/confirmModal.css'

const modalTypes = item => ({
  normal: {},
  remove: {
    // header: `Remove ${item}`,
    header: {
      main: (
        <>
          <Icon name='trash' color='blue' />
          &nbsp;Delete
        </>
      )
    },
    messeageObject: {
      main: (
        <>
          {/* <Icon name='trash' Color='red' />
          Are you sure you want to remove following {item} ? */}
        </>
      ),
      extras: ''
    },
    buttonColor: 'negative',
    buttonLabel: 'Delete'
  },
  save: {
    header: {
      main: (
        `Save ${item}`
      )
    },
    messeageObject: {
      main: <>Are you sure you want to save {item} ?</>,
      extras: ''
    },
    buttonLabel: 'Save',
    buttonColor: 'positive'
  },
  update: {
    header: `Update ${item}`,
    messeageObject: {
      main: <>Are you sure you want to update {item} ?</>,
      extras: ''
    },
    buttonLabel: 'Update',
    buttonColor: 'positive'
  },
  reject: {
    header: `Reject ${item}`,
    messeageObject: {
      main: <>Are you sure you want to Reject {item} ?</>,
      extras: ''
    },
    buttonLabel: 'Reject',
    buttonColor: 'negative'
  },
  cancel: {
    header: `Cancel ${item}`,
    messeageObject: {
      main: <>Are you sure you want to cancel {item} ?</>,
      extras: ''
    },
    buttonLabel: 'Cancel',
    buttonColor: 'negative'
  }
})

const ConfirmModal = ({
  show = true,
  handleClose = () => {},
  handleSubmit = () => {},
  type = 'remove',
  item = 'task',
  dialogText = '',
  dialogMessage = '',
  itemList = []
}) => {
  item = itemList.length > 1 ? item + 's' : item
  const stateObject = modalTypes(item)[type]
  return (
    <Modal onClick={(e) => {e.stopPropagation()}} open={show} onClose={handleClose}>
      <Modal.Header>{stateObject.header.main}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {dialogMessage ? (
            <Header>{dialogMessage}</Header>
          ) : (
            <>
              <Header className='d-inline-block'>
                {stateObject.messeageObject.main}
              </Header>
              <Header className='pl-1 d-flex justify-content-center fw-bold'>
                {stateObject.messeageObject.extras}
              </Header>
            </>
          )}
        </Modal.Description>
        {dialogText ? (
          <p>{dialogText}</p>
        ) : itemList.length ? (
          itemList.map((elem, index) => <p key={index}>{elem}</p>)
        ) : (
          ''
        )}
        <div styleName='modal.actions'>
          <Button onClick={handleClose} styleName='modal.action-button'>Cancel</Button>
          <Button
            onClick={handleSubmit}
            positive={stateObject.buttonColor === 'positive'}
            negative={stateObject.buttonColor === 'negative'}
            styleName='modal.action-button'
          >
            {stateObject.buttonLabel}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  )
}
export default ConfirmModal
