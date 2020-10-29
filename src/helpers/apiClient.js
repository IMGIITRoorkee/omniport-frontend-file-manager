/* eslint-disable no-undef */
import axios from 'axios'
import { getCookie } from 'formula_one'

const apiClient = axios.create({
  baseURL: `/api/django_filemanager/`,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  }
})

export default apiClient
