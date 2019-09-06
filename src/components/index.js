import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'
import Bar from './bar'
import { setfiles } from '../../actions/index'
import Progress from './progress'
import index from './css/index.css'
import { getFileIcon } from '../../utils/get-file-icon'
import { getTheme } from 'formula_one'

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: ''
    }
  }
  componentDidMount() {
    this.props.SetFiles()
  }
  handleClick = (id, index) => {
    this.setState({
      active: index
    })
  }
  handledoubleClick = () => {
    // console.log('dahsgdhj')
  }
  render() {
    const { currentData } = this.props
    const { active } = this.state
    return (
      <React.Fragment>
        <Bar />
        <Progress />
        <Table singleLine styleName="index.table-main" selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Public</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
            <Table.Body styleName='index.table-body'>
              {currentData &&
                currentData.files &&
                currentData.files.map((file, index) => (
                  <Table.Row
                    key={index}
                    active={active === index}
                    onClick={() => this.handleClick(file.id, index)}
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
                    <Table.Cell>
                      {file.isPublic === 'true' ? 'True' : 'False'}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
        </Table>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentData: state.test.currentData,
    progress: state.test.progressArray
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SetFiles: () => {
      dispatch(setfiles())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test)
