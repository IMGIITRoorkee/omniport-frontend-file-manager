// Frontend
export function urlFilesDisplay () {
    return `/file/file`
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
