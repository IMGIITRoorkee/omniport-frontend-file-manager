import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'
import { getParentFolders } from '../actions/folderActions'

import index from './css/index.css'

class Progress extends Component {
  handleClick = data => {
    const { viewingSharedItems } = this.props
    if (!viewingSharedItems && data.id) {
      const url = `/file-manager/${this.props.match.params.filemanager}/${data.id}/`
      this.props.history.push(url)
    }
  }

  componentDidMount = () => {
    const { folder, getParentFolders } = this.props
    if (folder.id) {
      getParentFolders(folder.id)
    }
  }

  componentDidUpdate = prevprops => {
    const { folder, getParentFolders } = this.props
    if (JSON.stringify(prevprops.folder) !== JSON.stringify(folder)) {
      if (folder.id) {
        getParentFolders(folder.id)
      }
    }
  }

  render() {
    const { parents, isParentsPending, folder, viewingSharedItems } = this.props
    const arr = parents.slice(1)
    return (
      <div styleName='index.progress-parent'>
        <Breadcrumb size='huge'>
          {!isParentsPending ? (
            <>
              <Breadcrumb.Section
                onClick={() => {
                  this.props.history.push(`/file-manager/`)
                }}
                link
              >
                Filemanager
              </Breadcrumb.Section>
              <React.Fragment>
                <Breadcrumb.Divider icon='right chevron' />
              </React.Fragment>
              <Breadcrumb.Section
                onClick={() => {
                  this.props.history.push(
                    `/file-manager/${this.props.match.params.filemanager}/`
                  )
                }}
                link
              >
                {folder.filemanagername}
              </Breadcrumb.Section>
              {viewingSharedItems ? <React.Fragment>
                <Breadcrumb.Divider icon='right chevron' />
              </React.Fragment> : ''}
              {viewingSharedItems ? <Breadcrumb.Section
                onClick={() => {
                  this.props.history.push(
                    `/file-manager/shared_with_me/`
                  )
                }}
                link
              >
                shared_with_me
              </Breadcrumb.Section> : '' }
              {arr && arr.length
                ? arr.map((data, index) => (
                    <React.Fragment>
                      <React.Fragment>
                        {index >= 0 ? (
                          <Breadcrumb.Divider icon='right chevron' />
                        ) : null}
                      </React.Fragment>
                      <Breadcrumb.Section
                        link
                        onClick={() => this.handleClick(data)}
                      >
                        {data.folderName}
                      </Breadcrumb.Section>
                    </React.Fragment>
                  ))
                : null}
            </>
          ) : null}
        </Breadcrumb>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    folder: state.folders.selectedFolder,
    parents: state.folders.parents,
    viewingSharedItems: state.items.viewingSharedItems,
    isParentsPending: state.folders.getParentsPending
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getParentFolders: id => {
      dispatch(getParentFolders(id))
    }
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Progress)
)
