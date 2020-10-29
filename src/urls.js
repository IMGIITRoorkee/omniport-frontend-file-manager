// Backend
// export function urlBase () {
//   return `/api/django_filemanager/`
// }

// export function urlFilesList () {
//   return `${urlBase()}folder`
// }

// // export function urlUploadFile () {
// //   return `${urlBase()}upload/`
// // }

// export function urlDeleteFile (pk) {
//   return `${urlBase()}delete_file/${pk}/`
// }

// export function urlEditFile (pk) {
//   return `${urlBase()}edit_file/${pk}/`
// }

// export function urlFolderFiles (pk) {
//   return `${urlBase()}folder/${pk}/files/`
// }

// export function urlFile (pk) {
//   return `files/${pk}/`
// }

// export function urlUploadFile () {
//   return `files/`
// }

export const FILE_APIS = {
  fileItem: '/files'
}

export const FOLDER_APIS = {
  folderItem: '/folder',
  getRoot: '/folder/get_root',
  getRootFolders: '/folder/get_root_folders'
}
