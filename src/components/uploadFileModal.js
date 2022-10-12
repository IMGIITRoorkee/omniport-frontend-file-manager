/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileIcon } from 'react-file-icon'
import { connect } from 'react-redux'
import {
  Modal,
  Icon,
  Button,
  Card,
  Image,
  Grid,
  Segment,
  Progress,
  Message
} from 'semantic-ui-react'
import { fileUploadingStatus, FILE_TYPES } from '../constants'
import { createId } from '../helpers/helperfunctions'

import css from './css/uploadFileModal.css'

function MyDropzone(props) {
  const {
    files = [],
    setFiles = () => {},
    isMultiple = false,
    acceptedFiles,
    handleUpload,
    isUploading,
    label,
    uploadingFileData
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
    .map(file => {
      return (
        <Card key={file.unique_id} fluid>
          <Card.Content styleName='css.card-content'>
            <Grid styleName='css.card-grid' columns={1}>
              <Grid.Column verticalAlign='middle' styleName='css.card-row'>
                <Grid.Row width='7'>
                  <Image
                    src={file.preview}
                    styleName='css.image-new'
                    disabled={
                      uploadingFileData[file.unique_id] !== undefined &&
                      uploadingFileData[file.unique_id].status !==
                        fileUploadingStatus.FINISHED
                    }
                  />
                </Grid.Row>
                <Grid.Row width='5'>
                  <Segment basic>
                    {file.name}
                    {uploadingFileData[file.unique_id] !== undefined &&
                    uploadingFileData[file.unique_id].status ===
                      fileUploadingStatus.STARTED ? (
                      <Progress
                        label={`${uploadingFileData[file.unique_id].progress}%`}
                        percent={uploadingFileData[file.unique_id].progress}
                        size='tiny'
                        color='blue'
                      />
                    ) : uploadingFileData[file.unique_id] !== undefined &&
                      uploadingFileData[file.unique_id].status ===
                        fileUploadingStatus.NOT_STARTED ? (
                      <div>
                        <em>In Queue...</em>
                      </div>
                    ) : uploadingFileData[file.unique_id] !== undefined &&
                      uploadingFileData[file.unique_id].status ===
                        fileUploadingStatus.ERROR_OCCURED ? (
                      <Message compact error>
                        {'Error in Uploading File'}
                      </Message>
                    ) : null}
                  </Segment>
                </Grid.Row>
              </Grid.Column>
            </Grid>
            {!isUploading && (
              <Icon
                name='remove'
                styleName='css.thumb-cross'
                circular
                color='grey'
                bordered={false}
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
            )}
          </Card.Content>
        </Card>
      )
    })

  const fileNames = files
    .filter(file => !file.type.match('image/'))
    .map(file => {
      const extension = file.name.split('.').pop()
      return (
        <Card key={file.unique_id} fluid>
          <Card.Content styleName='css.card-content'>
            <Grid styleName='css.card-grid'>
              <Grid.Column verticalAlign='middle' styleName='css.card-row'>
                <Grid.Row width='4'>
                  <div style={{ height: '3rem', width: '2.5rem' }}>
                    <FileIcon
                      {...FILE_TYPES[extension]}
                      extension={extension}
                    />
                  </div>
                </Grid.Row>
                <Grid.Row width='5'>
                  <Segment basic>
                    {file.name}
                    {uploadingFileData[file.unique_id] !== undefined &&
                    uploadingFileData[file.unique_id].status ===
                      fileUploadingStatus.STARTED ? (
                      <Progress
                        label={`${uploadingFileData[file.unique_id].progress}%`}
                        percent={uploadingFileData[file.unique_id].progress}
                        size='tiny'
                        color='blue'
                      />
                    ) : uploadingFileData[file.unique_id] !== undefined &&
                      uploadingFileData[file.unique_id].status ===
                        fileUploadingStatus.NOT_STARTED ? (
                      <div>
                        <em>In Queue...</em>
                      </div>
                    ) : uploadingFileData[file.unique_id] !== undefined &&
                      uploadingFileData[file.unique_id].status ===
                        fileUploadingStatus.ERROR_OCCURED ? (
                      <Message compact error>
                        {'Error in Uploading File'}
                      </Message>
                    ) : null}
                  </Segment>
                </Grid.Row>
              </Grid.Column>
            </Grid>
            {!isUploading && (
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
            )}
          </Card.Content>
        </Card>
      )
    })

  const onDrop = useCallback(acceptedFiles => {
    setTempFiles(
      acceptedFiles.map(file => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          unique_id: createId()
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
      {!isUploading && (
        <Modal.Description>
          <div {...getRootProps()} styleName='css.dropzone'>
            <input {...getInputProps()} />
            <Icon name='upload' color='blue' />
            &nbsp;{label}
          </div>
        </Modal.Description>
      )}
      <Modal.Description>
        <div
          style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '50vh' }}
        >
          <div styleName='css.thumb-container'>
            <Card.Group stackable itemsPerRow={4} style={{ width: '100%' }}>
              {thumbs}
              {fileNames}
            </Card.Group>
          </div>
        </div>
        {files.length == 0 ? (
          <div>
          <Button
            disabled={true}
            icon='upload'
            color='grey'
          >
            Upload
          </Button>
        </div>
        ) : (
          <div>
            <Button
              loading={isUploading}
              disabled={isUploading}
              onClick={handleUpload}
              icon='upload'
              primary
            >
              Upload
            </Button>
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
    <Modal
      open={show}
      centered
      onClose={() => {
        if (!props.isUploading) {
          onHide()
        }
      }}
      closeIcon={!props.isUploading}
    >
      <Modal.Header>
        <Icon name='upload' color='blue' />
        &nbsp;Upload
      </Modal.Header>
      <MyDropzone label={label} {...restProps} />
    </Modal>
  )
}

const mapStateToProps = state => {
  return {
    uploadingFileData: state.files.uploadingFileData
  }
}

const mapDispatchToProps = () => ({})
export default connect(mapStateToProps, mapDispatchToProps)(UploadFilesModal)
