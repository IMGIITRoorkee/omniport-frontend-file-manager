export function getFileIcon(upload) {
  let type = upload.slice(upload.indexOf('.')+1)
  let return_type
  type === 'pdf'
    ? (return_type = 'file pdf')
    : type === 'png' || type === 'jpg' || type === 'jpeg'
    ? (return_type = 'file image')
    : (return_type = 'folder')
    return return_type
}
