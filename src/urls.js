// Backend
export function urlBase () {
  return `/api/django_filemanager/`
}

export function urlFilesList () {
  return `${urlBase()}folder`
}

export function urlUploadFile () {
  return `${urlBase()}upload/`
}

export function urlDeleteFile (pk) {
  return `${urlBase()}delete_file/${pk}/`
}

export function urlEditFile (pk) {
  return `${urlBase()}edit_file/${pk}/`
}

export const FOLDER_APIS = {
  folderItem: '/folder',
  getRoot: '/folder/get_root',
  getRootFolders: '/folder/get_root_folders'
}
