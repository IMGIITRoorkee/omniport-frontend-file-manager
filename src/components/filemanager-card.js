import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Progress, Image, Icon, Label } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import RequestData from './requestData'
import { setActiveFolder } from '../actions/folderActions'

import main from './css/filemanager-card.css'
import { ONE_GB, REQUEST_STATUS } from '../constants'
import { formatStorage } from '../helpers/helperfunctions'

class Filemanagercard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showExtra: false,
    }
  }
  render() {
    const { folder, setActiveFolder, currentFolder } = this.props
    let percentage = (folder.contentSize * 100) / folder.maxSpace
    percentage = percentage.toFixed(2)
    let content = formatStorage(folder.contentSize)
    let maxSpace = (folder.maxSpace / ONE_GB).toFixed(2)
    return (
      <Card
        styleName="filemanager-card"
        onDoubleClick={() => {
          const url = `/file-manager/${folder.filemanagerUrlPath}/`
          this.props.history.push(url)
        }}
        onClick={() => setActiveFolder(folder)}
      >
        <Card.Content>
          <Image
            floated="right"
            size="mini"
            src="https://img2.pngio.com/yellow-folder-transparent-png-clipart-free-download-ywd-yellow-folder-png-2400_1729.png"
          />
          <Card.Header>{folder.filemanagername}</Card.Header>
          <Card.Meta>filemanager</Card.Meta>
          <Card.Description>
            <Progress percent={percentage} color="red" size="tiny">
              {percentage}%
            </Progress>
          </Card.Description>
        </Card.Content>
        <Card.Content extra color="black">
          {content} /{maxSpace} GB used
          {currentFolder && currentFolder.id === folder.id ? (
            <span className="right floated">
              {/* <Icon name="setting" title="Storage" color="black" size="large" /> */}
              {folder.dataRequestStatus === REQUEST_STATUS.PENDING ? (
                <Label
                  color="red"
                  title={`Extra ${formatStorage(folder.additionalSpace)}`}
                  size="large"
                >
                  <Icon name="database" />
                  Space requested
                </Label>
              ) : (
                <RequestData />
              )}
            </span>
          ) : (
            ''
          )}
        </Card.Content>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentFolder: state.folders.activeFolder,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveFolder: folder => {
      return dispatch(setActiveFolder(folder))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Filemanagercard))
