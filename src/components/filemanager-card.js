import React, { Component } from 'react'
import {
  Card,
  CardHeader,
  CardMeta,
  Progress,
  Image,
  Icon
} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Filemanagercard extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    const { filemanagername, contentSize, maxSpace } = this.props
    let percentage = (contentSize * 100) / maxSpace
    return (
      <Card as={Link} to={`/file-manager/${filemanagername}`}>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://img2.pngio.com/yellow-folder-transparent-png-clipart-free-download-ywd-yellow-folder-png-2400_1729.png'
          />
          <Card.Header>{filemanagername}</Card.Header>
          <Card.Meta>filemanager</Card.Meta>
          <Card.Description>
            <Progress percent={percentage} color='red' size='small'>
              {percentage}%
            </Progress>
            {contentSize}/{maxSpace} MB used
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}

export default Filemanagercard
