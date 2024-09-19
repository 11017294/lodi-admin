import request from '@/utils/request'

const api = '/article'

// 分页获取文章
export function getArticlePage(data) {
  return request({
    url: `${api}/page`,
    method: 'get',
    params: data
  })
}

// 删除文章
export function deleteArticle(data) {
  return request({
    url: `${api}/delete`,
    method: 'delete',
    data
  })
}

// 发布文章
export const publishArticle = (data) => {
  return request({
    url: `${api}/publish`,
    method: 'post',
    data
  })
}

// 取消文章发布
export const cancelPublishArticle = (data) => {
  return request({
    url: `${api}/cancelPublish`,
    method: 'post',
    data
  })
}

// 开启评论
export const openComment = (data) => {
  return request({
    url: `${api}/openComment`,
    method: 'post',
    data
  })
}

// 关闭评论
export const closeComment = (data) => {
  return request({
    url: `${api}/closeComment`,
    method: 'post',
    data
  })
}
