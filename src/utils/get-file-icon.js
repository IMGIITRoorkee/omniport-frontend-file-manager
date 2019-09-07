export function getFileIcon(upload) {
  let type = upload.slice(upload.indexOf('.')+1)
  let return_type
  type === 'pdf'
    ? (return_type = 'file pdf outline')
    : type === 'png' || type === 'jpg' || type === 'jpeg'
    ? (return_type = 'file image outline')
    : (return_type = 'folder outline')
    return return_type
}
