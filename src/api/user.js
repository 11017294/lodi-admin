import request from '@/utils/request'

const api = '/auth'

export function login(data) {
  return request({
    url: `${api}/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${api}/get`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: `${api}/logout`,
    method: 'post'
  })
}
