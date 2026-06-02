import request from '~/utils/request'
export function minimaxApi(data) { return request({ url: '/minimax', method: 'post', data }) }
