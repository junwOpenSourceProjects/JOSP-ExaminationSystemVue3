import request from '~/utils/request'
export function getCollegeList() { return request({ url: '/college/list', method: 'get' }) }
export function getStudentPage(params) { return request({ url: '/student/page', method: 'get', params }) }
export function login(data) { return request({ url: '/login', method: 'post', data }) }
