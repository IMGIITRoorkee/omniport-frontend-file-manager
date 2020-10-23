import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Popup, Button, Modal, Menu } from 'semantic-ui-react'
import {
  setSelected,
  setTarget,
  deleteFile,
  unsetSelected,
  fetchFiles,
  editFile,
} from '../actions/index'
import PropTypes from 'prop-types'

import EditModal from './edit-modal'

import index from './css/index.css'
import popup from './css/popup.css'
import ConfirmModal from './confirmModal'
class PopupView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopupOpen: false,
    }
    this.contextRef = React.createRef()
  }
  handlePopupToggle = (e, value) => {
    this.setState({
      isPopupOpen: value,
    })
    if (e && e.type === 'click') {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  render() {
    const { isPopupOpen } = this.state
    const { options, handleOptions, ...props } = this.props
    return (
      <React.Fragment>
        <Popup
          trigger={
            <Button icon floated="right">
              <Icon name="ellipsis horizontal" />
            </Button>
          }
          open={isPopupOpen}
          onClose={e => this.handlePopupToggle(e, false)}
          onOpen={e => this.handlePopupToggle(e, true)}
          wide
          flowing
          on="click"
          position="left center"
          styleName="popup.padding-edit"
          {...props}
        >
          <Menu vertical>
            {options.map(option => (
              <Menu.Item
                key={option.key}
                name={option.label}
                icon={option.icon ? option.icon : false}
                onClick={() => {
                  this.setState({ isPopupOpen: false })
                  handleOptions[option.key]()
                }}
              />
            ))}
          </Menu>
        </Popup>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentData: state.files.currentData,
    progress: state.files.progressArray,
    tabular: state.files.tabular,
    isSelected: state.files.isSelected,
    selectedData: state.files.selectedData,
  }
}

PopupView.propTypes = {
  options: PropTypes.array,
  handleOptions: PropTypes.object,
  onClick: PropTypes.func,
}
PopupView.defaultProps = {
  options: [],
  handleOptions: {},
  onClick: () => {},
}
export default connect(mapStateToProps)(PopupView)
