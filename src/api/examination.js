import request from '@/utils/request'

export function fetchReviewListMarxism(query) {
  return request({
    url: '/vue-element-admin/ReviewListMarxism/list',
    method: 'get',
    params: query
  })
}
export function insertOrUpdateReviewListMarxism(data) {
  return request({
    url: '/vue-element-admin/ReviewListMarxism/insertOrUpdate',
    method: 'post',
    params: data
  })
}
