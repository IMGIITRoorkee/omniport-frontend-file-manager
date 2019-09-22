import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Editor } from '@tinymce/tinymce-react'
import { urlFilesDisplay } from '../urls'
import apiKey from '../../config.json'

class AppEditor extends Component {
  handleClick = (callback, value, meta) => {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=1000px,height=500px,left=100px,top=100px`
    window.open(urlFilesDisplay(), 'title', params)

    window.addEventListener(
      'message',
      function(e) {
        if (e && e.data && e.data.file && e.data.fileName) {
          callback(e.data.file, { title: e.data.fileName })
        }
      },
      false
    )
  }
  render() {
    return (
      <React.Fragment>
        <Editor
          apiKey={apiKey}
          init={{
            plugins: 'link image code',
            toolbar: 'undo redo | link image | code',
            image_title: true,
            automatic_uploads: true,
            plugins: 'link image code',
            insert_button_items: 'image link | inserttable',
            file_picker_callback: (callback, value, meta) => {
              this.handleClick(callback, value, meta)
            },
            file_browser_callback_types: 'file image media link',
            branding: false
          }}
          menubar={false}
        />
      </React.Fragment>
    )
  }
}

export default connect(
  null,
  null
)(AppEditor)
