import { request } from './request'

// 获取商品列表
export function getGoodsList(queryInfo) {
  return request({
    method: 'get',
    url: `/goods`,
    params: {
      queryInfo
    }
  })
}

// 删除商品
export function deleteGood(id) {
  return request({
    method: 'delete',
    url: `/goods/${id}`,
  })
}

// 添加商品
export function addGoods(form) {
  return request({
    method: 'post',
    url: `/goods`,
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      form
    }
  })
}