const configJson = require('../../config.json')

export const ITEM_TYPE = Object.freeze({
  folder: 'folder',
  file: 'file'
})

export const ACTION_TYPE = {
  COPY: 'copy',
  CUT: 'cut'
}

export const FILE_TYPES = {
  '3dm': {
    labelColor: '#8D1A11',
    type: '3d'
  },
  '3ds': {
    labelColor: '#5FB9AD',
    type: '3d'
  },
  '3g2': {
    type: 'video'
  },
  '3gp': {
    type: 'video'
  },
  '7zip': {
    type: 'compressed'
  },
  aac: {
    type: 'audio'
  },
  aep: {
    type: 'video'
  },
  ai: {
    color: '#423325',
    gradientOpacity: 0,
    labelColor: '#423325',
    labelTextColor: '#FF7F18',
    labelUppercase: true,
    foldColor: '#FF7F18',
    radius: 2
  },
  aif: {
    type: 'audio'
  },
  aiff: {
    type: 'audio'
  },
  asf: {
    type: 'video'
  },
  asp: {
    type: 'code'
  },
  aspx: {
    type: 'code'
  },
  avi: {
    type: 'video'
  },
  bin: {
    type: 'binary'
  },
  bmp: {
    type: 'image'
  },
  c: {
    type: 'code'
  },
  cpp: {
    type: 'code'
  },
  cs: {
    type: 'code'
  },
  css: {
    type: 'code'
  },
  csv: {
    type: 'spreadsheet'
  },
  cue: {
    type: 'document'
  },
  dll: {
    type: 'settings'
  },
  dmg: {
    type: 'drive'
  },
  doc: {
    color: '#2C5898',
    foldColor: '#254A80',
    glyphColor: 'rgba(255,255,255,0.4)',
    labelColor: '#2C5898',
    labelUppercase: true,
    type: 'document'
  },
  docx: {
    color: '#2C5898',
    foldColor: '#254A80',
    glyphColor: 'rgba(255,255,255,0.4)',
    labelColor: '#2C5898',
    labelUppercase: true,
    type: 'document'
  },
  dwg: {
    type: 'vector'
  },
  dxf: {
    type: 'vector'
  },
  eot: {
    type: 'font'
  },
  eps: {
    type: 'vector'
  },
  exe: {
    type: 'settings'
  },
  flac: {
    type: 'audio'
  },
  flv: {
    type: 'video'
  },
  fnt: {
    type: 'font'
  },
  fodp: {
    type: 'presentation'
  },
  fods: {
    type: 'spreadsheet'
  },
  fodt: {
    type: 'document'
  },
  fon: {
    type: 'font'
  },
  gif: {
    type: 'image'
  },
  gz: {
    type: 'compressed'
  },
  htm: {
    type: 'code'
  },
  html: {
    type: 'code'
  },
  indd: {
    color: '#4B2B36',
    gradientOpacity: 0,
    labelColor: '#4B2B36',
    labelTextColor: '#FF408C',
    labelUppercase: true,
    foldColor: '#FF408C',
    radius: 2
  },
  ini: {
    type: 'settings'
  },
  java: {
    type: 'code'
  },
  jpeg: {
    type: 'image'
  },
  jpg: {
    type: 'image'
  },
  js: {
    labelColor: '#F7DF1E',
    type: 'code'
  },
  json: {
    type: 'code'
  },
  jsx: {
    labelColor: '#00D8FF',
    type: 'code'
  },
  m4a: {
    type: 'audio'
  },
  m4v: {
    type: 'video'
  },
  max: {
    labelColor: '#5FB9AD',
    type: '3d'
  },
  md: {
    type: 'document'
  },
  mid: {
    type: 'audio'
  },
  mkv: {
    type: 'video'
  },
  mov: {
    type: 'video'
  },
  mp3: {
    type: 'audio'
  },
  mp4: {
    type: 'video'
  },
  mpeg: {
    type: 'video'
  },
  mpg: {
    type: 'video'
  },
  obj: {
    type: '3d'
  },
  odp: {
    type: 'presentation'
  },
  ods: {
    type: 'spreadsheet'
  },
  odt: {
    type: 'document'
  },
  ogg: {
    type: 'audio'
  },
  ogv: {
    type: 'video'
  },
  otf: {
    type: 'font'
  },
  pdf: {
    color: '#D93831',
    foldColor: '#D93831',
    glyphColor: 'rgba(255,255,255,0.4)',
    labelColor: '#D93831',
    type: 'acrobat'
  },
  php: {
    labelColor: '#8892BE',
    type: 'code'
  },
  pkg: {
    type: '3d'
  },
  plist: {
    type: 'settings'
  },
  png: {
    type: 'image'
  },
  ppt: {
    color: '#D14423',
    foldColor: '#AB381D',
    glyphColor: 'rgba(255,255,255,0.4)',
    labelColor: '#D14423',
    labelUppercase: true,
    type: 'presentation'
  },
  pptx: {
    color: '#D14423',
    foldColor: '#AB381D',
    glyphColor: 'rgba(255,255,255,0.4)',
    labelColor: '#D14423',
    labelUppercase: true,
    type: 'presentation'
  },
  pr: {
    type: 'video'
  },
  ps: {
    type: 'vector'
  },
  psd: {
    color: '#34364E',
    gradientOpacity: 0,
    labelColor: '#34364E',
    labelTextColor: '#31C5F0',
    labelUppercase: true,
    foldColor: '#31C5F0',
    radius: 2
  },
  py: {
    labelColor: '#FFDE57',
    type: 'code'
  },
  rar: {
    type: 'compressed'
  },
  rb: {
    labelColor: '#BB271A',
    type: 'code'
  },
  rm: {
    type: 'video'
  },
  rtf: {
    type: 'document'
  },
  scss: {
    labelColor: '#C16A98',
    type: 'code'
  },
  sitx: {
    type: 'compressed'
  },
  svg: {
    type: 'vector'
  },
  swf: {
    type: 'video'
  },
  sys: {
    type: 'settings'
  },
  tar: {
    type: 'compressed'
  },
  tex: {
    type: 'document'
  },
  tif: {
    type: 'image'
  },
  tiff: {
    type: 'image'
  },
  ts: {
    labelColor: '#3478C7',
    type: 'code'
  },
  ttf: {
    type: 'font'
  },
  txt: {
    type: 'document'
  },
  wav: {
    type: 'audio'
  },
  webm: {
    type: 'video'
  },
  wmv: {
    type: 'video'
  },
  woff: {
    type: 'font'
  },
  wpd: {
    type: 'document'
  },
  wps: {
    type: 'document'
  },
  xlr: {
    type: 'spreadsheet'
  },
  xls: {
    color: '#1A754C',
    foldColor: '#16613F',
    glyphColor: 'rgba(255,255,255,0.4)',
    labelColor: '#1A754C',
    labelUppercase: true,
    type: 'spreadsheet'
  },
  xlsx: {
    color: '#1A754C',
    foldColor: '#16613F',
    glyphColor: 'rgba(255,255,255,0.4)',
    labelColor: '#1A754C',
    labelUppercase: true,
    type: 'spreadsheet'
  },
  yml: {
    type: 'code'
  },
  zip: {
    type: 'compressed'
  },
  zipx: {
    type: 'compressed'
  }
}

