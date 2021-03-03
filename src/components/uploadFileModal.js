/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileIcon } from 'react-file-icon'
import { Modal, Icon, Button, Card, Image, Grid } from 'semantic-ui-react'
import { FILE_TYPES } from '../constants'

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
        <Card key={index} fluid>
          <Card.Content styleName='css.card-content'>
            <Grid styleName='css.card-grid' columns={2}>
              <Grid.Row verticalAlign='middle' styleName='css.card-row'>
                <Grid.Column width='7'>
                  <Image src={file.preview} styleName='css.image-new' />
                </Grid.Column>
                <Grid.Column stretched>{file.name}</Grid.Column>
              </Grid.Row>
            </Grid>

            <Icon
              name='remove'
              styleName='css.thumb-cross'
              circular
              color='grey'
              bordered={false}
              disabled={isUploading}
              onClick={() => {
                if (!isUploading) {
                  const index = files.indexOf(file)
                  const newFiles = files.slice(0)
                  newFiles.splice(index, 1)
                  URL.revokeObjectURL(file.preview)
                  setFiles(newFiles)
                }
              }}
            />
          </Card.Content>
        </Card>
      )
    })

  const fileNames = files
    .filter(file => !file.type.match('image/'))
    .map((file, index) => {
      console.log(file)
      const extension = file.name.split('.').pop()
      return (
        <Card key={index} fluid>
          <Card.Content styleName='css.card-content'>
            <Grid styleName='css.card-grid'>
              <Grid.Row verticalAlign='middle' styleName='css.card-row'>
                <Grid.Column width='4'>
                  <div style={{ height: '3rem', width: '2.5rem' }}>
                    <FileIcon
                      {...FILE_TYPES[extension]}
                      extension={extension}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column stretched>{file.name}</Grid.Column>
              </Grid.Row>
            </Grid>

            <Icon
              name='remove'
              styleName='css.thumb-cross'
              circular
              color='grey'
              disabled={isUploading}
              onClick={() => {
                if (!isUploading) {
                  const index = files.indexOf(file)
                  const newFiles = files.slice(0)
                  newFiles.splice(index, 1)
                  URL.revokeObjectURL(file.preview)
                  setFiles(newFiles)
                }
              }}
            />
          </Card.Content>
        </Card>
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
        <div
          style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '50vh' }}
        >
          {thumbs && thumbs.length !== 0 && (
            <div styleName='css.thumb-container'>
              <Card.Group stackable itemsPerRow={2}>
                {thumbs}
              </Card.Group>
            </div>
          )}
          <div styleName='css.thumb-container'>
            <Card.Group stackable itemsPerRow={2}>
              {fileNames}
            </Card.Group>
          </div>
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
