import request from '@/utils/request'

const api = '/category'

// 分类
export const listCategory = () => {
  return request({
    url: `${api}/list`,
    method: 'get'
  })
}
