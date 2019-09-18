import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'
import { setSelected } from '../actions/index'
import { getFileIcon } from '../utils/get-file-icon'
import { getTheme } from 'formula_one'

import index from './css/index.css'
class TabularView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: ''
    }
  }
  handleClick = (pk, fileName, link, index, isPublic) => {
    const { setSelected } = this.props
    this.setState({
      active: index
    })
    setSelected({ pk, fileName, link, isPublic })
  }
  handledoubleClick = () => {
    // console.log('dahsgdhj')
  }
  render() {
    const { currentData } = this.props
    const { active } = this.state
    return (
      <Table singleLine styleName="index.table-main" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Public</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body styleName="index.table-body">
          {currentData &&
            currentData.files &&
            currentData.files.map((file, index) => (
              <Table.Row
                key={index}
                active={active === index}
                styleName="index.table-row"
                onClick={() =>
                  this.handleClick(
                    file.id,
                    file.fileName,
                    file.upload,
                    index,
                    file.isPublic
                  )
                }
                onDoubleClick={() => this.handledoubleClick(file.id, index)}
              >
                <Table.Cell>
                  <Icon
                    size="large"
                    name={getFileIcon(file.path)}
                    color={getTheme()}
                  />
                  {file.fileName}
                </Table.Cell>
                <Table.Cell>{file.isPublic ? 'True' : 'False'}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentData: state.files.currentData,
    progress: state.files.progressArray,
    tabular: state.files.tabular
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSelected: data => {
      dispatch(setSelected(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabularView)