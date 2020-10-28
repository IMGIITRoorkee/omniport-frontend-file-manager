import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb } from 'semantic-ui-react'

import index from './css/index.css'

class Progress extends Component {
  handleClick = data => {
  }
  render() {
    const { progress } = this.props
    return (
      <div styleName='index.progress-parent'>
        <Breadcrumb size="huge">
          <Breadcrumb.Section link>Root</Breadcrumb.Section>
          {/* {progress &&
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
            ))} */}
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
