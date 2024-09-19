import request from '@/utils/request'

const api = '/tags'

// 标签
export const listTag = () => {
  return request({
    url: `${api}/list`,
    method: 'get'
  })
}
