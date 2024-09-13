import request from '@/utils/request'

const api = '/index'

export function initCount() {
  return request({
    url: `${api}/count`,
    method: 'get'
  })
}
export function getArticleContributeCount() {
  return request({
    url: `${api}/getArticleContributeCount`,
    method: 'get'
  })
}
