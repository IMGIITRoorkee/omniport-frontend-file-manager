// Backend
export const FILE_APIS = {
  fileItem: '/files',
  filesShared: '/files/shared_with_me',
  bulkDelete: 'bulk_delete/',
  copy: 'copy_file/'
}

export const FOLDER_APIS = {
  folderItem: '/folder',
  getRoot: '/folder/get_root',
  getRootFolders: '/folder/get_root_folders',
  getAllDataRequests: '/folder/get_data_request/',
  handleRequest: 'handle_request/',
  generateDataRequest: 'generate_data_request/',
  foldersShared: '/folder/shared_with_me',
  starred_items: '/all_starred_items/',
  bulkDelete: 'bulk_delete/',
  parents: 'parents/',
  copy: 'copy_folder/'
}

export const SHARED_ITEMS_APIS = {
  sharedWithMe: '/all_shared_items',
  sharedItem: '/shared_item'
}

export const USER_APIS = {
  getUserOptions: '/api/yellow_pages/person/',
  isAdmin: '/is_admin_rights/'
}

export const FILEMANAGER_APIS = {
  filemanagerItem: '/filemanager'
}
