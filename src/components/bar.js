import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Segment,Button} from 'semantic-ui-react'
import file from './css/file.css'
import Upload from './app-upload'

class Bar extends Component {
  componentDidMount() {
  }
  handleClick=()=>{
      // console.log("sdjagk")
  }
  render() {
    const {isSelected} = this.props
    return (
      <Segment styleName='file.navbar'>
          <div styleName='file.navbar-first'>
            <div>
                <Button onClick={this.handleClick} icon='angle left' />
            </div>
            <div>
                <Button icon='angle right' />
            </div>
          </div>
          <div styleName='file.navbar-first'>
            <div>
                <Button onClick={this.handleClick} icon='add square' />
            </div>
            <div>
                <Upload />
            </div>
            <div>
                <Button disabled={!isSelected} onClick={this.handleClick} icon='download' />
            </div>
            <div>
                <Button disabled={!isSelected} icon='delete' />
            </div>
          </div>
      </Segment>
    )
  }
}

const mapStateToProps = state => {
  return {
    isSelected: state.test.isSelected
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SetFiles: () => {
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar)
