import request from '~/utils/request'

export function login(data) {
  return request({ url: '/login', method: 'post', data })
}

export function getCollegeList(params) {
  return request({ url: '/college/list', method: 'get', params })
}

export function getStudentList(params) {
  return request({ url: '/student/list', method: 'get', params })
}

export function getAcademyLineList(params) {
  return request({ url: '/academy/line/list', method: 'get', params })
}

export function getNationalLineList(params) {
  return request({ url: '/national/line/list', method: 'get', params })
}

export function getCollegeLineList(params) {
  return request({ url: '/college/line/list', method: 'get', params })
}

export function getReviewListAll(params) {
  return request({ url: '/review/list/all', method: 'get', params })
}

export function getReviewListMarxism(params) {
  return request({ url: '/review/list/marxism', method: 'get', params })
}
