import request from '@/utils/request'

// 马院复试名单查询
export function fetchReviewListMarxism(query) {
  return request({
    url: '/ReviewListMarxism/list',
    method: 'get',
    params: query
  })
}
export function insertOrUpdateReviewListMarxism(data) {
  return request({
    url: '/ReviewListMarxism/insertOrUpdate',
    method: 'post',
    params: data
  })
}

// 所有学院复试名单查询
export function fetchReviewListAll(query) {
  return request({
    url: '/ReviewListAll/list',
    method: 'get',
    params: query
  })
}
export function insertOrUpdateReviewListAll(data) {
  return request({
    url: '/ReviewListAll/insertOrUpdate',
    method: 'post',
    params: data
  })
}

// 查询国家线
export function fetchNationLine(query) {
  return request({
    url: '/NationLine/list',
    method: 'get',
    params: query
  })
}
export function insertOrUpdateNationLine(data) {
  return request({
    url: '/NationLine/insertOrUpdate',
    method: 'post',
    params: data
  })
}

// 查询院线均分
export function fetchAcademyGenerateScore(query) {
  return request({
    url: '/AcademyGenerateScore/list',
    method: 'get',
    params: query
  })
}
export function insertOrUpdateAcademyGenerateScore(data) {
  return request({
    url: '/AcademyGenerateScore/insertOrUpdate',
    method: 'post',
    params: data
  })
}

// 查询院线
export function fetchAcademyLine(query) {
  return request({
    url: '/AcademyLine/list',
    method: 'get',
    params: query
  })
}
export function insertOrUpdateAcademyLine(data) {
  return request({
    url: '/AcademyLine/insertOrUpdate',
    method: 'post',
    params: data
  })
}

// 查询校线
export function fetchCollegeLine(query) {
  return request({
    url: '/CollegeLine/list',
    method: 'get',
    params: query
  })
}
export function insertOrUpdateCollegeLine(data) {
  return request({
    url: '/CollegeLine/insertOrUpdate',
    method: 'post',
    params: data
  })
}

// 学院名称表
export function fetchCollege(query) {
  return request({
    url: '/College/list',
    method: 'get',
    params: query
  })
}
export function fetchAcademyList() {
  return request({
    url: '/College/academyList',
    method: 'get',
    params: {}
  })
}
export function insertOrUpdateCollege(data) {
  return request({
    url: '/College/insertOrUpdate',
    method: 'post',
    params: data
  })
}
