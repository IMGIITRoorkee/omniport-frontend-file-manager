import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb } from 'semantic-ui-react'
import index from './css/index.css'

class Progress extends Component {
  componentDidMount() {}
  handleClick = data => {
    // console.log(data, 'dajgsjk')
  }
  render() {
    const { progress } = this.props
    console.log(progress,'dasjhdjik')
    return (
      <div>
        <Breadcrumb>
          {progress &&
            progress.map((data, index) => (
              <React.Fragment>
                <React.Fragment>
                  {index > 0 ? (
                    <Breadcrumb.Divider icon="right chevron" />
                  ) : null}
                </React.Fragment>
                <Breadcrumb.Section
                  link
                  onClick={() => this.handleClick(data)}
                >
                  {data}
                </Breadcrumb.Section>
              </React.Fragment>
            ))}
        </Breadcrumb>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    progress: state.files.progressArray
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Progress)
