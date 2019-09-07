import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Header } from 'semantic-ui-react'
import { getFileIcon } from '../utils/get-file-icon'
import { getTheme } from 'formula_one'

class FileCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: ''
    }
  }
  componentDidMount() {}
  render() {
    const { fileName, link } = this.props
    console.log(this.props)
    return (
      <React.Fragment>
        <div>
          <Icon size="huge" color={getTheme()} name={getFileIcon(link)} />
          <Header as="h3" textAlign="center" content={fileName} />
        </div>
      </React.Fragment>
    )
  }
}

export default connect(
  null,
  null
)(FileCard)
