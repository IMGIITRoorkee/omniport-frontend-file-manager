// Frontend
export function urlFilesDisplay () {
    return `/file_manager/file`
}

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