export const ONE_GB = 1024 * 1024 * 1024
export const ONE_MB = 1024 * 1024
export const ONE_KB = 1024

export const spaceOptions = [
  { key: '1', text: '1 GB', value: 1 * ONE_GB },
  { key: '2', text: '2 GB', value: 2 * ONE_GB },
  { key: '3', text: '5 GB', value: 5 * ONE_GB },
  { key: '4', text: '10 GB', value: 10 * ONE_GB }
]

export const spaceOptionUnits = [
  { key: '1', text: 'GB', value: ONE_GB },
  { key: '2', text: 'MB', value: ONE_MB },
  { key: '3', text: 'KB', value: ONE_KB }
]

export const roleOptions = [
  { key: '1', text: 'Student', value: 'Student' },
  { key: '2', text: 'FacultyMember', value: 'FacultyMember' },
  { key: '3', text: 'Maintainer', value: 'Maintainer' },
  { key: '4', text: 'Guest', value: 'Guest' }
]

export const RESPONSE_TYPES = Object.freeze({
  accept: 'accept',
  reject: 'reject'
})

export const REQUEST_STATUS = Object.freeze({
  NOT_MADE: '0',
  PENDING: '1',
  ACCEPT: '2',
  REJECT: '3'
})

export const IMAGE_EXTENSIONS = ['jpg', 'png', 'jpeg', 'svg', '']

export const MAINTAINER_DESIGNATIONS = Object.freeze({
  WEBMASTER: 'Webmaster',
  HUB_COORDINATOR: 'Hub coordinator',
  PROJECT_LEADER: 'Project leader',
  COORDINATOR: 'Coordinator',
  TECHNICAL_ADVISER: 'Technical adviser'
})
export const PERSON_ROLES = Object.freeze({
  STUDENT: 'Student',
  FACULTY_MEMBER: 'FacultyMember',
  MAINTAINER: 'Maintainer',
  GUEST: 'Guest'
})

export const BASE_URL = configJson.baseUrl

export const BASE_PROTECTED_URL = '/api/django_filemanager/media_files/'

export const creators = [
  {
    name: 'Tushar Varshney',
    role: 'Frontend Developer',
    link: 'https://github.com/Tushar19varshney'
  },
  {
    name: 'Gauransh Dingwani',
    role: 'Frontend & Backend Developer',
    link: 'https://github.com/gauransh7'
  },
  {
    name: 'Ayush Bansal',
    role: 'Frontend & Backend Developer',
    link: 'https://github.com/ayu023ban'
  },
  {
    name: 'Sanjeet Manna',
    role: 'Frontend & Backend Developer',
    link: 'https://github.com/mrstark14'
  }
]

export const fileUploadingStatus = Object.freeze({
  NOT_STARTED: 'notStarted',
  STARTED: 'started',
  FINISHED: 'finished',
  ERROR_OCCURED: 'errorOccured'
})
