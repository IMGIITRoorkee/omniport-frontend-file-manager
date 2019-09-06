import React, { Component } from 'react'
import { connect } from 'react-redux'
import { urlFilesDisplay } from '../urls'
import { Editor } from '@tinymce/tinymce-react'
import apiKey from '../../config.json'
import main from 'formula_one/src/css/app.css'
import blocks from './css/app.css'

class AppEditor extends Component {
  some = data => {
    console.log(data)
  }
  handleClick = (callback, value, meta) => {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=1000px,height=500px,left=100px,top=100px`
    window.open(urlFilesDisplay(), 'title', params)

    function some(data) {
      console.log(data)
    }

    let tushar = localStorage.getItem('file_url')
    if (tushar) {
      callback(tushar, { alt: 'My Image' })
    }
  }
  render() {
    return (
      <React.Fragment>
        <Editor
          apiKey={apiKey}
          init={{
            plugins: 'link image code',
            toolbar: 'insert',
            insert_button_items: 'image link | inserttable',
            file_picker_callback: (callback, value, meta) => {
              this.handleClick(callback, value, meta)
            },
            file_browser_callback_types: 'file image media',
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
