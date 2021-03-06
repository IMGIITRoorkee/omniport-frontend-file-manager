import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'
import { getParentFolders, setParentFolders } from '../actions/folderActions'
import { BASE_URL } from '../constants'
import index from './css/index.css'

class Progress extends Component {
  handleClick = data => {
    const { viewingSharedItems } = this.props
    if (data.id) {
      if (viewingSharedItems) {
        const uuid = this.props.match.params.uuid
          ? this.props.match.params.uuid
          : data.sharingId
        const type_shared = this.props.match.type_shared
          ? this.props.match.type_shared
          : 'folder'
        const url = `${BASE_URL}/${this.props.match.params.filemanager}/${uuid}/${type_shared}/${data.id}/folder/`
        this.props.history.push(url)
      } else {
        const url = `${BASE_URL}/${this.props.match.params.filemanager}/${data.id}/`
        this.props.history.push(url)
      }
    }
  }

  componentDidMount = () => {
    const { match, getParentFolders, setParentFolders, parents } = this.props
    if (match.params.id) {
      if (/^\d+$/.test(match.params.id)) {
        getParentFolders(match.params.id)
      } else if (match.params.id === 'shared_with_me') {
        setParentFolders([])
      } else if (match.params.id === 'all_starred_items') {
        setParentFolders([])
      }
    }
  }

  componentDidUpdate = prevprops => {
    const {
      match,
      folder,
      getParentFolders,
      setParentFolders,
      parents
    } = this.props
    if (JSON.stringify(prevprops.folder) !== JSON.stringify(folder)) {
      if (folder.id) {
        getParentFolders(folder.id)
      }
    }

    if (parents.length > 0) {
      if (match.params.id === 'shared_with_me') {
        setParentFolders([])
      } else if (match.params.id === 'all_starred_items') {
        setParentFolders([])
      }
    }
  }

  render() {
    const {
      parents,
      isParentsPending,
      folder,
      viewingSharedItems,
      viewingStarredItems
    } = this.props
    const arr = parents.slice(1)
    return (
      <div styleName='index.progress-parent'>
        <Breadcrumb size='huge'>
          {!isParentsPending ? (
            <>
              <Breadcrumb.Section
                onClick={() => {
                  this.props.history.push(`${BASE_URL}/`)
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
                    `${BASE_URL}/${this.props.match.params.filemanager}/`
                  )
                }}
                link
              >
                {folder.filemanagername}
              </Breadcrumb.Section>
              {viewingSharedItems || viewingStarredItems ? (
                <React.Fragment>
                  <Breadcrumb.Divider icon='right chevron' />
                </React.Fragment>
              ) : (
                ''
              )}
              {viewingSharedItems ? (
                <Breadcrumb.Section
                  onClick={() => {
                    this.props.history.push(
                      `${BASE_URL}/${this.props.match.params.filemanager}/shared_with_me`
                    )
                  }}
                  link
                >
                  shared with me
                </Breadcrumb.Section>
              ) : viewingStarredItems ? (
                <Breadcrumb.Section
                  onClick={() => {
                    this.props.history.push(
                      `${BASE_URL}/${this.props.match.params.filemanager}/all_starred_items/`
                    )
                  }}
                  link
                >
                  Starred
                </Breadcrumb.Section>
              ) : (
                ''
              )}
              {arr && arr.length
                ? arr.map((data, index) => (
                    <React.Fragment>
                      <React.Fragment key={index}>
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
    viewingStarredItems: state.items.viewingStarredItems,
    isParentsPending: state.folders.getParentsPending
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getParentFolders: id => {
      dispatch(getParentFolders(id))
    },
    setParentFolders: data => dispatch(setParentFolders(data))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Progress)
)
