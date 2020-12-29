/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Modal, Icon, Button } from 'semantic-ui-react'

import css from './css/uploadFileModal.css'

function MyDropzone(props) {
  const {
    files = [],
    setFiles = () => {},
    isMultiple = false,
    acceptedFiles,
    handleUpload,
    isUploading,
    label
  } = props
  const [tempFiles, setTempFiles] = useState([])

  useEffect(() => {
    return () => {
      setFiles([])
    }
  }, [])

  useEffect(() => {
    const newArr = [...files, ...tempFiles]
    setFiles(newArr)
  }, [tempFiles])

  const thumbs = files
    .filter(file => file.type.match('image/'))
    .map((file, index) => {
      return (
        <div key={index}>
          <div styleName='css.thumb' key={file.name}>
            <div>
              <img src={file.preview} alt={file.name} styleName='css.image' />
            </div>
            <div style={{ position: 'relative' }}>
              <Icon
                name='remove'
                styleName='css.thumb-cross'
                circular
                color='grey'
                bordered={false}
                onClick={() => {
                  const index = files.indexOf(file)
                  const newFiles = files.slice(0)
                  newFiles.splice(index, 1)
                  URL.revokeObjectURL(file.preview)
                  setFiles(newFiles)
                }}
              />
            </div>
          </div>
        </div>
      )
    })

  const fileNames = files
    .filter(file => !file.type.match('image/'))
    .map((file, index) => {
      return (
        <div key={index} styleName='css.file'>
          <div style={{ paddingTop: '10px' }}>
            <a href={file.url} styleName='css.fileName'>
              {file.name}
            </a>
          </div>{' '}
          <div style={{ position: 'relative' }}>
            <Icon
              name='remove'
              styleName='css.thumb-cross'
              circular
              color='grey'
              onClick={() => {
                const index = files.indexOf(file)
                const newFiles = files.slice(0)
                newFiles.splice(index, 1)
                URL.revokeObjectURL(file.preview)
                setFiles(newFiles)
              }}
            />
          </div>
        </div>
      )
    })

  const onDrop = useCallback(acceptedFiles => {
    setTempFiles(
      acceptedFiles.map(file => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      })
    )
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFiles,
    multiple: isMultiple,
    onDrop
  })

  return (
    <Modal.Content>
      <Modal.Description>
        <div {...getRootProps()} styleName='css.dropzone'>
          <input {...getInputProps()} />
          <Icon name='cloud upload' color='grey' />
          {label}
        </div>
      </Modal.Description>
      <Modal.Description>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {thumbs && thumbs.length !== 0 && (
            <div styleName='css.thumb-container'>{thumbs}</div>
          )}
          <div styleName='css.thumb-container'>{fileNames}</div>
        </div>
        {files.length > 0 && (
          <div>
            <Button
              loading={isUploading}
              disabled={isUploading}
              onClick={handleUpload}
              label='Upload'
              icon='upload'
              primary
            />
          </div>
        )}
      </Modal.Description>
    </Modal.Content>
  )
}

const UploadFilesModal = props => {
  const {
    show,
    onHide,
    label = 'Click or drag files to upload',
    ...restProps
  } = props

  return (
    <Modal open={show} centered onClose={onHide} closeIcon>
      <MyDropzone label={label} {...restProps} />
    </Modal>
  )
}

export default UploadFilesModal
